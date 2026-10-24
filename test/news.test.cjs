const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const ts = require("typescript");
const { zodResolver } = require("@hookform/resolvers/zod");
const { createFormControl } = require("react-hook-form");

require.extensions[".ts"] = (loaded, filename) =>
  loaded._compile(
    ts.transpileModule(readFileSync(filename, "utf8"), {
      fileName: filename,
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText,
    filename,
  );

const { newsSchema } = require("../src/admin/validations/news.schema.ts");
const { newsErrorDetails } = require("../src/admin/utils/newsErrors.ts");
const {
  mapNewsToCreateDto,
  mapNewsToForm,
} = require("../src/admin/mappers/news.mapper.ts");
const api = { get() {}, post() {}, patch() {}, delete() {} };
const apiFilename = require.resolve("../src/services/api.ts");
require.cache[apiFilename] = {
  id: apiFilename,
  filename: apiFilename,
  loaded: true,
  exports: { api },
};
const {
  loadNewsRelatedOptions,
} = require("../src/admin/services/newsRelated.ts");
const { newsService } = require("../src/admin/services/news.ts");
const { createGalleryService } = require("../src/admin/services/gallery.ts");

const valid = {
  title: "Notícia do grupo",
  description: "Descrição da notícia",
  date: "2026-10-23",
  category: "RESEARCH",
  isInternal: false,
  externalUrl: "https://example.org/noticia",
  relatedType: null,
  relatedId: null,
};
const uuid = "550e8400-e29b-41d4-a716-446655440000";
const internal = {
  ...valid,
  isInternal: true,
  externalUrl: "",
  relatedType: "MEETING",
  relatedId: uuid,
};

test("news gallery saves files, clears optional captions and removes photos using news routes", async (context) => {
  const gallery = createGalleryService("news");
  const file = new File(["image"], "foto.png", { type: "image/png" });
  const calls = [];
  context.mock.method(api, "post", async (path, data) => {
    calls.push(path);
    assert.equal(data.get("image").name, "foto.png");
    assert.equal(data.get("title"), "");
    assert.equal(data.get("description"), "Legenda");
    return { data: { id: "photo-id" } };
  });
  context.mock.method(api, "patch", async (path, data) => {
    calls.push(path);
    assert.deepEqual(data, { title: null, description: null });
    return { data: {} };
  });
  context.mock.method(api, "delete", async (path) => {
    calls.push(path);
  });
  await gallery.upload("news-id", file, {
    title: null,
    description: "Legenda",
  });
  await gallery.update("news-id", "photo-id", {
    title: null,
    description: null,
  });
  await gallery.remove("news-id", "photo-id");
  assert.deepEqual(calls, [
    "/news/news-id/images",
    "/news/news-id/images/photo-id",
    "/news/news-id/images/photo-id",
  ]);
});

test("blank links block saving and expose the required error under the link field", async () => {
  for (const externalUrl of ["", "   ", "\t\n"]) {
    const form = createFormControl({
      defaultValues: { ...valid, externalUrl },
      resolver: zodResolver(newsSchema),
      shouldFocusError: false,
    });
    let submissions = 0;
    await form.handleSubmit(() => submissions++)();
    assert.equal(submissions, 0);
    assert.equal(
      form.getFieldState("externalUrl").error.message,
      "Informe o link da notícia.",
    );
  }
});

test("malformed links expose URL validation errors before a request is sent", async () => {
  for (const externalUrl of ["link-invalido", "www.example.org", "https://"]) {
    const form = createFormControl({
      defaultValues: { ...valid, externalUrl },
      resolver: zodResolver(newsSchema),
      shouldFocusError: false,
    });
    let submissions = 0;
    await form.handleSubmit(() => submissions++)();
    assert.equal(submissions, 0);
    assert.equal(
      form.getFieldState("externalUrl").error.message,
      "Informe uma URL válida.",
    );
  }
});

test("a corrected link clears its validation error and submits the trimmed URL", async () => {
  const form = createFormControl({
    defaultValues: { ...valid, externalUrl: "" },
    resolver: zodResolver(newsSchema),
    shouldFocusError: false,
  });
  await form.handleSubmit(() => assert.fail("A blank link was submitted"))();
  form.setValue("externalUrl", ` ${valid.externalUrl} `);
  let submitted;
  await form.handleSubmit((data) => {
    submitted = data;
  })();
  assert.equal(submitted.externalUrl, valid.externalUrl);
  assert.equal(form.getFieldState("externalUrl").error, undefined);
});

test("API link validation messages remain available as inline field errors", () => {
  for (const message of [
    "externalUrl must be a URL address",
    ["externalUrl must be a URL address", "title must be a string"],
  ]) {
    const details = newsErrorDetails({
      isAxiosError: true,
      response: { data: { message } },
    });
    assert.deepEqual(details.fieldErrors[0], {
      field: "externalUrl",
      message: "externalUrl must be a URL address",
    });
    assert.ok(details.message.includes("externalUrl must be a URL address"));
  }
});

test("general server and connection failures remain visible below the form", () => {
  assert.deepEqual(
    newsErrorDetails({
      isAxiosError: true,
      response: { data: { message: "Não foi possível enviar a capa." } },
    }),
    {
      message: "Não foi possível enviar a capa.",
      fieldErrors: [],
    },
  );
  assert.equal(
    newsErrorDetails(new Error("Sem conexão")).message,
    "Sem conexão",
  );
  assert.ok(newsErrorDetails(null).message);
});

test("internal news saves its related record without requiring an external link", async () => {
  for (const relatedType of ["MEETING", "RESEARCH", "PRESENTED_WORK"]) {
    for (const externalUrl of ["", "link-antigo-invalido"]) {
      const form = createFormControl({
        defaultValues: { ...internal, relatedType, externalUrl },
        resolver: zodResolver(newsSchema),
        shouldFocusError: false,
      });
      let submitted;
      await form.handleSubmit((data) => {
        submitted = mapNewsToCreateDto(data);
      })();
      assert.equal(submitted.externalUrl, null);
      assert.equal(submitted.relatedType, relatedType);
      assert.equal(submitted.relatedId, uuid);
      assert.equal(mapNewsToForm(submitted).relatedType, relatedType);
    }
  }
});

test("internal news requires a category and a valid record instead of URL errors", async () => {
  for (const relatedType of [null, ""]) {
    const form = createFormControl({
      defaultValues: { ...internal, relatedType, relatedId: "" },
      resolver: zodResolver(newsSchema),
      shouldFocusError: false,
    });
    await form.handleSubmit(() =>
      assert.fail("A missing destination was saved"),
    )();
    assert.ok(form.getFieldState("relatedType").error);
    assert.ok(form.getFieldState("relatedId").error);
    assert.equal(form.getFieldState("externalUrl").error, undefined);
  }
  for (const relatedId of ["MEETING", "item-invalido"]) {
    const result = newsSchema.safeParse({ ...internal, relatedId });
    assert.equal(result.success, false);
    assert.ok(
      result.error.issues.some((issue) => issue.path[0] === "relatedId"),
    );
  }
});

test("create omits an internal URL while edits clear obsolete links and relationships with null", async (context) => {
  context.mock.method(api, "post", async (url, formData) => {
    assert.equal(url, "/news");
    assert.equal(formData.get("isInternal"), "true");
    assert.equal(formData.get("relatedType"), "MEETING");
    assert.equal(formData.get("relatedId"), uuid);
    assert.equal(formData.has("externalUrl"), false);
    return { data: {} };
  });
  await newsService.create(mapNewsToCreateDto(newsSchema.parse(internal)));
  const patches = [];
  context.mock.method(api, "patch", async (_url, data) => {
    patches.push(data);
    return { data: {} };
  });
  await newsService.updateBySlug(
    "noticia",
    mapNewsToCreateDto(newsSchema.parse(internal)),
  );
  await newsService.updateBySlug(
    "noticia",
    mapNewsToCreateDto(
      newsSchema.parse({ ...valid, relatedType: "MEETING", relatedId: uuid }),
    ),
  );
  assert.equal(patches[0].externalUrl, null);
  assert.equal(patches[1].relatedType, null);
  assert.equal(patches[1].relatedId, null);
  assert.equal(patches[1].externalUrl, valid.externalUrl);
});

test("editing preserves internal selections and drops irrelevant values from hidden fields", () => {
  const internalForm = mapNewsToForm({
    ...internal,
    externalUrl: "https://old.example.org",
  });
  assert.equal(internalForm.relatedType, "MEETING");
  assert.equal(internalForm.relatedId, uuid);
  assert.equal(internalForm.externalUrl, "");
  const externalForm = mapNewsToForm({
    ...valid,
    relatedType: "MEETING",
    relatedId: uuid,
  });
  assert.equal(externalForm.relatedType, null);
  assert.equal(externalForm.relatedId, null);
});

test("each relationship category loads actual IDs and titles from its own collection", async (context) => {
  for (const [type, resource] of [
    ["BOARD", "boards"],
    ["JURY", "juries"],
    ["MEETING", "meetings"],
    ["PRESENTED_WORK", "presented-works"],
    ["RESEARCH", "research"],
    ["RESEARCH_INSTRUMENT", "researchInstruments"],
    ["THEMATIC", "thematics"],
  ]) {
    const controller = new AbortController();
    context.mock.method(api, "get", async (url, { params, signal }) => {
      assert.equal(url, `/${resource}`);
      assert.deepEqual(params, { page: 1, limit: 100 });
      assert.equal(signal, controller.signal);
      return {
        data: [
          {
            id: uuid,
            title: `Item ${type}`,
            type: type === "MEETING" ? "SEMINAR" : "CATALOG",
          },
        ],
      };
    });
    const options = await loadNewsRelatedOptions(type, controller.signal);
    assert.equal(options[0].value, uuid);
    assert.ok(options[0].label.includes(`Item ${type}`));
    if (type === "MEETING")
      assert.ok(options[0].label.startsWith("Seminário —"));
  }
});

test("news can link both internal and external meetings without a visibility filter", async (context) => {
  context.mock.method(api, "get", async (url, { params }) => {
    assert.equal(url, "/meetings");
    assert.equal(params.isInternal, undefined);
    return {
      data: [
        {
          id: "interno",
          title: "Evento do grupo",
          type: "MEETING",
          isInternal: true,
        },
        {
          id: "externo",
          title: "Evento convidado",
          type: "SEMINAR",
          isInternal: false,
        },
      ],
    };
  });
  assert.deepEqual(await loadNewsRelatedOptions("MEETING"), [
    { value: "interno", label: "Encontro — Evento do grupo (interno)" },
    { value: "externo", label: "Seminário — Evento convidado (externo)" },
  ]);
});

test("documentary screenings are available as linked news destinations", async (context) => {
  context.mock.method(api, "get", async () => ({
    data: [
      {
        id: uuid,
        title: "Cinema e história",
        type: "DOCUMENTARY",
        isInternal: true,
      },
    ],
  }));
  assert.deepEqual(await loadNewsRelatedOptions("MEETING"), [
    {
      value: uuid,
      label: "Mostra de documentários — Cinema e história (interno)",
    },
  ]);
});

test("related selectors include records beyond the first API page", async (context) => {
  const records = Array.from({ length: 205 }, (_, index) => ({
    id: `record-${index}`,
    title: `Encontro ${index}`,
    type: "MEETING",
  }));
  const pages = [];
  context.mock.method(api, "get", async (_url, { params }) => {
    pages.push(params.page);
    return { data: records.slice((params.page - 1) * 100, params.page * 100) };
  });
  const options = await loadNewsRelatedOptions("MEETING");
  assert.deepEqual(pages, [1, 2, 3]);
  assert.equal(options.length, 205);
  assert.equal(options[204].value, "record-204");
});

test("publications include books, articles and dossiers with distinct labels", async (context) => {
  context.mock.method(api, "get", async (url) => ({
    data:
      url === "/books"
        ? [{ id: "book", title: "Livro cadastrado", year: 2025 }]
        : [
            { id: "article", title: "Artigo cadastrado", type: "ARTICLE" },
            { id: "dossier", title: "Dossiê cadastrado", type: "DOSSIER" },
          ],
  }));
  assert.deepEqual(await loadNewsRelatedOptions("PUBLICATION"), [
    { value: "book", label: "Livro — Livro cadastrado (2025)" },
    { value: "article", label: "Artigo — Artigo cadastrado" },
    { value: "dossier", label: "Dossiê — Dossiê cadastrado" },
  ]);
});

test("failed or cancelled catalogs do not return incomplete publication choices", async (context) => {
  context.mock.method(api, "get", async (url) => {
    if (url === "/articles") throw new Error("Catálogo indisponível");
    return { data: [{ id: "book", title: "Livro" }] };
  });
  await assert.rejects(
    loadNewsRelatedOptions("PUBLICATION"),
    /Catálogo indisponível/,
  );
  const controller = new AbortController();
  controller.abort();
  context.mock.method(api, "get", async (_url, { signal }) => {
    if (signal.aborted) throw new DOMException("Cancelado", "AbortError");
    return { data: [] };
  });
  await assert.rejects(loadNewsRelatedOptions("MEETING", controller.signal), {
    name: "AbortError",
  });
});
