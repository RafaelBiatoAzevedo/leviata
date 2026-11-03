const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve, dirname } = require("node:path");
const { Module } = require("node:module");
const ts = require("typescript");
const React = require("react");

function load(relative, mocks = {}) {
  const filename = resolve(__dirname, relative);
  const loaded = new Module(filename, module);
  loaded.filename = filename;
  loaded.paths = Module._nodeModulePaths(dirname(filename));
  const actual = Module.createRequire(filename);
  loaded.require = (name) =>
    Object.hasOwn(mocks, name) ? mocks[name] : actual(name);
  loaded._compile(
    ts.transpileModule(readFileSync(filename, "utf8"), {
      fileName: filename,
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
      },
    }).outputText,
    filename,
  );
  return loaded.exports;
}
const { institutionSchema } = load(
  "../src/admin/validations/institution.schema.ts",
);
const country = {
  id: "c591fe21-4980-46c5-b8d6-7e3b0a0f2700",
  code: "BR",
  name: "Brasil",
};
const item = {
  id: "51442736-694f-4ded-b551-c249bb8c51e8",
  name: "Universidade de Pesquisa",
  acronym: "UP",
  countryId: country.id,
  country,
  createdAt: "2026-11-03T12:00:00Z",
  updatedAt: "2026-11-03T12:00:00Z",
};
const data = { name: item.name, acronym: item.acronym, countryId: country.id };
const apiError = (status, message) => ({
  isAxiosError: true,
  response: { status, data: { message } },
});
const flush = () => new Promise(setImmediate);
function nodes(node, result = []) {
  React.Children.forEach(node, (child) => {
    if (React.isValidElement(child)) {
      result.push(child);
      nodes(child.props.children, result);
    }
  });
  return result;
}
const noop = () => {};
const uiNames = [
  "AdminPageHeader",
  "AdminButton",
  "AdminSearchBar",
  "AdminSelect",
  "AdminTable",
  "AdminPagination",
  "AdminIconButton",
  "AdminDeleteContent",
  "AdminError",
  "AdminInput",
  "AdminFormCard",
  "AdminFormGrid",
  "AdminSection",
  "AdminLoading",
  "AdminDescriptionList",
  "AdminDescriptionItem",
];
function harness(kind, options = {}) {
  const state = [],
    refs = [],
    effectSlots = [];
  let cursor = 0,
    refCursor = 0,
    effectCursor = 0;
  const effects = [],
    navigated = [],
    toasts = [],
    resets = [],
    errors = {};
  let modal,
    filters,
    refreshed = 0;
  const service = {
    getById: async () => ({ data: item }),
    create: async () => ({ data: item }),
    updateById: async () => ({ data: item }),
    removeById: async () => {},
    ...options.service,
  };
  const hooks = {
    ...React,
    useState(initial) {
      const i = cursor++;
      if (!(i in state))
        state[i] = typeof initial === "function" ? initial() : initial;
      return [
        state[i],
        (update) =>
          (state[i] = typeof update === "function" ? update(state[i]) : update),
      ];
    },
    useRef(initial) {
      return (refs[refCursor++] ??= { current: initial });
    },
    useEffect(callback, deps) {
      const i = effectCursor++;
      const previous = effectSlots[i];
      if (!previous || deps.some((d, j) => d !== previous.deps[j])) {
        previous?.cleanup?.();
        const slot = { deps };
        effectSlots[i] = slot;
        effects.push(() => (slot.cleanup = callback()));
      }
    },
  };
  const reset = (values) => resets.push(values);
  const mocks = {
    react: hooks,
    "react-router-dom": {
      useParams: () => ({ id: options.id }),
      useNavigate: () => (path) => navigated.push(path),
    },
    "../../../services/institution": { institutionService: service },
    "../../../services/country": {
      countryService: {
        getAll: options.getCountries ?? (async () => ({ data: [country] })),
      },
    },
    "../../../validations/institution.schema": { institutionSchema },
    "../../../utils/institution": load("../src/admin/utils/institution.ts"),
    "../../../utils/dateTime": load("../src/admin/utils/dateTime.ts"),
    "../../../hooks/useAdminData": {
      useAdminData: () => ({
        countries: [country],
        reloadInstitutions: async () => {
          refreshed++;
          await options.refresh?.();
        },
      }),
    },
    "../../../hooks/useAdminList": {
      useAdminList: (_fetcher, query) => {
        filters = query;
        return {
          items: [item],
          loading: false,
          error: "",
          load: () => refreshed++,
          pagination: { total: 31, page: 2, rowsPerPage: 15 },
          ...options.list,
        };
      },
    },
    "../../../../hooks/useToast": {
      useToast: () => ({ showToast: (toast) => toasts.push(toast) }),
    },
    "../../../../hooks/useModal": {
      useModal: () => ({ showModal: (value) => (modal = value) }),
    },
    "react-hook-form": {
      useForm: () => ({
        register: (name) => ({ name }),
        handleSubmit: (callback) => callback,
        reset,
        setError: (name, value) => (errors[name] = value),
        formState: { errors, isSubmitting: false },
      }),
    },
    "@hookform/resolvers/zod": { zodResolver: () => noop },
    "../styles": {
      Container: "container",
      Actions: "actions",
      Empty: "empty",
      Filters: "filters",
      Form: "form",
      HeaderActions: "header-actions",
    },
    "../../../components/AdminFormActions": {
      default: "form-actions",
      __esModule: true,
    },
  };
  for (const name of uiNames)
    mocks[`../../../components/${name}`] = { [name]: name };
  const exports = load(
    `../src/admin/pages/AdminInstitutions/${kind}/index.tsx`,
    mocks,
  );
  const component =
    exports[
      {
        List: "AdminInstitutions",
        Form: "InstitutionForm",
        View: "InstitutionView",
      }[kind]
    ];
  const render = () => {
    cursor = refCursor = effectCursor = 0;
    let tree = component();
    if (typeof tree.type === "function") tree = tree.type(tree.props);
    const result = nodes(tree);
    effects.splice(0).forEach((effect) => effect());
    return result;
  };
  return {
    render,
    service,
    navigated,
    toasts,
    resets,
    errors,
    get modal() {
      return modal;
    },
    get filters() {
      return filters;
    },
    get refreshed() {
      return refreshed;
    },
    unmount() {
      effectSlots.forEach((slot) => slot.cleanup?.());
    },
  };
}

test("institution validation preserves spelling and case while trimming text and requiring its country", () => {
  assert.deepEqual(
    institutionSchema.parse({
      name: " Universidade Áurea ",
      acronym: " Ua ",
      countryId: country.id,
    }),
    { name: "Universidade Áurea", acronym: "Ua", countryId: country.id },
  );
  for (const input of [
    { ...data, name: " " },
    { ...data, acronym: "" },
    { ...data, countryId: "" },
    { ...data, countryId: "invalid" },
    { ...data, name: "x".repeat(256) },
    { ...data, acronym: "x".repeat(51) },
  ])
    assert.equal(institutionSchema.safeParse(input).success, false);
});

test("institution service uses authenticated CRUD and paginated endpoints while retaining the full selector request", async () => {
  const calls = [];
  const api = Object.fromEntries(
    ["get", "post", "patch", "delete"].map((method) => [
      method,
      async (...args) => {
        calls.push([method, ...args]);
        return { data: item };
      },
    ]),
  );
  const { institutionService: s } = load(
    "../src/admin/services/institution.ts",
    { "../../services/api": { api } },
  );
  const signal = new AbortController().signal;
  await s.getAll(signal);
  await s.getPage(
    { page: 2, limit: 15, search: "UP", countryId: country.id },
    signal,
  );
  await s.getById(item.id, signal);
  await s.create(data);
  await s.updateById(item.id, { acronym: "UPR" });
  await s.removeById(item.id);
  assert.deepEqual(calls, [
    ["get", "/institutions", { signal }],
    [
      "get",
      "/institutions/paginated",
      {
        params: { page: 2, limit: 15, search: "UP", countryId: country.id },
        signal,
      },
    ],
    ["get", `/institutions/${item.id}`, { signal }],
    ["post", "/institutions", data],
    ["patch", `/institutions/${item.id}`, { acronym: "UPR" }],
    ["delete", `/institutions/${item.id}`],
  ]);
});

test("list searches by name or acronym, filters by country and carries server pagination totals", () => {
  const h = harness("List");
  let tree = h.render();
  tree
    .find((n) => n.type === "AdminSearchBar")
    .props.onChange({ target: { value: " UP " } });
  tree
    .find((n) => n.type === "AdminSelect")
    .props.onChange({ target: { value: country.id } });
  tree = h.render();
  assert.deepEqual(h.filters, { search: "UP", countryId: country.id });
  assert.equal(tree.find((n) => n.type === "AdminPagination").props.total, 31);
  assert.ok(tree.some((n) => n.props.children === country.name));
  tree
    .find((n) => n.type === "AdminIconButton" && n.props.title === "Editar")
    .props.onClick();
  assert.deepEqual(h.navigated, [`/admin/instituicoes/${item.id}/editar`]);
  assert.equal(
    tree.find((n) => n.props.title === "Excluir").props.permission,
    "delete",
  );
});

test("delete confirms first, refreshes both the list and person-form catalog only after success", async () => {
  let removed = 0;
  const h = harness("List", {
    service: {
      removeById: async (id) => {
        assert.equal(id, item.id);
        removed++;
      },
    },
  });
  h.render()
    .find((n) => n.props.title === "Excluir")
    .props.onClick();
  assert.equal(removed, 0);
  await h.modal.onConfirm();
  assert.equal(removed, 1);
  assert.equal(h.refreshed, 2);
  assert.equal(h.toasts.at(-1).type, "success");
});

test("linked-institution deletion failure retains the record and reports the API explanation", async () => {
  const h = harness("List", {
    service: {
      removeById: async () => {
        throw apiError(409, "A instituição está vinculada a pessoas.");
      },
    },
  });
  h.render()
    .find((n) => n.props.title === "Excluir")
    .props.onClick();
  await assert.rejects(h.modal.onConfirm());
  assert.equal(h.refreshed, 0);
  assert.equal(
    h.toasts[0].description,
    "A instituição está vinculada a pessoas.",
  );
});

test("loading and failed lists never claim that no institution exists", () => {
  for (const list of [
    { items: [], loading: true },
    { items: [], error: "Sem conexão" },
  ]) {
    const h = harness("List", { list });
    const tree = h.render();
    assert.ok(!tree.some((n) => n.type === "empty"));
  }
  assert.ok(
    harness("List", { list: { items: [] } })
      .render()
      .some((n) => n.type === "empty"),
  );
});

test("edit loads the registered name, acronym and country and saves against the same ID", async () => {
  let saved;
  const h = harness("Form", {
    id: item.id,
    service: {
      updateById: async (id, body) => {
        saved = { id, body };
        return { data: item };
      },
    },
  });
  assert.ok(h.render().some((n) => n.type === "AdminLoading"));
  await flush();
  let tree = h.render();
  assert.deepEqual(h.resets, [data]);
  assert.equal(
    tree.find((n) => n.type === "AdminSelect").props.options[1].value,
    country.id,
  );
  await tree
    .find((n) => n.type === "form")
    .props.onSubmit({ ...data, acronym: "UPR" });
  assert.deepEqual(saved, { id: item.id, body: { ...data, acronym: "UPR" } });
  assert.equal(h.refreshed, 1);
  assert.deepEqual(h.navigated, ["/admin/instituicoes"]);
});

test("create prevents duplicate requests and refreshes institution choices after the save", async () => {
  let finish,
    created = 0;
  const h = harness("Form", {
    service: {
      create: () => {
        created++;
        return new Promise((resolve) => (finish = resolve));
      },
    },
  });
  h.render();
  await flush();
  const submit = h.render().find((n) => n.type === "form").props.onSubmit;
  const first = submit(data);
  await submit(data);
  assert.equal(created, 1);
  finish({ data: item });
  await first;
  assert.equal(h.refreshed, 1);
  assert.deepEqual(h.navigated, ["/admin/instituicoes"]);
});

test("save failures preserve the draft and display a duplicate-name message without navigating", async () => {
  const h = harness("Form", {
    service: {
      create: async () => {
        throw apiError(409, "Já existe uma instituição com esse nome.");
      },
    },
  });
  h.render();
  await flush();
  await h
    .render()
    .find((n) => n.type === "form")
    .props.onSubmit(data);
  assert.equal(h.resets.length, 0);
  assert.equal(h.refreshed, 0);
  assert.equal(h.navigated.length, 0);
  assert.equal(
    h.errors["root.server"].message,
    "Já existe uma instituição com esse nome.",
  );
});

test("a catalog refresh failure does not turn an already saved institution into a failed save", async () => {
  const h = harness("Form", {
    refresh: async () => {
      throw Error("offline");
    },
  });
  h.render();
  await flush();
  await h
    .render()
    .find((n) => n.type === "form")
    .props.onSubmit(data);
  assert.deepEqual(
    h.toasts.map((t) => t.type),
    ["warning", "success"],
  );
  assert.deepEqual(h.navigated, ["/admin/instituicoes"]);
  assert.equal(h.errors["root.server"], undefined);
});

test("load failure blocks editing and retry loads the data before rendering the form", async () => {
  let attempts = 0;
  const h = harness("Form", {
    id: item.id,
    service: {
      getById: async () => {
        if (++attempts === 1)
          throw apiError(404, "Instituição não encontrada.");
        return { data: item };
      },
    },
  });
  h.render();
  await flush();
  let tree = h.render();
  assert.ok(tree.some((n) => n.type === "AdminError"));
  assert.ok(!tree.some((n) => n.type === "form"));
  tree
    .find(
      (n) =>
        n.type === "AdminButton" && n.props.children === "Tentar novamente",
    )
    .props.onClick();
  h.render();
  await flush();
  assert.ok(h.render().some((n) => n.type === "form"));
  assert.deepEqual(h.resets, [data]);
});

test("leaving during loading cancels requests and ignores a late response", async () => {
  let finish, signal;
  const h = harness("Form", {
    id: item.id,
    service: {
      getById: (_id, s) => {
        signal = s;
        return new Promise((resolve) => (finish = resolve));
      },
    },
  });
  h.render();
  h.unmount();
  assert.equal(signal.aborted, true);
  finish({ data: item });
  await flush();
  assert.equal(h.resets.length, 0);
  assert.equal(h.navigated.length, 0);
});

test("details show the institution and country and link back to its own edit page", async () => {
  const h = harness("View", { id: item.id });
  h.render();
  await flush();
  const tree = h.render();
  assert.equal(
    tree.find((n) => n.type === "AdminPageHeader").props.title,
    item.name,
  );
  assert.equal(
    tree.find(
      (n) => n.type === "AdminDescriptionItem" && n.props.label === "País",
    ).props.value,
    "Brasil",
  );
  tree
    .find(
      (n) =>
        n.type === "AdminButton" &&
        Array.isArray(n.props.children) &&
        n.props.children.includes(" Editar"),
    )
    .props.onClick();
  assert.deepEqual(h.navigated, [`/admin/instituicoes/${item.id}/editar`]);
});
