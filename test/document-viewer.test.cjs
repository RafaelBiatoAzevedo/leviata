const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve, dirname } = require("node:path");
const { Module } = require("node:module");
const ts = require("typescript");
const React = require("react");

function load(relative, overrides = {}) {
  const filename = resolve(__dirname, relative);
  const loaded = new Module(filename, module);
  loaded.filename = filename;
  loaded.paths = Module._nodeModulePaths(dirname(filename));
  const localRequire = Module.createRequire(filename);
  loaded.require = (name) =>
    name.endsWith(".css")
      ? {}
      : Object.hasOwn(overrides, name)
        ? overrides[name]
        : localRequire(name);
  // The Vite worker URL is irrelevant to these Node tests; no worker or PDF is fetched.
  const source = readFileSync(filename, "utf8").replaceAll(
    "import.meta.url",
    JSON.stringify(`file://${filename}`),
  );
  loaded._compile(
    ts.transpileModule(source, {
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
  return loaded.exports;
}
const { fitPdfPageWidth } = load("../src/utils/pdfPage.ts");

test("portrait, landscape and tall PDF pages fit both reader dimensions", () => {
  for (const [bounds, page] of [
    [
      { width: 1100, height: 500 },
      { width: 595, height: 842 },
    ],
    [
      { width: 300, height: 500 },
      { width: 842, height: 595 },
    ],
    [
      { width: 900, height: 400 },
      { width: 300, height: 2000 },
    ],
  ]) {
    const width = fitPdfPageWidth(bounds, page);
    assert.ok(width <= bounds.width);
    assert.ok((width * page.height) / page.width <= bounds.height);
  }
  assert.equal(
    fitPdfPageWidth({ width: 0, height: 0 }, { width: 595, height: 842 }),
    1,
  );
});

function nodes(root, result = []) {
  React.Children.forEach(root, (child) => {
    if (React.isValidElement(child)) {
      result.push(child);
      nodes(child.props.children, result);
    }
  });
  return result;
}
function text(root) {
  return React.Children.toArray(root)
    .map((child) =>
      React.isValidElement(child) ? text(child.props.children) : String(child),
    )
    .join(" ");
}

function harness(context) {
  const slots = [],
    effects = [],
    observers = [],
    frames = [],
    revoked = [],
    printCalls = [],
    timers = new Map(),
    listeners = new Map();
  let cursor = 0;
  const previous = {
    document: globalThis.document,
    window: globalThis.window,
    ResizeObserver: globalThis.ResizeObserver,
  };
  const documentMock = {
    fullscreenEnabled: true,
    fullscreenElement: null,
    addEventListener(name, handler) {
      listeners.set(name, handler);
    },
    removeEventListener(name) {
      listeners.delete(name);
    },
    async exitFullscreen() {
      documentMock.fullscreenElement = null;
      listeners.get("fullscreenchange")?.();
    },
    createElement() {
      const frame = {
        style: {},
        setAttribute() {},
        remove() {
          frame.removed = true;
        },
        contentWindow: {
          focus() {},
          print() {
            printCalls.push("print");
          },
          addEventListener(name, handler) {
            frame[name] = handler;
          },
        },
      };
      return frame;
    },
    body: {
      appendChild(frame) {
        frames.push(frame);
      },
    },
  };
  globalThis.document = documentMock;
  globalThis.window = {
    setTimeout(fn) {
      const id = timers.size + 1;
      timers.set(id, fn);
      return id;
    },
    clearTimeout(id) {
      timers.delete(id);
    },
  };
  globalThis.ResizeObserver = class {
    constructor(callback) {
      this.callback = callback;
      observers.push(this);
    }
    observe(element) {
      this.element = element;
    }
    disconnect() {
      this.disconnected = true;
    }
  };
  context.mock.method(URL, "createObjectURL", () => "blob:pdf-test");
  context.mock.method(URL, "revokeObjectURL", (value) => revoked.push(value));

  const hooks = {
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
      if (!slots[i] || deps.some((dep, j) => dep !== slots[i].deps[j]))
        slots[i] = { deps, value: fn };
      return slots[i].value;
    },
    useEffect(fn, deps) {
      const i = cursor++,
        old = slots[i];
      if (!old || deps.some((dep, j) => dep !== old.deps[j])) {
        slots[i] = { deps, cleanup: old?.cleanup };
        effects.push(() => {
          old?.cleanup?.();
          slots[i].cleanup = fn();
        });
      }
    },
  };
  const styles = Object.fromEntries(
    [
      "ActionButton",
      "Actions",
      "Container",
      "Feedback",
      "PageButton",
      "PageInfo",
      "Pagination",
      "ReaderTitle",
      "Stage",
      "Toolbar",
      "Viewer",
      "ViewerMessage",
    ].map((name) => [name, name]),
  );
  const { DocumentViewer } = load(
    "../src/components/DocumentViewer/index.tsx",
    {
      react: hooks,
      "react-pdf": {
        Document: "pdf-document",
        Page: "pdf-page",
        pdfjs: { GlobalWorkerOptions: {} },
      },
      "../../utils/pdfPage": { fitPdfPageWidth },
      "./styles": styles,
    },
  );
  const viewer = {
    async requestFullscreen() {
      documentMock.fullscreenElement = viewer;
      listeners.get("fullscreenchange")?.();
    },
  };
  const stage = {};
  const props = {
    pdf: "https://example.test/document.pdf",
    externalLink: "https://example.test/source",
  };
  const pdf = {
    numPages: 3,
    async getData() {
      printCalls.push("getData");
      return new Uint8Array([37, 80, 68, 70]);
    },
  };
  function render() {
    cursor = 0;
    const wrapper = DocumentViewer(props);
    const tree = wrapper.type(wrapper.props);
    const treeNodes = nodes(tree);
    treeNodes.find((node) => node.type === "Viewer").props.ref.current = viewer;
    treeNodes.find((node) => node.type === "Stage").props.ref.current = stage;
    return tree;
  }
  function unmount() {
    for (const slot of slots) slot?.cleanup?.();
  }
  context.after(() => {
    unmount();
    Object.assign(globalThis, previous);
  });
  const api = {
    render,
    viewer,
    document: documentMock,
    observers,
    frames,
    revoked,
    printCalls,
    timers,
    pdf,
    find(type) {
      return nodes(render()).find((node) => node.type === type);
    },
    action(label) {
      return nodes(render()).find(
        (node) =>
          node.type === "ActionButton" && node.props["aria-label"] === label,
      );
    },
    pageButton(label) {
      return nodes(render()).find(
        (node) =>
          node.type === "PageButton" && node.props["aria-label"] === label,
      );
    },
    mount() {
      render();
      while (effects.length) effects.shift()();
    },
    resize(width, height) {
      observers[0].callback([{ contentRect: { width, height } }]);
    },
    loaded() {
      this.find("pdf-document").props.onLoadSuccess(pdf);
    },
    dimensions(width, height, pageNumber = 1) {
      this.find("pdf-page").props.onLoadSuccess({
        pageNumber,
        originalWidth: width,
        originalHeight: height,
      });
    },
    unmount,
  };
  api.mount();
  return api;
}

test("controls stay outside the PDF stage while navigation remains disabled during loading", (context) => {
  const view = harness(context);
  const children = React.Children.toArray(view.find("Viewer").props.children);
  assert.deepEqual(
    children.map((child) => child.type),
    ["Toolbar", "Stage", "Pagination"],
  );
  assert.equal(view.pageButton("Página anterior").props.disabled, true);
  assert.equal(view.pageButton("Próxima página").props.disabled, true);
  assert.equal(view.action("Imprimir documento").props.disabled, true);
  assert.equal(view.find("pdf-page"), undefined);
});

test("the rendered PDF fits available height and recalculates on resize and mixed page orientations", (context) => {
  const view = harness(context);
  view.resize(900, 500);
  view.loaded();
  view.dimensions(600, 1200);
  assert.equal(view.find("pdf-page").props.width, 250);
  view.resize(300, 600);
  assert.equal(view.find("pdf-page").props.width, 300);
  view.pageButton("Próxima página").props.onClick();
  view.dimensions(1200, 600, 2);
  assert.equal(view.find("pdf-page").props.pageNumber, 2);
  assert.equal(view.find("pdf-page").props.width, 300);
});

test("pagination is bounded and announces the current page without changing the reader area", (context) => {
  const view = harness(context);
  view.resize(800, 500);
  view.loaded();
  for (let i = 0; i < 5; i++) view.pageButton("Próxima página").props.onClick();
  assert.equal(view.find("pdf-page").props.pageNumber, 3);
  assert.equal(view.pageButton("Próxima página").props.disabled, true);
  assert.equal(view.find("PageInfo").props["aria-label"], "Página 3 de 3");
  for (let i = 0; i < 5; i++)
    view.pageButton("Página anterior").props.onClick();
  assert.equal(view.find("pdf-page").props.pageNumber, 1);
});

test("fullscreen expands the complete reader and responds to exiting fullscreen", async (context) => {
  const view = harness(context);
  await view.action("Ver em tela cheia").props.onClick();
  assert.equal(view.document.fullscreenElement, view.viewer);
  await view.action("Sair da tela cheia").props.onClick();
  assert.equal(view.document.fullscreenElement, null);
});

test("printing reuses the loaded PDF and releases the frame and blob after printing", async (context) => {
  const view = harness(context);
  view.loaded();
  await view.action("Imprimir documento").props.onClick();
  assert.deepEqual(view.printCalls, ["getData"]);
  assert.equal(view.frames[0].src, "blob:pdf-test");
  view.frames[0].onload();
  assert.deepEqual(view.printCalls, ["getData", "print"]);
  view.frames[0].afterprint();
  assert.equal(view.frames[0].removed, true);
  assert.deepEqual(view.revoked, ["blob:pdf-test"]);
  assert.equal(view.timers.size, 0);
});

test("a failed PDF keeps navigation stable and offers the original file", (context) => {
  const view = harness(context);
  view.find("pdf-document").props.onLoadError();
  assert.equal(view.pageButton("Próxima página").props.disabled, true);
  assert.equal(
    view.find("PageInfo").props["aria-label"],
    "Documento indisponível",
  );
  assert.match(
    text(view.find("pdf-document").props.error),
    /Abrir PDF em nova aba/,
  );
  assert.equal(
    view.action("Baixar documento PDF").props.href,
    "https://example.test/document.pdf",
  );
});
