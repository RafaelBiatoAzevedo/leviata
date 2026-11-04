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
const { newsletterSubscriberSchema: schema } = load(
  "../src/admin/validations/newsletterSubscriber.schema.ts",
);
const item = {
  id: "id-1",
  name: "Ana",
  email: "ana@example.com",
  cellphone: null,
  isActive: true,
  allowEmail: true,
  subscribedAt: "2026-11-01T12:00:00Z",
  unsubscribedAt: null,
  createdAt: "2026-11-01T12:00:00Z",
  updatedAt: "2026-11-01T12:00:00Z",
};
const form = {
  name: "Ana",
  email: item.email,
  cellphone: "",
  isActive: true,
  allowEmail: true,
};
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
function harness(kind, options = {}) {
  const state = [],
    refs = [],
    slots = [],
    effects = [],
    navigated = [],
    toasts = [],
    resets = [],
    errors = {};
  let cursor = 0,
    refCursor = 0,
    effectCursor = 0,
    modal,
    filters,
    refreshed = 0;
  const service = {
    getById: async () => ({ data: item }),
    create: async () => ({ data: item }),
    updateById: async () => ({ data: item }),
    removeById: async () => {},
    ...options.service,
  };
  const reset = (values) => resets.push(values);
  const mocks = {
    react: {
      ...React,
      useState(initial) {
        const i = cursor++;
        if (!(i in state))
          state[i] = typeof initial === "function" ? initial() : initial;
        return [
          state[i],
          (update) =>
            (state[i] =
              typeof update === "function" ? update(state[i]) : update),
        ];
      },
      useRef(initial) {
        return (refs[refCursor++] ??= { current: initial });
      },
      useEffect(callback, deps) {
        const i = effectCursor++,
          previous = slots[i];
        if (!previous || deps.some((d, j) => d !== previous.deps[j])) {
          previous?.cleanup?.();
          const slot = (slots[i] = { deps });
          effects.push(() => (slot.cleanup = callback()));
        }
      },
    },
    "react-router-dom": {
      useParams: () => ({ id: options.id }),
      useNavigate: () => (path) => navigated.push(path),
    },
    "../../../services/newsletterSubscribers": {
      newsletterSubscribersService: service,
    },
    "../../../validations/newsletterSubscriber.schema": {
      newsletterSubscriberSchema: schema,
    },
    "../../../utils/newsletterSubscriber": load(
      "../src/admin/utils/newsletterSubscriber.ts",
    ),
    "../../../utils/dateTime": load("../src/admin/utils/dateTime.ts"),
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
    "@hookform/resolvers/zod": { zodResolver: () => () => {} },
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
  for (const name of [
    "AdminPageHeader",
    "AdminButton",
    "AdminSearchBar",
    "AdminSelect",
    "AdminTable",
    "AdminPagination",
    "AdminIconButton",
    "AdminError",
    "AdminInput",
    "AdminSwitch",
    "AdminBadge",
    "AdminFormCard",
    "AdminFormGrid",
    "AdminSection",
    "AdminLoading",
    "AdminDescriptionList",
    "AdminDescriptionItem",
  ])
    mocks[`../../../components/${name}`] = { [name]: name };
  const exports = load(
    `../src/admin/pages/AdminNewsletterSubscribers/${kind}/index.tsx`,
    mocks,
  );
  const component =
    exports[
      {
        List: "AdminNewsletterSubscribers",
        Form: "NewsletterSubscriberForm",
        View: "NewsletterSubscriberView",
      }[kind]
    ];
  return {
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
    render() {
      cursor = refCursor = effectCursor = 0;
      let tree = component();
      if (typeof tree.type === "function") tree = tree.type(tree.props);
      const result = nodes(tree);
      effects.splice(0).forEach((effect) => effect());
      return result;
    },
    unmount() {
      slots.forEach((slot) => slot.cleanup?.());
    },
  };
}

test("validates e-mail and contact lengths while normalizing optional text", () => {
  assert.deepEqual(
    schema.parse({ ...form, email: " ANA@EXAMPLE.COM ", name: " Ana " }),
    form,
  );
  for (const invalid of [
    { email: "invalid" },
    { name: "x".repeat(256) },
    { cellphone: "x".repeat(31) },
    { isActive: "true" },
  ])
    assert.equal(schema.safeParse({ ...form, ...invalid }).success, false);
});

test("subscriber service uses the protected paginated CRUD endpoints", async () => {
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
  const { newsletterSubscribersService: service } = load(
    "../src/admin/services/newsletterSubscribers.ts",
    { "../../services/api": { api } },
  );
  const signal = new AbortController().signal;
  await service.getPage(
    { page: 2, limit: 15, search: "Ana", isActive: "true" },
    signal,
  );
  await service.getById(item.id, signal);
  await service.create(form);
  await service.updateById(item.id, form);
  await service.removeById(item.id);
  assert.deepEqual(calls, [
    [
      "get",
      "/newsletter-subscribers",
      {
        params: { page: 2, limit: 15, search: "Ana", isActive: "true" },
        signal,
      },
    ],
    ["get", `/newsletter-subscribers/${item.id}`, { signal }],
    ["post", "/newsletter-subscribers", form],
    ["patch", `/newsletter-subscribers/${item.id}`, form],
    ["delete", `/newsletter-subscribers/${item.id}`],
  ]);
});

test("list searches and filters all portal and admin subscribers with server totals", () => {
  const h = harness("List");
  let tree = h.render();
  tree
    .find((n) => n.type === "AdminSearchBar")
    .props.onChange({ target: { value: " Ana " } });
  tree
    .find((n) => n.type === "AdminSelect")
    .props.onChange({ target: { value: "false" } });
  tree = h.render();
  assert.deepEqual(h.filters, { search: "Ana", isActive: "false" });
  assert.equal(tree.find((n) => n.type === "AdminPagination").props.total, 31);
  tree.find((n) => n.props.title === "Visualizar").props.onClick();
  assert.deepEqual(h.navigated, [`/admin/inscritos-newsletter/${item.id}`]);
});

test("administrators can remove a subscriber after confirmation, then refresh the list", async () => {
  const removed = [];
  const h = harness("List", {
    service: { removeById: async (id) => removed.push(id) },
  });
  const button = h.render().find((n) => n.props.title === "Remover");
  assert.equal(button.props.permission, undefined);
  button.props.onClick();
  assert.deepEqual(removed, []);
  await h.modal.onConfirm();
  assert.deepEqual(removed, [item.id]);
  assert.equal(h.refreshed, 1);
  assert.equal(h.toasts.at(-1).type, "success");
});

test("failed removal keeps the record and explains the error", async () => {
  const h = harness("List", {
    service: {
      removeById: async () => {
        throw apiError(503, "Serviço indisponível");
      },
    },
  });
  h.render()
    .find((n) => n.props.title === "Remover")
    .props.onClick();
  await assert.rejects(h.modal.onConfirm());
  assert.equal(h.refreshed, 0);
  assert.equal(h.toasts[0].description, "Serviço indisponível");
});

test("empty, loading and error states remain distinct", () => {
  for (const list of [
    { items: [], loading: true },
    { items: [], error: "Sem conexão" },
  ])
    assert.equal(
      harness("List", { list })
        .render()
        .some((n) => n.type === "empty"),
      false,
    );
  assert.equal(
    harness("List", { list: { items: [] } })
      .render()
      .some((n) => n.type === "empty"),
    true,
  );
});

test("create accepts e-mail-only contacts, prevents repeated requests and returns to the list", async () => {
  let finish,
    body,
    calls = 0;
  const h = harness("Form", {
    service: {
      create: (data) => {
        calls++;
        body = data;
        return new Promise((resolve) => (finish = resolve));
      },
    },
  });
  const submit = h.render().find((n) => n.type === "form").props.onSubmit;
  const first = submit({ ...form, name: "" });
  await submit(form);
  assert.equal(calls, 1);
  assert.deepEqual(body, { ...form, name: null, cellphone: null });
  finish({ data: item });
  await first;
  assert.deepEqual(h.navigated, ["/admin/inscritos-newsletter"]);
});

test("edit loads existing preferences and saves against the original ID", async () => {
  const saved = [];
  const h = harness("Form", {
    id: item.id,
    service: { updateById: async (...args) => saved.push(args) },
  });
  assert.ok(h.render().some((n) => n.type === "AdminLoading"));
  await flush();
  const tree = h.render();
  assert.deepEqual(h.resets, [form]);
  await tree
    .find((n) => n.type === "form")
    .props.onSubmit({ ...form, allowEmail: false });
  assert.deepEqual(saved, [
    [item.id, { ...form, cellphone: null, allowEmail: false }],
  ]);
});

test("duplicate e-mail preserves the form and does not navigate", async () => {
  const h = harness("Form", {
    service: {
      create: async () => {
        throw apiError(409, "Já existe um inscrito com esse e-mail.");
      },
    },
  });
  await h
    .render()
    .find((n) => n.type === "form")
    .props.onSubmit(form);
  assert.equal(h.navigated.length, 0);
  assert.equal(
    h.errors["root.server"].message,
    "Já existe um inscrito com esse e-mail.",
  );
});

test("a missing subscriber blocks editing and retry recovers", async () => {
  let calls = 0;
  const h = harness("Form", {
    id: item.id,
    service: {
      getById: async () => {
        if (++calls === 1) throw apiError(404, "Inscrito não encontrado.");
        return { data: item };
      },
    },
  });
  h.render();
  await flush();
  let tree = h.render();
  assert.equal(
    tree.some((n) => n.type === "form"),
    false,
  );
  tree.find((n) => n.props.children === "Tentar novamente").props.onClick();
  h.render();
  await flush();
  assert.ok(h.render().some((n) => n.type === "form"));
});

test("leaving during loading aborts the request and ignores late responses", async () => {
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
});

test("details show contact, receiving preference and subscription date", async () => {
  const h = harness("View", { id: item.id });
  h.render();
  await flush();
  const tree = h.render();
  assert.equal(
    tree.find((n) => n.type === "AdminPageHeader").props.title,
    item.name,
  );
  assert.equal(
    tree.find((n) => n.props.label === "E-mail").props.value,
    item.email,
  );
  assert.equal(
    tree.find((n) => n.props.label === "Receber por e-mail").props.value,
    "Sim",
  );
});
