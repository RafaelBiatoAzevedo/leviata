const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve, dirname } = require("node:path");
const { Module } = require("node:module");
const ts = require("typescript");
const React = require("react");

function load(path, dependencies = {}) {
  const filename = resolve(__dirname, path);
  const loaded = new Module(filename, module);
  loaded.filename = filename;
  loaded.paths = Module._nodeModulePaths(dirname(filename));
  const actualRequire = loaded.require.bind(loaded);
  loaded.require = (request) =>
    Object.hasOwn(dependencies, request)
      ? dependencies[request]
      : actualRequire(request);
  loaded._compile(
    ts.transpileModule(readFileSync(filename, "utf8"), {
      fileName: filename,
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.ReactJSX,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText,
    filename,
  );
  return loaded.exports;
}

const { commentSchema } = load("../src/validations/comment.ts");
const sample = {
  fullName: "Ana D’Ávila",
  text: "Uma reflexão sobre este conteúdo.",
};

test("normalizes names and messages without removing accents or punctuation", () => {
  assert.deepEqual(
    commentSchema.parse({
      fullName: " Ana   D’Ávila ",
      text: " Uma reflexão. ",
    }),
    { fullName: "Ana D’Ávila", text: "Uma reflexão." },
  );
});

test("requires a full name and a short message before submission", () => {
  for (const change of [
    { fullName: "" },
    { fullName: "Ana" },
    { fullName: "a".repeat(121) },
    { text: "" },
    { text: "  " },
    { text: "x".repeat(301) },
  ])
    assert.equal(
      commentSchema.safeParse({ ...sample, ...change }).success,
      false,
    );
  assert.equal(
    commentSchema.safeParse({
      fullName: `Ana ${"x".repeat(116)}`,
      text: "x".repeat(300),
    }).success,
    true,
  );
});

test("submits public comments only to the API, leaving publication to moderation", async () => {
  const calls = [];
  const api = {
    post: async (...args) => {
      calls.push(args);
      return { data: { message: "Enviado" } };
    },
  };
  const { commentsService } = load("../src/services/comments.ts", {
    "./api": { api },
  });
  const target = { targetType: "RESEARCH_INSTRUMENT", targetId: "record-id" };
  await commentsService.create(target, commentSchema.parse(sample));
  assert.deepEqual(calls, [["/comments", { ...target, ...sample }]]);
  assert.equal("status" in calls[0][1], false);
});

test("loads comments with pagination and cancellation for the specific record", async () => {
  const calls = [];
  const api = {
    get: async (...args) => {
      calls.push(args);
      return { data: { items: [], total: 0 } };
    },
  };
  const { commentsService } = load("../src/services/comments.ts", {
    "./api": { api },
  });
  const target = { targetType: "JURY", targetId: "jury-id" };
  const controller = new AbortController();
  await commentsService.list(target, 2, controller.signal);
  assert.deepEqual(calls, [
    [
      "/comments",
      { params: { ...target, page: 2, limit: 30 }, signal: controller.signal },
    ],
  ]);
});

test("keeps failures available to the form instead of treating failed submissions as published", async () => {
  const failure = new Error("offline");
  const api = {
    post: async () => {
      throw failure;
    },
  };
  const { commentsService } = load("../src/services/comments.ts", {
    "./api": { api },
  });
  const values = commentSchema.parse(sample);
  await assert.rejects(
    commentsService.create(
      { targetType: "THEMATIC", targetId: "record" },
      values,
    ),
    failure,
  );
  assert.deepEqual(values, sample);
});

test("uses protected endpoints for read state, moderation, and scheduled reminders", async () => {
  const calls = [];
  const api = {
    get: async (...args) => calls.push(["get", ...args]),
    post: async (...args) => calls.push(["post", ...args]),
    patch: async (...args) => calls.push(["patch", ...args]),
  };
  const { notificationsService } = load(
    "../src/admin/services/notifications.ts",
    { "../../services/api": { api } },
  );
  await notificationsService.read("notification");
  await notificationsService.readAll();
  await notificationsService.moderate("comment", "approve");
  await notificationsService.moderate("comment", "reject");
  const reminder = {
    type: "REMINDER",
    title: "Revisar comentários",
    message: "Conferir novas contribuições.",
    visibleAt: "2026-12-01T12:00:00Z",
  };
  await notificationsService.create(reminder);
  assert.deepEqual(calls, [
    ["patch", "/notifications/notification/read"],
    ["patch", "/notifications/read-all"],
    ["patch", "/comments/comment/moderation", { decision: "approve" }],
    ["patch", "/comments/comment/moderation", { decision: "reject" }],
    ["post", "/notifications", reminder],
  ]);
});

function commentFormHarness({
  items = [],
  fail = false,
  listFailure = false,
} = {}) {
  const slots = [],
    pendingEffects = [],
    calls = [],
    listCalls = [];
  let cursor = 0;
  const hooks = {
    ...React,
    useId: () => "comment-test",
    useState(initial) {
      const index = cursor++;
      if (!(index in slots))
        slots[index] = typeof initial === "function" ? initial() : initial;
      return [
        slots[index],
        (next) => {
          slots[index] = typeof next === "function" ? next(slots[index]) : next;
        },
      ];
    },
    useRef(initial) {
      const index = cursor++;
      return (slots[index] ??= { current: initial });
    },
    useEffect(effect, dependencies) {
      const index = cursor++;
      if (
        !slots[index] ||
        dependencies.some((value, position) => value !== slots[index][position])
      )
        pendingEffects.push(effect);
      slots[index] = dependencies;
    },
  };
  const service = {
    async list(target, page, signal) {
      listCalls.push({ target, page, signal });
      if (listFailure) throw new Error("offline");
      return { data: { items, total: items.length } };
    },
    async create(target, values) {
      calls.push({ target, values });
      if (fail) throw new Error("offline");
      return { data: { message: "Enviado" } };
    },
  };
  const { Comments } = load("../src/components/Comments/index.tsx", {
    react: hooks,
    "../../services/comments": { commentsService: service },
    "../../validations/comment": { commentSchema },
    "swiper/modules": { A11y: {}, Navigation: {}, Pagination: {} },
    "swiper/react": {
      Swiper: "comments-swiper",
      SwiperSlide: "comments-slide",
    },
    "../Carousel": { Carousel: "comments-carousel" },
    "./styles": {
      Button: "button",
      Card: "article",
      Form: "form",
      Section: "section",
      State: "aside",
    },
  });
  const target = { targetType: "THEMATIC", targetId: "thematic-id" };
  function render() {
    cursor = 0;
    const component = Comments(target);
    return component.type(component.props);
  }
  function nodes(root, result = []) {
    if (!React.isValidElement(root)) return result;
    result.push(root);
    React.Children.forEach(root.props.children, (child) =>
      nodes(child, result),
    );
    return result;
  }
  const find = (type) => nodes(render()).find((node) => node.type === type);
  return {
    calls,
    listCalls,
    nodes: () => nodes(render()),
    find,
    async mount() {
      render();
      for (const effect of pendingEffects.splice(0)) effect();
      await new Promise(setImmediate);
    },
    fill(fullName, text) {
      find("input").props.onChange({ target: { value: fullName } });
      find("textarea").props.onChange({ target: { value: text } });
    },
    async submit() {
      await find("form").props.onSubmit({ preventDefault() {} });
    },
  };
}

function textContent(node) {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textContent).join("");
  return React.isValidElement(node) ? textContent(node.props.children) : "";
}

test("automatically loads comments on page mount and shows the friendly empty state", async () => {
  const form = commentFormHarness();
  assert.equal(
    textContent(form.find("section")).includes("Nenhum comentário"),
    false,
  );
  await form.mount();
  assert.equal(form.listCalls.length, 1);
  assert.deepEqual(form.listCalls[0].target, {
    targetType: "THEMATIC",
    targetId: "thematic-id",
  });
  assert.equal(form.listCalls[0].page, 1);
  assert.ok(form.listCalls[0].signal instanceof AbortSignal);
  assert.match(
    textContent(form.find("section")),
    /Nenhum comentário disponível por enquanto\. Seja a primeira pessoa a contribuir!/,
  );
  assert.equal(
    form.nodes().some((node) => node.props.role === "alert"),
    false,
  );
});

test("keeps the initial unavailable state friendly without a manual retry prompt", async () => {
  const form = commentFormHarness({ listFailure: true });
  await form.mount();
  assert.equal(form.listCalls.length, 1);
  const text = textContent(form.find("section"));
  assert.match(text, /Nenhum comentário disponível por enquanto/);
  assert.doesNotMatch(
    text,
    /Não foi possível carregar|Tentar novamente|Carregando comentários/,
  );
  assert.equal(form.find("form").props.children[1].props.disabled, false);
});

test("the comment form blocks incomplete names before contacting the API", async () => {
  const form = commentFormHarness();
  await form.mount();
  form.fill("Ana", "Uma reflexão válida.");
  await form.submit();
  assert.equal(form.calls.length, 0);
  assert.equal(form.find("input").props["aria-invalid"], true);
});

test("the form submits for moderation without inserting the pending message into the approved carousel", async () => {
  const approved = {
    id: "approved",
    fullName: "Pessoa Aprovada",
    text: "Comentário aprovado.",
    approvedAt: "2026-10-24T15:00:00Z",
  };
  const form = commentFormHarness({ items: [approved] });
  await form.mount();
  form.fill(" Ana   Silva ", " Nova contribuição. ");
  await form.submit();
  assert.deepEqual(form.calls, [
    {
      target: { targetType: "THEMATIC", targetId: "thematic-id" },
      values: { fullName: "Ana Silva", text: "Nova contribuição." },
    },
  ]);
  assert.equal(form.find("input").props.value, "");
  assert.equal(form.find("textarea").props.value, "");
  assert.equal(
    form.nodes().filter((node) => node.type === "blockquote").length,
    1,
  );
  const carousel = form.find("comments-swiper");
  assert.deepEqual(carousel.props.breakpoints[900], {
    slidesPerView: 3,
    slidesPerGroup: 3,
  });
  assert.deepEqual(carousel.props.breakpoints[600], {
    slidesPerView: 2,
    slidesPerGroup: 2,
  });
  assert.equal(carousel.props.slidesPerView, 1);
  assert.equal(
    form
      .nodes()
      .some(
        (node) =>
          node.props.role === "status" &&
          JSON.stringify(node.props.children).includes("aprovação"),
      ),
    true,
  );
});

test("the comment form preserves a visitor’s draft and exposes an error after a failed submission", async () => {
  const form = commentFormHarness({ fail: true });
  await form.mount();
  form.fill("Ana Silva", "Uma reflexão que não pode ser perdida.");
  await form.submit();
  assert.equal(form.find("input").props.value, "Ana Silva");
  assert.equal(
    form.find("textarea").props.value,
    "Uma reflexão que não pode ser perdida.",
  );
  assert.equal(
    form.nodes().some((node) => node.props.role === "alert"),
    true,
  );
  assert.equal(form.find("form").props.children[1].props.disabled, false);
});
