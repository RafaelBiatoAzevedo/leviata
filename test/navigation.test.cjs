const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");
const React = require("react");
const router = require("react-router-dom");
const { renderToStaticMarkup } = require("react-dom/server");
const { ThemeProvider, ServerStyleSheet } = require("styled-components");
const root = path.resolve(__dirname, "..");
const req = Module.createRequire(path.join(root, "package.json"));
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
      compile(fs.readFileSync(filename, "utf8"), filename),
      filename,
    );
require.extensions[".png"] = (loaded, filename) => {
  loaded.exports = filename;
};
const { menus, isNavigationActive, navigationCurrent } = req(
  "./src/components/NavBar/navigation.ts",
);
const styles = req("./src/components/NavBar/styles.ts");
const { lightTheme } = req("./src/styles/themes.ts");
function elements(node, result = []) {
  if (React.isValidElement(node)) {
    result.push(node);
    React.Children.forEach(node.props.children, (child) =>
      elements(child, result),
    );
  }
  return result;
}
function harness(pathname = "/") {
  const values = [],
    refs = [],
    navigations = [];
  let stateIndex = 0,
    refIndex = 0,
    effects = [];
  const hooks = {
    ...React,
    useState(initial) {
      const i = stateIndex++;
      if (!(i in values)) values[i] = initial;
      return [
        values[i],
        (update) => {
          values[i] = typeof update === "function" ? update(values[i]) : update;
        },
      ];
    },
    useRef(initial) {
      return (refs[refIndex++] ??= { current: initial });
    },
    useId: () => "navigation-test",
    useEffect: (callback) => effects.push(callback),
  };
  const filename = path.join(root, "src/components/NavBar/index.tsx");
  const loaded = new Module(filename, module);
  const localRequire = Module.createRequire(filename);
  loaded.filename = filename;
  loaded.paths = Module._nodeModulePaths(path.dirname(filename));
  loaded.require = (id) =>
    id === "react"
      ? hooks
      : id === "react-router-dom"
        ? {
            ...router,
            useLocation: () => ({ pathname }),
            useNavigate: () => (value) => navigations.push(value),
          }
        : localRequire(id);
  loaded._compile(
    compile(fs.readFileSync(filename, "utf8"), filename),
    filename,
  );
  return {
    values,
    refs,
    navigations,
    render() {
      stateIndex = 0;
      refIndex = 0;
      effects = [];
      return elements(loaded.exports.Navbar());
    },
    get effects() {
      return effects;
    },
  };
}
function environment(context) {
  const savedWindow = global.window,
    savedDocument = global.document;
  const documentEvents = new Map(),
    windowEvents = new Map(),
    mediaEvents = new Map();
  const frames = new Map(),
    timers = new Map();
  let sequence = 0;
  const media = {
    matches: false,
    addEventListener: (key, fn) => mediaEvents.set(key, fn),
    removeEventListener: (key) => mediaEvents.delete(key),
  };
  const doc = {
    activeElement: null,
    body: { style: { overflow: "auto" } },
    addEventListener: (key, fn) => documentEvents.set(key, fn),
    removeEventListener: (key) => documentEvents.delete(key),
    getElementById: () => null,
  };
  const win = {
    matchMedia: () => media,
    addEventListener: (key, fn) => windowEvents.set(key, fn),
    removeEventListener: (key) => windowEvents.delete(key),
    requestAnimationFrame(fn) {
      const id = ++sequence;
      frames.set(id, fn);
      return id;
    },
    cancelAnimationFrame: (id) => frames.delete(id),
    setTimeout(fn) {
      const id = ++sequence;
      timers.set(id, fn);
      return id;
    },
    clearTimeout: (id) => timers.delete(id),
  };
  global.window = win;
  global.document = doc;
  context.after(() => {
    if (savedWindow === undefined) delete global.window;
    else global.window = savedWindow;
    if (savedDocument === undefined) delete global.document;
    else global.document = savedDocument;
  });
  const focusable = (name) => ({
    name,
    getClientRects: () => [1],
    focus() {
      doc.activeElement = this;
    },
  });
  return {
    doc,
    media,
    documentEvents,
    windowEvents,
    mediaEvents,
    frames,
    timers,
    focusable,
    flushFrames() {
      const callbacks = [...frames.values()];
      frames.clear();
      callbacks.forEach((fn) => fn());
    },
  };
}
const getToggle = (tree) =>
  tree.find((element) => element.type === styles.MenuToggle);
const getDropdown = (tree, pathname) =>
  tree.find(
    (element) =>
      element.type === styles.Dropdown &&
      element.props.children[0].props.to === pathname,
  );
function keyEvent(key, currentTarget) {
  return {
    key,
    currentTarget,
    prevented: false,
    stopped: false,
    preventDefault() {
      this.prevented = true;
    },
    stopPropagation() {
      this.stopped = true;
    },
  };
}

test("identifies section routes without matching unrelated prefixes, including the newsletter alias", () => {
  for (const [current, section] of [
    ["/grupo/", "/grupo"],
    ["/grupo/pesquisadores", "/grupo"],
    ["/atividades/juris-historicos/juris/iii-juri", "/atividades"],
    [
      "/instrumentos/planilhas-biblio-tematicas/dossie/historia",
      "/instrumentos",
    ],
    ["/newsletter/", "/noticias"],
    ["/newsletter", "/noticias/newsletter"],
  ])
    assert.equal(isNavigationActive(current, section), true);
  for (const current of ["/grupo-extra", "/publicacoes", "/grupos", "/"])
    assert.equal(isNavigationActive(current, "/grupo"), false);
});

test("distinguishes the current page from its containing section for assistive navigation", () => {
  assert.equal(navigationCurrent("/grupo/", "/grupo"), "page");
  assert.equal(navigationCurrent("/grupo/pesquisadores", "/grupo"), "location");
  assert.equal(
    navigationCurrent("/newsletter", "/noticias/newsletter"),
    "page",
  );
  assert.equal(
    navigationCurrent("/atividades/pesquisas", "/agenda"),
    undefined,
  );
});

test("every menu destination resolves to a registered portal route", () => {
  const source = ts.createSourceFile(
    "routes.tsx",
    fs.readFileSync(path.join(root, "src/routes/index.routes.tsx"), "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const paths = [];
  function visit(node) {
    if (
      ts.isJsxAttribute(node) &&
      node.name.getText(source) === "path" &&
      node.initializer &&
      ts.isStringLiteral(node.initializer)
    )
      paths.push(node.initializer.text);
    ts.forEachChild(node, visit);
  }
  visit(source);
  const routes = paths.map((path) => ({ path }));
  for (const link of menus.flatMap((menu) => [menu, ...(menu.children ?? [])]))
    assert.ok(
      router.matchRoutes(routes, link.path),
      `Missing route: ${link.path}`,
    );
  const activities = menus.find((menu) => menu.path === "/atividades");
  assert.ok(
    activities.children.some((link) => link.path === "/atividades/pesquisas"),
  );
  assert.ok(
    activities.children.some(
      (link) => link.path === "/atividades/apresentacoes-trabalhos",
    ),
  );
});

test("desktop submenus support hover, toggle, blur and keyboard arrows, Home, End and Escape", (context) => {
  const env = environment(context),
    nav = harness();
  const links = [env.focusable("first"), env.focusable("second")],
    arrow = env.focusable("toggle");
  const panel = { querySelectorAll: () => links };
  const parent = {
    querySelectorAll: () => links,
    querySelector: () => arrow,
    contains: (target) => links.includes(target) || target === arrow,
  };
  env.doc.getElementById = () => panel;
  let tree = nav.render();
  getDropdown(tree, "/grupo").props.onPointerEnter({ pointerType: "mouse" });
  assert.equal(nav.values[1], "/grupo");
  tree = nav.render();
  getDropdown(tree, "/grupo").props.onPointerLeave({
    pointerType: "mouse",
    currentTarget: parent,
  });
  assert.equal(nav.values[1], null);
  tree = nav.render();
  let event = keyEvent("ArrowDown", parent);
  getDropdown(tree, "/grupo").props.onKeyDown(event);
  nav.render();
  env.flushFrames();
  assert.equal(event.prevented, true);
  assert.equal(env.doc.activeElement, links[0]);
  tree = nav.render();
  getDropdown(tree, "/grupo").props.onKeyDown(keyEvent("ArrowUp", parent));
  assert.equal(env.doc.activeElement, links[1]);
  getDropdown(tree, "/grupo").props.onKeyDown(keyEvent("Home", parent));
  assert.equal(env.doc.activeElement, links[0]);
  getDropdown(tree, "/grupo").props.onKeyDown(keyEvent("End", parent));
  assert.equal(env.doc.activeElement, links[1]);
  event = keyEvent("Escape", parent);
  getDropdown(tree, "/grupo").props.onKeyDown(event);
  assert.equal(event.stopped, true);
  assert.equal(nav.values[1], null);
  assert.equal(env.doc.activeElement, arrow);
  tree = nav.render();
  getDropdown(tree, "/grupo")
    .props.children.find((child) => child?.type === styles.DropdownArrow)
    .props.onClick();
  assert.equal(nav.values[1], "/grupo");
  tree = nav.render();
  getDropdown(tree, "/grupo").props.onBlur({
    currentTarget: parent,
    relatedTarget: {},
  });
  assert.equal(nav.values[1], null);
});

test("desktop submenus close outside, on history navigation and on Escape, cleaning up listeners", (context) => {
  const env = environment(context),
    nav = harness();
  nav.render();
  nav.values[1] = "/grupo";
  nav.render();
  const arrow = env.focusable("toggle"),
    inside = {};
  nav.refs[1].current = {
    contains: (target) => target === inside,
    querySelector: () => arrow,
  };
  const cleanup = nav.effects[1]();
  env.documentEvents.get("pointerdown")({ target: inside });
  assert.equal(nav.values[1], "/grupo");
  env.documentEvents.get("pointerdown")({ target: {} });
  assert.equal(nav.values[1], null);
  nav.values[1] = "/grupo";
  env.windowEvents.get("popstate")();
  assert.equal(nav.values[1], null);
  nav.values[1] = "/grupo";
  env.documentEvents.get("keydown")({ key: "Escape" });
  assert.equal(nav.values[1], null);
  assert.equal(env.doc.activeElement, arrow);
  cleanup();
  assert.equal(env.documentEvents.size, 0);
  assert.equal(env.windowEvents.size, 0);
});

test("mobile navigation expands the active section and closes after choosing a destination", () => {
  const nav = harness("/noticias/newsletter");
  let tree = nav.render();
  assert.equal(getToggle(tree).props["aria-expanded"], false);
  getToggle(tree).props.onClick();
  tree = nav.render();
  assert.equal(getToggle(tree).props["aria-expanded"], true);
  assert.equal(nav.values[1], "/noticias");
  const currentPanel = tree.find(
    (element) =>
      element.type === styles.MobileSubmenu &&
      element.props.id.endsWith("mobile-noticias"),
  );
  assert.equal(currentPanel.props.hidden, false);
  const destination = elements(currentPanel).find(
    (element) =>
      element.type === styles.SubmenuItem &&
      element.props.to === "/noticias/newsletter",
  );
  assert.equal(destination.props["aria-current"], "page");
  destination.props.onClick();
  tree = nav.render();
  assert.equal(getToggle(tree).props["aria-expanded"], false);
  assert.equal(
    tree.find((element) => element.type === styles.MobileMenu).props.inert,
    true,
  );
});

test("mobile navigation traps focus, handles Escape and restores page interaction and scrolling", (context) => {
  const env = environment(context),
    nav = harness("/grupo/pesquisadores");
  let tree = nav.render();
  getToggle(tree).props.onClick();
  nav.render();
  const focusable = [
    env.focusable("logo"),
    env.focusable("toggle"),
    env.focusable("last-link"),
  ];
  const firstMobileLink = env.focusable("first-mobile-link");
  const background = [{ inert: false }, { inert: true }];
  nav.refs[0].current = {
    parentElement: { querySelectorAll: () => background },
    querySelectorAll: () => focusable,
  };
  nav.refs[2].current = focusable[1];
  nav.refs[3].current = { querySelector: () => firstMobileLink };
  const cleanup = nav.effects[0]();
  env.flushFrames();
  assert.equal(env.doc.body.style.overflow, "hidden");
  assert.ok(background.every((element) => element.inert));
  assert.equal(env.doc.activeElement, firstMobileLink);
  env.doc.activeElement = focusable[2];
  const forward = keyEvent("Tab");
  forward.shiftKey = false;
  env.documentEvents.get("keydown")(forward);
  assert.equal(forward.prevented, true);
  assert.equal(env.doc.activeElement, focusable[0]);
  const backward = keyEvent("Tab");
  backward.shiftKey = true;
  env.documentEvents.get("keydown")(backward);
  assert.equal(env.doc.activeElement, focusable[2]);
  env.documentEvents.get("keydown")(keyEvent("Escape"));
  assert.equal(nav.values[0], false);
  assert.equal(env.doc.activeElement, focusable[1]);
  cleanup();
  assert.equal(env.doc.body.style.overflow, "auto");
  assert.deepEqual(
    background.map((element) => element.inert),
    [false, true],
  );
  assert.equal(env.documentEvents.size, 0);
  assert.equal(env.mediaEvents.size, 0);
  assert.equal(env.windowEvents.size, 0);
});

test("mobile navigation closes when returning through history or widening to desktop", (context) => {
  const env = environment(context),
    nav = harness();
  let tree = nav.render();
  getToggle(tree).props.onClick();
  nav.render();
  const cleanup = nav.effects[0]();
  env.windowEvents.get("popstate")();
  assert.equal(nav.values[0], false);
  nav.values[0] = true;
  nav.values[1] = "/grupo";
  env.media.matches = true;
  env.mediaEvents.get("change")();
  assert.equal(nav.values[0], false);
  assert.equal(nav.values[1], null);
  cleanup();
});

test("logo keeps the home action and the existing triple-click admin shortcut", (context) => {
  const env = environment(context),
    nav = harness();
  const tree = nav.render(),
    logo = tree.find((element) => element.type === styles.LogoButtonWrapper);
  const cleanup = nav.effects[2]();
  logo.props.onClick();
  logo.props.onClick();
  logo.props.onClick();
  assert.deepEqual(nav.navigations, ["/", "/admin"]);
  assert.equal(env.timers.size, 0);
  logo.props.onClick();
  assert.equal(env.timers.size, 1);
  cleanup();
  assert.equal(env.timers.size, 0);
});

test("rendered navigation marks nested routes, hides the mobile menu and retains the theme placeholder", () => {
  const { Navbar } = req("./src/components/NavBar/index.tsx");
  for (const pathname of [
    "/",
    "/grupo/pesquisadores",
    "/atividades/juris-historicos/juris/teste",
    "/newsletter",
  ]) {
    const sheet = new ServerStyleSheet();
    try {
      const html = renderToStaticMarkup(
        sheet.collectStyles(
          React.createElement(
            ThemeProvider,
            { theme: lightTheme },
            React.createElement(
              router.MemoryRouter,
              { initialEntries: [pathname] },
              React.createElement(Navbar),
            ),
          ),
        ),
      );
      const css = sheet.getStyleTags();
      assert.match(html, /aria-label="Navegação principal"/);
      assert.match(
        html,
        /id="portal-mobile-menu"[^>]*inert=""[^>]*aria-hidden="true"/,
      );
      assert.match(html, /style="display:none"/);
      const ids = new Set(
        [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]),
      );
      for (const [, controlledId] of html.matchAll(/aria-controls="([^"]+)"/g))
        assert.ok(
          ids.has(controlledId),
          `Missing controlled element: ${controlledId}`,
        );
      assert.ok(!/NaN|undefined/.test(css));
      if (pathname !== "/") assert.match(html, /aria-current="location"/);
    } finally {
      sheet.seal();
    }
  }
});
