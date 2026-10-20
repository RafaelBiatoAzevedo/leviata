const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const { Module } = require("node:module");
const ts = require("typescript");

function loadTypeScript(relativePath, dependencies = {}) {
  const filename = resolve(__dirname, relativePath);
  const loaded = new Module(filename, module);
  const actualRequire = loaded.require.bind(loaded);
  loaded.require = (request) =>
    Object.hasOwn(dependencies, request)
      ? dependencies[request]
      : actualRequire(request);
  const { outputText } = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
    fileName: filename,
  });
  loaded._compile(outputText, filename);
  return loaded.exports;
}

const { loadAllPages } = loadTypeScript("../src/utils/loadAllPages.ts");
const api = { get() {} };
const { peopleService } = loadTypeScript("../src/admin/services/people.ts", {
  "../../services/api": { api },
  "../../utils/loadAllPages": { loadAllPages },
});

test("loads every person for the portal and selectors beyond the first 100 records", async (context) => {
  const people = Array.from({ length: 241 }, (_, id) => ({
    id: `person-${id}`,
    name: `Pessoa ${id}`,
    nationality: { code: id % 2 ? "BR" : "PT" },
  }));
  const controller = new AbortController();
  const requests = [];
  context.mock.method(api, "get", async (url, { params, signal }) => {
    assert.equal(url, "/people");
    assert.equal(signal, controller.signal);
    assert.equal(params.limit, 100);
    requests.push(params.page);
    return {
      data: people.slice((params.page - 1) * params.limit, params.page * params.limit),
    };
  });

  const result = await peopleService.getAllAvailable(controller.signal);

  assert.deepEqual(result, people);
  assert.equal(new Set(result.map((person) => person.id)).size, 241);
  assert.deepEqual(requests, [1, 2, 3]);
});

test("finishes after an empty page when the catalog has exactly 200 people", async (context) => {
  const people = Array.from({ length: 200 }, (_, id) => ({ id }));
  const requests = [];
  context.mock.method(api, "get", async (_url, { params }) => {
    requests.push(params.page);
    return {
      data: people.slice((params.page - 1) * params.limit, params.page * params.limit),
    };
  });

  assert.deepEqual(await peopleService.getAllAvailable(), people);
  assert.deepEqual(requests, [1, 2, 3]);
});

test("handles a catalog with no people in one request", async (context) => {
  const request = context.mock.method(api, "get", async () => ({ data: [] }));

  assert.deepEqual(await peopleService.getAllAvailable(), []);
  assert.equal(request.mock.callCount(), 1);
});

test("rejects a failed later page instead of returning an incomplete catalog", async (context) => {
  context.mock.method(api, "get", async (_url, { params }) => {
    if (params.page === 2) throw new Error("Page unavailable");
    return { data: Array.from({ length: params.limit }, (_, id) => ({ id })) };
  });

  await assert.rejects(peopleService.getAllAvailable(), /Page unavailable/);
});

test("propagates cancellation to subsequent catalog requests", async (context) => {
  const controller = new AbortController();
  context.mock.method(api, "get", async (_url, { params, signal }) => {
    if (signal.aborted) throw new DOMException("Cancelled", "AbortError");
    controller.abort();
    return { data: Array.from({ length: params.limit }, (_, id) => ({ id })) };
  });

  await assert.rejects(peopleService.getAllAvailable(controller.signal), {
    name: "AbortError",
  });
});

test("keeps the admin table paginated with a single request and its total", async (context) => {
  const params = { page: 2, limit: 15, search: "Ana" };
  const data = { items: [{ id: "person-16" }], total: 241, ...params };
  const request = context.mock.method(api, "get", async (url, config) => {
    assert.equal(url, "/people/paginated");
    assert.deepEqual(config.params, params);
    return { data };
  });

  assert.deepEqual((await peopleService.getPage(params)).data, data);
  assert.equal(request.mock.callCount(), 1);
});
