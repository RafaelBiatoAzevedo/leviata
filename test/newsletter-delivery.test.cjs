const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve, dirname } = require("node:path");
const { Module } = require("node:module");
const ts = require("typescript");
const React = require("react");

function compile(source, filename) {
  return ts.transpileModule(source, {
    fileName: filename,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
}
for (const extension of [".ts", ".tsx"])
  require.extensions[extension] = (loaded, filename) =>
    loaded._compile(
      compile(readFileSync(filename, "utf8"), filename),
      filename,
    );
function load(relative, overrides = {}) {
  const filename = resolve(__dirname, relative);
  const loaded = new Module(filename, module);
  loaded.filename = filename;
  loaded.paths = Module._nodeModulePaths(dirname(filename));
  const localRequire = Module.createRequire(filename);
  loaded.require = (name) =>
    Object.hasOwn(overrides, name) ? overrides[name] : localRequire(name);
  loaded._compile(compile(readFileSync(filename, "utf8"), filename), filename);
  return loaded.exports;
}
function nodes(tree, result = []) {
  React.Children.forEach(tree, (child) => {
    if (React.isValidElement(child)) {
      result.push(child);
      nodes(child.props.children, result);
    }
  });
  return result;
}
function content(tree) {
  return React.Children.toArray(tree)
    .map((child) =>
      React.isValidElement(child)
        ? content(child.props.children)
        : String(child),
    )
    .join(" ");
}
function hooks() {
  let cursor = 0;
  const slots = [],
    effects = [];
  return {
    react: {
      ...React,
      useState(initial) {
        const i = cursor++;
        if (!(i in slots))
          slots[i] = typeof initial === "function" ? initial() : initial;
        return [
          slots[i],
          (value) => {
            slots[i] = typeof value === "function" ? value(slots[i]) : value;
          },
        ];
      },
      useRef(initial) {
        const i = cursor++;
        return (slots[i] ??= { current: initial });
      },
      useCallback(fn, deps) {
        const i = cursor++;
        if (
          !slots[i] ||
          deps.some((dep, j) => !Object.is(dep, slots[i].deps[j]))
        )
          slots[i] = { deps, value: fn };
        return slots[i].value;
      },
      useEffect(fn, deps) {
        const i = cursor++,
          old = slots[i];
        if (!old || deps.some((dep, j) => !Object.is(dep, old.deps[j]))) {
          slots[i] = { deps, cleanup: old?.cleanup };
          effects.push(() => {
            old?.cleanup?.();
            slots[i].cleanup = fn();
          });
        }
      },
    },
    render(fn) {
      cursor = 0;
      return fn();
    },
    async settle(fn) {
      for (let i = 0; i < 3; i++) {
        this.render(fn);
        while (effects.length) effects.shift()();
        await new Promise(setImmediate);
      }
      return this.render(fn);
    },
    unmount() {
      for (const slot of slots) slot?.cleanup?.();
    },
  };
}
const settings = {
  enabled: true,
  configured: true,
  ready: true,
  workerEnabled: true,
  from: "leviataeocativeiro@gmail.com",
  worker: { pausedUntil: null },
};
const edition = {
  id: "edition-id",
  slug: "edicao-cadastrada",
  title: "Boletim",
  subject: "Assunto",
  htmlContent: "<p>Conteúdo</p>",
  publishedAt: "2020-01-01",
  sentAt: null,
};
const values = {
  title: "Boletim",
  subject: "Assunto",
  htmlContent: "<p>Conteúdo</p>",
  publishedAt: "2020-01-01",
  sentAt: "",
  coverUrl: "",
};
const { newsletterSendAvailability } = load(
  "../src/admin/utils/newsletterDelivery.ts",
);

function formHarness(options = {}) {
  const state = hooks(),
    calls = [],
    previews = [],
    notices = [],
    navigation = [],
    fieldErrors = [];
  const formValues = { ...values, ...options.values };
  const form = {
    register: () => ({}),
    handleSubmit: (fn) => fn,
    reset(data) { Object.assign(formValues, data); },
    setValue(name, value) { formValues[name] = value; },
    getValues: () => ({ ...formValues }),
    setError: (...args) => fieldErrors.push(args),
    control: {},
    formState: { errors: {}, isSubmitting: false },
  };
  const service = {
    async preview(data) {
      previews.push(data);
      if (options.previewFailure) throw options.previewFailure;
      return { data: { htmlContent: options.renderedHtml ?? data.htmlContent } };
    },
    async getBySlug() { return { data: options.loaded }; },
    async create(data) {
      calls.push(["create", data]);
      if (options.save) return options.save(data);
      return { data: edition };
    },
    async updateBySlug() {
      throw new Error("Unexpected edit");
    },
  };
  const { NewsletterForm } = load(
    "../src/admin/pages/AdminNewsletter/Form/index.tsx",
    {
      react: state.react,
      "react-hook-form": {
        useForm: () => form,
        useWatch: ({ name }) => formValues[name],
      },
      "react-router-dom": {
        useNavigate: () => (path) => navigation.push(path),
        useParams: () => options.slug ? { slug: options.slug } : {},
      },
      "../../../../hooks/useToast": {
        useToast: () => ({ showToast: (notice) => notices.push(notice) }),
      },
      "../../../services/newsletter": { newsletterService: service },
      "../../../services/newsletterMail": {
        newsletterMailService: {
          async settings() {
            return { data: options.settings ?? settings };
          },
          async send(id) {
            calls.push(["send", id]);
            if (options.sendFailure) throw options.sendFailure;
            return { data: { total: 3 } };
          },
        },
      },
      "../../../components/AdminFormActions": {
        __esModule: true,
        default: "form-actions",
      },
      "../../../components/AdminDateInput": { AdminDateInput: "date-input" },
      "../../../components/AdminNewsletterPreview": {
        AdminNewsletterPreview: "newsletter-preview",
      },
      "../../../components/NewsletterComposer": { NewsletterComposer: "newsletter-composer" },
      "../../../components/AdminFormCard": { AdminFormCard: "card" },
      "../../../components/AdminFormGrid": { AdminFormGrid: "grid" },
      "../../../components/AdminImageUpload": {
        AdminImageUpload: "image-upload",
      },
      "../../../components/AdminInput": { AdminInput: "admin-input" },
      "../../../components/AdminPageHeader": { AdminPageHeader: "header" },
      "../../../components/AdminSection": { AdminSection: "section" },
      "../../../components/AdminSwitch": { AdminSwitch: "send-switch" },
      "../../../components/AdminTextarea": { AdminTextarea: "textarea" },
      "../../../components/AdminResponsive": { AdminSplitLayout: "split" },
      "./styles": { Container: "div", Form: "form", Advanced: "details", ModeNotice: "div" },
    },
  );
  const render = () => state.render(() => NewsletterForm());
  return {
    calls,
    previews,
    notices,
    navigation,
    fieldErrors,
    async mount() {
      await state.settle(() => NewsletterForm());
    },
    switch() {
      return nodes(render()).find((node) => node.type === "send-switch");
    },
    choose() {
      this.switch().props.onChange({ target: { checked: true } });
    },
    setDraft(patch) {
      Object.assign(formValues, patch);
    },
    elements() { return nodes(render()); },
    async clickText(text) {
      const button = nodes(render()).find(node => typeof node.props.onClick === "function" && content(node.props.children).trim() === text);
      assert.ok(button, `missing button: ${text}`);
      button.props.onClick();
      await state.settle(() => NewsletterForm());
    },
    async openPreview() {
      const button = nodes(render()).find((node) => node.props["aria-haspopup"] === "dialog");
      assert.equal(button.props.type, "button");
      button.props.onClick();
      await state.settle(() => NewsletterForm());
      return this.preview();
    },
    preview() {
      return nodes(render()).find((node) => node.type === "newsletter-preview");
    },
    cover(file) {
      return nodes(render()).find((node) => node.type === "image-upload").props.onChange(file);
    },
    submit() {
      return nodes(render())
        .find((node) => node.type === "form")
        .props.onSubmit(formValues);
    },
    unmount() {
      state.unmount();
    },
  };
}

test("creation keeps sending optional and does not overwrite the real sentAt", async () => {
  const form = formHarness({ values: { sentAt: "2020-01-01" } });
  await form.mount();
  assert.equal(form.switch().props.checked, false);
  await form.submit();
  assert.deepEqual(
    form.calls.map((call) => call[0]),
    ["create"],
  );
  assert.equal(Object.hasOwn(form.calls[0][1], "sentAt"), false);
  assert.deepEqual(form.navigation, ["/admin/newsletter/edicao-cadastrada"]);
  form.unmount();
});

test("preview requests omit the automatic send date without modifying the draft", async () => {
  const requests = [];
  const { newsletterService } = load("../src/admin/services/newsletter.ts", {
    "../../services/api": { api: { async post(path, data) { requests.push([path, data]); return { data: { htmlContent: "<h1>Prévia</h1>" } }; } } },
  });
  for (const sentAt of ["", "2026-10-28T12:00:00.000Z"]) {
    const draft = { ...values, title: "Rascunho", subject: "", sentAt };
    const before = structuredClone(draft);
    const response = await newsletterService.preview(draft);
    assert.equal(response.data.htmlContent, "<h1>Prévia</h1>");
    const [path, request] = requests.at(-1);
    assert.equal(path, "/newsletter/preview");
    assert.equal(Object.hasOwn(request, "sentAt"), false);
    assert.equal(request.subject, "");
    assert.equal(request.publishedAt, values.publishedAt);
    assert.deepEqual(draft, before);
  }
});

test("preview reads unsaved form values and closing it preserves the draft without saving or sending", async () => {
  const form = formHarness();
  await form.mount();
  form.choose();
  form.setDraft({ title: "Título ainda não salvo", htmlContent: "<h1>Conteúdo novo</h1>" });
  const preview = await form.openPreview();
  assert.equal(preview.props.data.title, "Título ainda não salvo");
  assert.equal(preview.props.data.htmlContent, "<h1>Conteúdo novo</h1>");
  assert.deepEqual(form.calls, []);
  assert.deepEqual(form.navigation, []);
  preview.props.onClose();
  assert.equal(form.preview(), undefined);
  assert.equal(form.switch().props.checked, true);
  form.setDraft({ subject: "Assunto revisado" });
  assert.equal((await form.openPreview()).props.data.subject, "Assunto revisado");
  assert.equal(form.preview().props.data.title, "Título ainda não salvo");
  assert.deepEqual(form.calls, []);
  form.unmount();
});

test("preview includes the cropped local cover before the newsletter has been saved", async () => {
  const form = formHarness({ renderedHtml: '<h1>Leviatã News</h1><img class="nl-cover" src="{{newsletterCover}}">' });
  await form.mount();
  const url = await form.cover(new File(["cropped image"], "capa-recorte.png", { type: "image/png" }));
  try {
    const preview = await form.openPreview();
    assert.equal(preview.props.data.coverUrl, url);
    assert.equal(form.previews[0].coverUrl, "{{newsletterCover}}");
    assert.ok(!JSON.stringify(form.previews[0]).includes("data:image/"));
    assert.match(preview.props.data.htmlContent, /src="data:image\/png;base64,/);
    assert.ok(!preview.props.data.htmlContent.includes("blob:"));
    const encoded = preview.props.data.htmlContent.match(/base64,([^"]+)/)[1];
    assert.equal(Buffer.from(encoded, "base64").toString(), "cropped image");
    assert.match(url, /^blob:/);
    assert.deepEqual(form.calls, []);
  } finally {
    URL.revokeObjectURL(url);
    form.unmount();
  }
});

test("local preview embedding preserves large image bytes and rejects executable image formats", async () => {
  const { newsletterCoverDataUrl } = load("../src/admin/utils/newsletterPreview.ts");
  const bytes = Buffer.alloc(100000, 153);
  const image = await newsletterCoverDataUrl(new File([bytes], "capa.webp", { type: "image/webp" }));
  assert.deepEqual(Buffer.from(image.split(",")[1], "base64"), bytes);
  await assert.rejects(newsletterCoverDataUrl(new File(["<svg></svg>"], "capa.svg", { type: "image/svg+xml" })));
});

const { defaultNewsletterContent } = load("../src/admin/utils/newsletterComposer.ts");

test("saving a visual edition submits the structured fields for automatic server generation", async () => {
  const contentData = defaultNewsletterContent();
  contentData.sections[0].items[0].text = "Texto preenchido por uma pessoa sem HTML.";
  const form = formHarness({ values: { contentData, htmlContent: "" } });
  await form.mount();
  await form.submit();
  assert.deepEqual(form.calls[0][1].contentData, contentData);
  assert.equal(Object.hasOwn(form.calls[0][1], "htmlContent"), false);
  form.unmount();
});

test("legacy editions reopen with their HTML preserved instead of being overwritten by the visual template", async () => {
  const html = "<h1>Edição antiga</h1><p>Texto original completo.</p>";
  const form = formHarness({ slug: "antiga", loaded: { ...edition, htmlContent: html, coverUrl: null, pdfUrl: null, contentData: null } });
  await form.mount();
  const code = form.elements().find(node => node.props.label === "Código HTML");
  assert.equal(code.props.value, html);
  assert.equal(form.elements().some(node => node.type === "newsletter-composer"), false);
  form.unmount();
});

test("advanced editing starts with generated code and keeps the structured content for later visual editing", async () => {
  const contentData = defaultNewsletterContent();
  contentData.sections[0].items[0].title = "Notícia que precisa ser guardada";
  const form = formHarness({ values: { contentData, htmlContent: "" }, renderedHtml: '<h1>Gerado</h1><img src="{{newsletterCover}}">' });
  await form.mount();
  await form.clickText("Editar código HTML");
  const code = form.elements().find(node => node.props.label === "Código HTML");
  assert.match(code.props.value, /Gerado/);
  assert.equal(form.previews[0].coverUrl, "{{newsletterCover}}");
  code.props.onChange({ target: { value: "<h1>Personalizado</h1>" } });
  await form.submit();
  const saved = form.calls[0][1].contentData;
  assert.equal(saved.mode, "html");
  assert.equal(saved.customHtml, "<h1>Personalizado</h1>");
  assert.equal(saved.sections[0].items[0].title, "Notícia que precisa ser guardada");
  form.unmount();
});

const { AdminNewsletterPreview } = load(
  "../src/admin/components/AdminNewsletterPreview/index.tsx",
  { "../../../components/NewsletterReader": { NewsletterReader: "newsletter-reader" } },
);

test("preview keeps HTML in the existing reader and shows cover, subject and publication from the draft", () => {
  const html = "<!doctype html><html><head><style>p{color:blue}</style></head><body><p>Texto formatado</p></body></html>";
  const view = AdminNewsletterPreview({
    data: {
      ...values,
      coverUrl: "blob:local-cropped-cover",
      htmlContent: html,
    },
    onClose() {},
  });
  assert.equal(view.type, "newsletter-reader");
  assert.equal(view.props.edition.htmlContent, html);
  assert.equal(view.props.edition.title, values.title);
  const summary = nodes(view.props.children);
  assert.equal(summary.find((node) => node.type === "img").props.src, "blob:local-cropped-cover");
  assert.equal(summary.some((node) => node.type === "a"), false);
  assert.match(content(view.props.children), /Assunto/);
  assert.match(content(view.props.children), /1 de janeiro de 2020/);
});

test("preview supports incomplete drafts and ignores invalid cover and PDF URLs", () => {
  const view = AdminNewsletterPreview({
    data: {
      ...values, title: "  ", subject: "", htmlContent: "", publishedAt: "invalid",
      coverUrl: "javascript:alert(1)", pdfUrl: "javascript:alert(1)",
    },
    onClose() {},
  });
  assert.equal(view.props.edition.title, "Newsletter sem título");
  assert.match(view.props.edition.htmlContent, /conteúdo da newsletter aparecerá aqui/);
  assert.match(content(view.props.children), /Sem assunto/);
  assert.match(content(view.props.children), /Sem data de publicação/);
  assert.equal(nodes(view.props.children).some((node) => node.type === "img" || node.type === "a"), false);
});

test("choosing send after save queues the saved newsletter ID and opens delivery tracking", async () => {
  const form = formHarness();
  await form.mount();
  form.choose();
  await form.submit();
  assert.deepEqual(
    form.calls.map((call) => call[0]),
    ["create", "send"],
  );
  assert.equal(form.calls[1][1], edition.id);
  assert.deepEqual(form.navigation, [
    "/admin/newsletter/edicao-cadastrada#envio",
  ]);
  form.unmount();
});

test("a queue failure preserves the created edition and guides the administrator to its status", async () => {
  const form = formHarness({
    sendFailure: { isAxiosError: true, response: { status: 503 } },
  });
  await form.mount();
  form.choose();
  await form.submit();
  assert.equal(form.calls.filter((call) => call[0] === "create").length, 1);
  assert.match(form.notices.at(-1).title, /Newsletter salva/);
  assert.deepEqual(form.navigation, [
    "/admin/newsletter/edicao-cadastrada#envio",
  ]);
  form.unmount();
});

test("SMTP unavailability permits saving without sending and publication rules prevent premature sends", async () => {
  const unavailable = formHarness({ settings: { ...settings, ready: false } });
  await unavailable.mount();
  assert.equal(unavailable.switch().props.disabled, true);
  await unavailable.submit();
  assert.deepEqual(
    unavailable.calls.map((call) => call[0]),
    ["create"],
  );
  unavailable.unmount();
  const draft = formHarness({ values: { publishedAt: "" } });
  await draft.mount();
  draft.choose();
  await draft.submit();
  assert.deepEqual(draft.calls, []);
  assert.equal(draft.fieldErrors[0][0], "publishedAt");
  draft.unmount();
  assert.match(
    newsletterSendAvailability(settings, "2999-01-01"),
    /publicação/,
  );
});

test("repeated save clicks do not create or queue the same edition twice", async () => {
  let release;
  const form = formHarness({
    save: () =>
      new Promise((resolve) => {
        release = resolve;
      }),
  });
  await form.mount();
  form.choose();
  const first = form.submit(),
    second = form.submit();
  release({ data: edition });
  await Promise.all([first, second]);
  assert.deepEqual(
    form.calls.map((call) => call[0]),
    ["create", "send"],
  );
  form.unmount();
});

function panelHarness(context, options = {}) {
  const state = hooks(),
    calls = [],
    modal = [],
    timers = new Set();
  const oldWindow = globalThis.window,
    oldDocument = globalThis.document;
  globalThis.window = {
    setInterval: (callback) => {
      timers.add(callback);
      return callback;
    },
    clearInterval: (timer) => timers.delete(timer),
  };
  globalThis.document = { visibilityState: "visible" };
  context.after(() => {
    state.unmount();
    globalThis.window = oldWindow;
    globalThis.document = oldDocument;
  });
  let campaign = options.campaign || { status: "NOT_QUEUED", campaign: null };
  const service = {
    async settings() {
      return { data: options.settings || settings };
    },
    async status() {
      return { data: campaign };
    },
    async audience() {
      return { data: options.audience || { registered: 5, eligible: 3, excluded: 2 } };
    },
    async deliveries(id, page, limit) {
      calls.push(["deliveries", id, page, limit]);
      return { data: { items: [], total: 0 } };
    },
    async records(id, page, limit) {
      calls.push(["records", id, page, limit]);
      return {
        data: {
          items: [
            {
              id: "delivery-record",
              subscriberId: "person",
              subscriber: { email: "ana@example.test", name: "Ana Silva" },
              sentAt: "2020-01-01T12:00:00Z",
            },
          ],
          total: 1,
        },
      };
    },
    async send(id, payload) {
      calls.push(["send", id, payload]);
      campaign = {
        status: "PROCESSING",
        campaign: { id: "campaign", completedAt: null },
        total: 3,
        counts: {
          pending: 3,
          sending: 0,
          sent: 0,
          failed: 0,
          skipped: 0,
          unknown: 0,
        },
      };
      return { data: campaign };
    },
    async retry(id) {
      calls.push(["retry", id]);
      return { data: campaign };
    },
    async cancel(id) {
      calls.push(["cancel", id]);
      return { data: campaign };
    },
  };
  const { NewsletterSendPanel } = load(
    "../src/admin/components/NewsletterSendPanel/index.tsx",
    {
      react: state.react,
      "../../../hooks/useModal": {
        useModal: () => ({
          showModal: (item) => modal.push(item),
          updateModal() {},
        }),
      },
      "../../../hooks/useToast": { useToast: () => ({ showToast() {} }) },
      "../../services/newsletterMail": { newsletterMailService: service },
      "../AdminBadge": { AdminBadge: "span" },
      "../AdminButton": { AdminButton: "button" },
      "../AdminPagination": { AdminPagination: "pagination" },
      "../AdminTable": { AdminTable: "table" },
      "../NewsletterAudiencePicker": { NewsletterAudiencePicker: "audience-picker" },
      "./styles": {
        Controls: "controls",
        History: "history",
        HistoryChoice: "history-choice",
        Notice: "aside",
        Panel: "section",
        Summary: "dl",
        ConfirmationRecipients: "ul",
      },
    },
  );
  const component = () => NewsletterSendPanel({ newsletter: edition });
  return {
    calls,
    modal,
    timers,
    async settle() {
      return state.settle(component);
    },
    render() {
      return state.render(component);
    },
    button(text) {
      return nodes(this.render()).find(
        (node) =>
          node.type === "button" && content(node.props.children).includes(text),
      );
    },
  };
}

test("the later send button previews the audience and queues only after explicit confirmation", async (context) => {
  const panel = panelHarness(context);
  await panel.settle();
  assert.equal(
    panel.calls.some((call) => call[0] === "send"),
    false,
  );
  const button = panel.button("Enviar para todos os inscritos");
  assert.equal(button.props.disabled, false);
  button.props.onClick();
  assert.match(content(panel.modal[0].content), /3 inscritos/);
  await Promise.all([panel.modal[0].onConfirm(), panel.modal[0].onConfirm()]);
  assert.deepEqual(
    panel.calls.filter((call) => call[0] === "send"),
    [["send", edition.id, { mode: "ALL" }]],
  );
  await panel.settle();
  assert.equal(
    panel.timers.size,
    1,
    "tracking polls while the campaign is processing",
  );
});

test("the admin reads real successful delivery records independently of queue entries", async (context) => {
  const panel = panelHarness(context);
  await panel.settle();
  panel.button("Envios realizados").props.onClick();
  await panel.settle();
  assert.deepEqual(
    panel.calls.find((call) => call[0] === "records"),
    ["records", edition.id, 1, 15],
  );
  const text = content(panel.render());
  assert.match(text, /ana@example.test/);
  assert.match(text, /Ana Silva/);
});

test("sending a selection confirms the chosen names and sends only their IDs", async (context) => {
  const panel = panelHarness(context);
  await panel.settle();
  const picker = () => nodes(panel.render()).find((node) => node.type === "audience-picker");
  picker().props.onModeChange("SELECTED");
  assert.equal(panel.button("Enviar para selecionados (0)").props.disabled, true);
  const selected = [{ id: "550e8400-e29b-41d4-a716-446655440000", name: "Ana Silva", email: "ana@example.test" }];
  picker().props.onSelectionChange(selected);
  assert.equal(panel.button("Enviar para selecionados (1)").props.disabled, false);
  panel.button("Enviar para selecionados (1)").props.onClick();
  assert.match(panel.modal[0].title, /1 inscrito selecionado/);
  assert.match(content(panel.modal[0].content), /Ana Silva/);
  assert.match(content(panel.modal[0].content), /ana@example.test/);
  assert.doesNotMatch(content(panel.modal[0].content), /Todos os cadastros/);
  assert.equal(panel.calls.some((call) => call[0] === "send"), false);
  await panel.modal[0].onConfirm();
  assert.deepEqual(panel.calls.filter((call) => call[0] === "send"), [["send", edition.id, { mode: "SELECTED", subscriberIds: [selected[0].id] }]]);
});

test("recipient selection remains available before SMTP setup and switching to ALL is explicit", async (context) => {
  const panel = panelHarness(context, { settings: { ...settings, ready: false } });
  await panel.settle();
  const picker = () => nodes(panel.render()).find((node) => node.type === "audience-picker");
  assert.equal(picker().props.disabled, false);
  picker().props.onModeChange("SELECTED");
  picker().props.onSelectionChange([{ id: "chosen", name: null, email: "chosen@example.test" }]);
  assert.equal(panel.button("Enviar para selecionados (1)").props.disabled, true);
  picker().props.onModeChange("ALL");
  assert.equal(picker().props.selected.length, 1);
  assert.equal(panel.button("Enviar para todos os inscritos").props.disabled, true);
});

function audienceHarness(context, options = {}) {
  const state = hooks(), requests = [];
  let mode = options.mode || "ALL", selected = [], revision = 0, failure = options.failure;
  const records = options.records || Array.from({ length: 32 }, (_, index) => ({ id: `subscriber-${index}`, name: `Pessoa ${index}`, email: `pessoa${index}@example.test` }));
  const { NewsletterAudiencePicker } = load("../src/admin/components/NewsletterAudiencePicker/index.tsx", {
    react: { ...state.react, useId: () => "audience-test" },
    "../../services/newsletterMail": { newsletterMailService: { async subscribers(id, params, signal) {
      requests.push({ id, params, signal });
      if (failure) throw new Error("Unavailable");
      const filtered = records.filter((item) => !params.search || `${item.name || ""} ${item.email}`.toLowerCase().includes(params.search.toLowerCase()));
      return { data: { items: filtered.slice((params.page - 1) * params.limit, params.page * params.limit), total: filtered.length, page: params.page, limit: params.limit } };
    } } },
    "../AdminButton": { AdminButton: "button" },
    "../AdminPagination": { AdminPagination: "pagination" },
    "../AdminSearchBar": { AdminSearchBar: "search" },
    "../AdminTable": { AdminTable: "table" },
    "./styles": { Actions: "actions", Choice: "label", Choices: "choices", Container: "fieldset", Selection: "status", Status: "notice", Subscriber: "label" },
  });
  const component = () => NewsletterAudiencePicker({ newsletterId: edition.id, eligible: records.length, mode, selected, revision, onModeChange: (value) => { mode = value; }, onSelectionChange: (value) => { selected = value; } });
  context.after(() => state.unmount());
  return {
    requests,
    selected: () => selected,
    render: () => state.render(component),
    settle: () => state.settle(component),
    nodes() { return nodes(this.render()); },
    choose(value) { this.nodes().find((node) => node.type === "input" && node.props.type === "radio" && node.props.value === value).props.onChange(); },
    row(id) { return this.nodes().find((node) => node.type === "tr" && node.key === id); },
    checkbox(id) { return nodes(this.row(id)).find((node) => node.type === "input"); },
    page(value) { this.nodes().find((node) => node.type === "pagination").props.onPageChange(value); },
    search(value) { this.nodes().find((node) => node.type === "search").props.onChange({ target: { value } }); },
    button(text) { return this.nodes().find((node) => node.type === "button" && content(node.props.children).includes(text)); },
    recover() { failure = false; this.button("Tentar novamente").props.onClick(); },
  };
}

test("the picker preserves selections across pages and search without silently selecting everyone", async (context) => {
  const picker = audienceHarness(context);
  await picker.settle();
  assert.equal(picker.checkbox("subscriber-0").props.checked, true);
  assert.equal(picker.checkbox("subscriber-0").props.disabled, true);
  picker.choose("SELECTED");
  assert.equal(picker.checkbox("subscriber-0").props.checked, false);
  picker.checkbox("subscriber-0").props.onChange();
  picker.page(2);
  await picker.settle();
  assert.equal(picker.selected().length, 1);
  picker.checkbox("subscriber-15").props.onChange();
  picker.search("pessoa31@");
  await picker.settle();
  assert.equal(picker.requests.at(-1).params.page, 1);
  picker.checkbox("subscriber-31").props.onChange();
  assert.deepEqual(picker.selected().map((item) => item.id), ["subscriber-0", "subscriber-15", "subscriber-31"]);
  picker.search("");
  await picker.settle();
  assert.equal(picker.checkbox("subscriber-0").props.checked, true);
  assert.equal(picker.checkbox("subscriber-1").props.checked, false);
  picker.choose("ALL");
  assert.match(content(picker.render()), /Todos os 32 inscritos aptos/);
  assert.equal(picker.selected().length, 3);
});

test("selecting the current page adds without duplicates and clearing resets the selection", async (context) => {
  const picker = audienceHarness(context, { mode: "SELECTED" });
  await picker.settle();
  picker.button("Selecionar esta página").props.onClick();
  picker.button("Selecionar esta página").props.onClick();
  assert.equal(picker.selected().length, 15);
  picker.checkbox("subscriber-0").props.onChange();
  assert.equal(picker.selected().length, 14);
  picker.button("Limpar seleção").props.onClick();
  assert.equal(picker.selected().length, 0);
});

test("the picker exposes load errors with retry and handles empty searches accurately", async (context) => {
  const picker = audienceHarness(context, { failure: true });
  await picker.settle();
  assert.match(content(picker.render()), /Não foi possível carregar a lista/);
  picker.recover();
  await picker.settle();
  assert.ok(picker.checkbox("subscriber-0"));
  picker.search("sem-resultados");
  await picker.settle();
  assert.match(content(picker.render()), /Nenhum inscrito encontrado para esta busca/);
});

test("mail configuration prevents unintended sends", async (context) => {
  const panel = panelHarness(context, {
    settings: { ...settings, ready: false },
  });
  await panel.settle();
  assert.equal(
    panel.button("Enviar para todos os inscritos").props.disabled,
    true,
  );
  assert.match(content(panel.render()), /configuração e ativação/);
});

test("completed campaigns do not offer another bulk send", async (context) => {
  const panel = panelHarness(context, {
    campaign: {
      status: "COMPLETED",
      campaign: { id: "completed", completedAt: "2020-01-01T12:00:00Z" },
      total: 3,
      counts: {
        pending: 0,
        sending: 0,
        sent: 3,
        failed: 0,
        skipped: 0,
        unknown: 0,
      },
    },
  });
  await panel.settle();
  assert.equal(panel.button("Enviar para todos os inscritos"), undefined);
  assert.equal(panel.timers.size, 0);
  assert.equal(
    panel.calls.some((call) => call[0] === "send"),
    false,
  );
});

test("a failed creation never queues a newsletter or redirects away from its draft", async () => {
  const form = formHarness({
    save: async () => {
      throw new Error("Falha no cadastro");
    },
  });
  await form.mount();
  form.choose();
  await form.submit();
  assert.deepEqual(
    form.calls.map((call) => call[0]),
    ["create"],
  );
  assert.deepEqual(form.navigation, []);
  assert.equal(form.notices.at(-1).title, "Erro ao salvar newsletter");
  form.unmount();
});
