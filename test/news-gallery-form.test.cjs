const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve, dirname } = require("node:path");
const { Module } = require("node:module");
const ts = require("typescript");
const React = require("react");

for (const extension of [".ts", ".tsx"])
  require.extensions[extension] = (loaded, filename) =>
    loaded._compile(
      ts.transpileModule(readFileSync(filename, "utf8"), {
        fileName: filename,
        compilerOptions: {
          module: ts.ModuleKind.CommonJS,
          jsx: ts.JsxEmit.ReactJSX,
          esModuleInterop: true,
          target: ts.ScriptTarget.ES2022,
        },
      }).outputText,
      filename,
    );

function elements(node, result = []) {
  if (React.isValidElement(node)) {
    result.push(node);
    React.Children.forEach(node.props.children, (child) =>
      elements(child, result),
    );
  }
  return result;
}

function harness({ slug, record, failedUploads = 0 } = {}) {
  const values = [],
    effects = [],
    calls = [],
    errors = {},
    navigations = [];
  let index = 0;
  let data = {
    title: "Notícia",
    description: "Descrição",
    date: "2026-10-23",
    category: "EVENT",
    isInternal: false,
    externalUrl: "https://example.org/fonte",
    relatedType: null,
    relatedId: null,
  };
  const saved = { id: "saved-news-id", slug: "noticia-salva", ...record };
  const service = {
    async create(dto) {
      calls.push(["create", dto]);
      return { data: saved };
    },
    async updateById(id, dto) {
      calls.push(["update", id, dto]);
      return { data: saved };
    },
    async getBySlug(value) {
      calls.push(["load", value]);
      return { data: saved };
    },
    async updateCover(value) {
      calls.push(["cover", value]);
      return { data: { url: "https://example.org/nova-capa.jpg" } };
    },
  };
  const gallery = {
    images: [],
    load(images = []) {
      gallery.images = images;
      calls.push(["photos-loaded", images]);
    },
    async save(id) {
      calls.push(["photos-saved", id]);
      if (failedUploads-- > 0)
        throw new Error("As fotos não foram salvas. Tente novamente.");
    },
  };
  const hooks = {
    ...React,
    useState(initial) {
      const current = index++;
      if (!(current in values)) values[current] = initial;
      return [
        values[current],
        (value) => {
          values[current] =
            typeof value === "function" ? value(values[current]) : value;
        },
      ];
    },
    useCallback: (fn) => fn,
    useEffect: (fn) => effects.push(fn),
  };
  const form = {
    control: {},
    register: () => ({}),
    handleSubmit: (fn) => () => fn(data),
    reset(value) {
      data = value;
      for (const key of Object.keys(errors)) delete errors[key];
    },
    setValue(name, value) {
      data[name] = value;
    },
    setError(name, value) {
      errors[name] = value;
    },
    clearErrors(name) {
      delete errors[name];
    },
    formState: { errors, isSubmitting: false },
  };
  const overrides = {
    react: hooks,
    "react-router-dom": {
      useNavigate: () => (value) => navigations.push(value),
      useParams: () => ({ slug }),
    },
    "react-hook-form": {
      useForm: () => form,
      useWatch: () => [data.isInternal, data.relatedType, data.relatedId],
    },
    "../../../../hooks/useToast": { useToast: () => ({ showToast() {} }) },
    "../../../services/news": { newsService: service },
    "../../../hooks/useGallery": {
      useGallery: (resource) => {
        assert.equal(resource, "news");
        return gallery;
      },
    },
  };
  const filename = resolve(
    __dirname,
    "../src/admin/pages/AdminNews/Form/index.tsx",
  );
  const loaded = new Module(filename, module);
  const localRequire = Module.createRequire(filename);
  loaded.filename = filename;
  loaded.paths = Module._nodeModulePaths(dirname(filename));
  loaded.require = (name) =>
    Object.hasOwn(overrides, name) ? overrides[name] : localRequire(name);
  loaded._compile(
    ts.transpileModule(readFileSync(filename, "utf8"), {
      fileName: filename,
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText,
    filename,
  );
  function render() {
    index = 0;
    effects.length = 0;
    return elements(loaded.exports.NewsForm());
  }
  return {
    calls,
    errors,
    navigations,
    gallery,
    effects,
    render,
    submit() {
      return render()
        .find((element) => typeof element.props.onSubmit === "function")
        .props.onSubmit();
    },
  };
}

test("creating a news item saves its gallery after the parent exists", async () => {
  const form = harness();
  const gallery = form
    .render()
    .find((element) => element.props.gallery === form.gallery);
  assert.ok(gallery);
  assert.equal(gallery.props.disabled, false);
  await form.submit();
  assert.deepEqual(
    form.calls.map((call) => call[0]),
    ["create", "photos-saved"],
  );
  assert.equal(form.calls[1][1], "saved-news-id");
  assert.deepEqual(form.navigations, ["/admin/noticias"]);
});

test("a failed gallery save retries against the saved news ID without creating duplicates", async () => {
  const form = harness({ failedUploads: 1 });
  await form.submit();
  assert.deepEqual(form.navigations, []);
  assert.ok(form.errors["root.server"].message.includes("fotos"));
  const cover = form.render().find((element) => element.props.label === "Capa");
  await cover.props.onChange(new File(["image"], "cover.png"));
  await form.submit();
  assert.equal(form.calls.filter((call) => call[0] === "create").length, 1);
  assert.equal(
    form.calls.find((call) => call[0] === "update")[1],
    "saved-news-id",
  );
  assert.equal(
    form.calls.find((call) => call[0] === "cover")[1],
    "noticia-salva",
  );
  assert.deepEqual(
    form.calls
      .filter((call) => call[0] === "photos-saved")
      .map((call) => call[1]),
    ["saved-news-id", "saved-news-id"],
  );
  assert.deepEqual(form.navigations, ["/admin/noticias"]);
});

test("editing loads saved photos and their optional captions before updating the same news item", async () => {
  const images = [
    {
      id: "photo",
      imageUrl: "https://example.org/photo.jpg",
      title: "Foto",
      description: null,
    },
  ];
  const form = harness({
    slug: "noticia-anterior",
    record: {
      id: "existing-news",
      slug: "noticia-anterior",
      title: "Notícia anterior",
      date: "2026-10-23",
      isInternal: false,
      images,
    },
  });
  const tree = form.render();
  assert.equal(
    tree.find((element) => element.props.gallery === form.gallery).props
      .disabled,
    true,
  );
  form.effects[0]();
  await new Promise(setImmediate);
  assert.deepEqual(form.gallery.images, images);
  await form.submit();
  assert.equal(
    form.calls.find((call) => call[0] === "update")[1],
    "existing-news",
  );
  assert.equal(
    form.calls.find((call) => call[0] === "photos-saved")[1],
    "existing-news",
  );
  assert.ok(!form.calls.some((call) => call[0] === "create"));
});

test("an edit cannot save to an unknown parent while the original news item is loading", async () => {
  const form = harness({ slug: "noticia-pendente" });
  await form.submit();
  assert.equal(form.calls.length, 0);
  assert.ok(form.errors["root.server"].message.includes("carregamento"));
});
