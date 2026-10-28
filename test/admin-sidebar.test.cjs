const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve, dirname } = require("node:path");
const { Module } = require("node:module");
const ts = require("typescript");
const React = require("react");
const router = require("react-router-dom");
const { renderToStaticMarkup } = require("react-dom/server");
const { ThemeProvider } = require("styled-components");

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

function load(relative, mocks = {}) {
  const filename = resolve(__dirname, relative);
  const loaded = new Module(filename, module);
  const localRequire = Module.createRequire(filename);
  loaded.filename = filename;
  loaded.paths = Module._nodeModulePaths(dirname(filename));
  loaded.require = (id) => (id in mocks ? mocks[id] : localRequire(id));
  loaded._compile(compile(readFileSync(filename, "utf8"), filename), filename);
  return loaded.exports;
}
function nodes(node, result = []) {
  React.Children.forEach(node, (child) => {
    if (React.isValidElement(child)) {
      result.push(child);
      nodes(child.props.children, result);
    }
  });
  return result;
}
function hooksHarness(relative, mocks) {
  const state = [],
    refs = [];
  let stateCursor = 0,
    refCursor = 0,
    effects = [];
  const hooks = {
    ...React,
    useState(initial) {
      const i = stateCursor++;
      if (!(i in state))
        state[i] = typeof initial === "function" ? initial() : initial;
      return [
        state[i],
        (update) => {
          state[i] = typeof update === "function" ? update(state[i]) : update;
        },
      ];
    },
    useRef: (initial) => (refs[refCursor++] ??= { current: initial }),
    useId: () => "sidebar-test",
    useEffect: (callback) => effects.push(callback),
  };
  const exports = load(relative, { ...mocks, react: hooks });
  return {
    refs,
    render(name, props) {
      stateCursor = refCursor = 0;
      effects = [];
      return nodes(exports[name](props));
    },
    get effects() {
      return effects;
    },
  };
}

const menuPath = "../src/admin/components/AdminSidebarMenu/index.tsx";
const menuStyles = require("../src/admin/components/AdminSidebarMenu/styles.ts");
const {
  adminMenuGroups,
} = require("../src/admin/components/AdminSidebarMenu/navigation.ts");
const { lightTheme, darkTheme } = require("../src/styles/themes.ts");
const notificationMock = (unreadCount = 0) => ({
  useNotifications: () => ({ unreadCount }),
});
const destinations = (groups) =>
  groups.flatMap((group) => group.items.map((item) => item.to));

test("all sidebar destinations resolve to existing admin routes without duplicates", () => {
  const source = ts.createSourceFile(
    "routes.tsx",
    readFileSync(
      resolve(__dirname, "../src/admin/routes/admin.routes.tsx"),
      "utf8",
    ),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const paths = new Set();
  function visit(node) {
    if (
      ts.isJsxAttribute(node) &&
      node.name.getText(source) === "path" &&
      node.initializer &&
      ts.isStringLiteral(node.initializer)
    )
      paths.add(node.initializer.text);
    ts.forEachChild(node, visit);
  }
  visit(source);
  const links = destinations(adminMenuGroups("SUPER_ADMIN"));
  assert.equal(new Set(links).size, links.length);
  for (const to of links)
    assert.ok(paths.has(to === "/admin" ? to : to.slice(7)), to);
});

test("user management stays exclusive to superadmins even through search", () => {
  const superLinks = destinations(adminMenuGroups("SUPER_ADMIN"));
  for (const role of [undefined, "ADMIN", "RESEARCHER"]) {
    const groups = adminMenuGroups(role);
    assert.ok(groups.every((group) => group.items.length > 0));
    assert.deepEqual(
      destinations(groups),
      superLinks.filter((to) => to !== "/admin/usuarios"),
    );
    assert.deepEqual(adminMenuGroups(role, "usuarios"), []);
    assert.deepEqual(adminMenuGroups(role, "administração"), []);
  }
  assert.deepEqual(destinations(adminMenuGroups("SUPER_ADMIN", "usuarios")), [
    "/admin/usuarios",
  ]);
});

test("menu search accepts accents, case, multiple words and group names", () => {
  for (const [query, expected] of [
    ["  JURIS historicos  ", ["/admin/juris"]],
    ["dossies", ["/admin/artigos"]],
    ["simpósios", ["/admin/encontros"]],
    ["seminarios", ["/admin/encontros"]],
    ["linhas TEMÁTICAS", ["/admin/tematicas"]],
    ["comunicacao", ["/admin/noticias", "/admin/agenda", "/admin/newsletter"]],
    ["nenhuma seção assim", []],
  ])
    assert.deepEqual(destinations(adminMenuGroups("ADMIN", query)), expected);
});

test("nested pages highlight only their own section and collapsed links retain accessible names", () => {
  const { AdminSidebarMenu } = load(menuPath, {
    "../../contexts/NotificationsContext": notificationMock(123),
  });
  for (const theme of [lightTheme, darkTheme]) {
    for (const [pathname, expected] of [
      ["/admin", "/admin"],
      ["/admin/juris/ii-juri/editar", "/admin/juris"],
      ["/admin/jurisdicao", null],
    ]) {
      const html = renderToStaticMarkup(
        React.createElement(
          ThemeProvider,
          { theme },
          React.createElement(
            router.MemoryRouter,
            { initialEntries: [pathname] },
            React.createElement(AdminSidebarMenu, {
              role: "ADMIN",
              compact: true,
              onNavigate() {},
            }),
          ),
        ),
      );
      const current = [...html.matchAll(/<a\b[^>]*>/g)]
        .map((match) => match[0])
        .filter((tag) => tag.includes('aria-current="page"'));
      assert.equal(current.length, expected ? 1 : 0);
      if (expected) assert.ok(current[0].includes(`href="${expected}"`));
      assert.match(html, /aria-label="Notificações: 123 não lidas"/);
      assert.match(html, />99\+</);
      assert.match(html, /title="Júris históricos"/);
      assert.doesNotMatch(html, /type="search"|\/admin\/usuarios/);
    }
  }
});

test("search, empty results, Escape and clearing work without closing the drawer", () => {
  let closed = 0,
    focused = 0;
  const menu = hooksHarness(menuPath, {
    "react-router-dom": {
      ...router,
      useLocation: () => ({ pathname: "/admin" }),
    },
    "../../contexts/NotificationsContext": notificationMock(),
  });
  const render = () =>
    menu.render("AdminSidebarMenu", {
      role: "ADMIN",
      compact: false,
      onNavigate: () => closed++,
    });
  const input = () => render().find((node) => node.type === "input");
  const links = () =>
    render().filter((node) => node.type === menuStyles.NavItem);
  render();
  menu.refs[0].current = { focus: () => focused++ };
  input().props.onChange({ target: { value: "DOSSIES" } });
  assert.deepEqual(
    links().map((node) => node.props.to),
    ["/admin/artigos"],
  );
  assert.equal(
    render().find((node) => node.type === menuStyles.SearchSummary).props
      .children,
    "1 seção encontrada",
  );
  input().props.onChange({ target: { value: "não existe" } });
  assert.equal(links().length, 0);
  assert.ok(render().some((node) => node.type === menuStyles.EmptySearch));
  let prevented = false,
    stopped = false;
  input().props.onKeyDown({
    key: "Escape",
    preventDefault: () => (prevented = true),
    stopPropagation: () => (stopped = true),
  });
  assert.equal(input().props.value, "");
  assert.ok(prevented && stopped);
  assert.equal(focused, 1);
  assert.equal(closed, 0);
  input().props.onChange({ target: { value: "videos" } });
  render()
    .find((node) => node.type === menuStyles.ClearSearch)
    .props.onClick();
  assert.equal(input().props.value, "");
  assert.equal(focused, 2);
});

test("following a filtered link restores the full menu and closes mobile navigation", () => {
  let closed = 0;
  const menu = hooksHarness(menuPath, {
    "react-router-dom": {
      ...router,
      useLocation: () => ({ pathname: "/admin" }),
    },
    "../../contexts/NotificationsContext": notificationMock(),
  });
  const render = (compact = false) =>
    menu.render("AdminSidebarMenu", {
      role: "ADMIN",
      compact,
      onNavigate: () => closed++,
    });
  const fullCount = render().filter(
    (node) => node.type === menuStyles.NavItem,
  ).length;
  render()
    .find((node) => node.type === "input")
    .props.onChange({ target: { value: "juris" } });
  assert.equal(
    render().filter((node) => node.type === menuStyles.NavItem).length,
    1,
  );
  assert.equal(
    render(true).filter((node) => node.type === menuStyles.NavItem).length,
    fullCount,
  );
  render()
    .find((node) => node.type === menuStyles.NavItem)
    .props.onClick();
  assert.equal(closed, 1);
  assert.equal(
    render().filter((node) => node.type === menuStyles.NavItem).length,
    fullCount,
  );
});

test("mobile drawer traps focus including the search input and restores the opener on Escape", (context) => {
  const saved = {
    window: global.window,
    document: global.document,
    requestAnimationFrame: global.requestAnimationFrame,
    cancelAnimationFrame: global.cancelAnimationFrame,
  };
  context.after(() => {
    for (const [key, value] of Object.entries(saved)) {
      if (value === undefined) delete global[key];
      else global[key] = value;
    }
  });
  const events = new Map();
  global.window = { matchMedia: () => ({ matches: true }) };
  global.document = {
    activeElement: null,
    addEventListener: (name, fn) => events.set(name, fn),
    removeEventListener: (name) => events.delete(name),
  };
  global.requestAnimationFrame = (fn) => {
    fn();
    return 1;
  };
  global.cancelAnimationFrame = () => {};
  const focusable = () => ({
    focus() {
      global.document.activeElement = this;
    },
  });
  const close = focusable(),
    search = focusable(),
    last = focusable(),
    opener = focusable();
  const layout = hooksHarness("../src/admin/layouts/AdminLayout/index.tsx", {
    "react-router-dom": { ...router, useNavigate: () => () => {} },
    "../../../assets/images/leviataLogo.png": "logo.png",
    "../../hooks/useAuth": {
      useAuth: () => ({
        user: { email: "admin@example.test", role: "ADMIN" },
        signOut() {},
      }),
    },
    "../../utils/users": { formatUserRole: (role) => role },
    "../../components/AdminSidebarMenu": { AdminSidebarMenu: () => null },
    "../../components/AdminUserMenu": { AdminUserMenu: () => null },
    "../../components/NotificationBell": { NotificationBell: () => null },
    "../../../components/ThemeToggle": { ThemeToggle: () => null },
  });
  const styles = require("../src/admin/layouts/AdminLayout/styles.ts");
  const render = () => layout.render("AdminLayout");
  let tree = render();
  assert.equal(
    tree.find((node) => node.type === styles.Sidebar).props.inert,
    true,
  );
  tree.find((node) => node.type === styles.ToggleButton).props.onClick();
  tree = render();
  assert.equal(
    tree.find((node) => node.type === styles.Sidebar).props["aria-modal"],
    true,
  );
  assert.equal(
    tree.find((node) => node.type === styles.Main).props.inert,
    true,
  );
  layout.refs[0].current = {
    querySelector: () => close,
    querySelectorAll: (selector) => {
      assert.match(selector, /input/);
      return [close, search, last];
    },
  };
  layout.refs[1].current = opener;
  const cleanup = layout.effects[1]();
  assert.equal(global.document.activeElement, close);
  global.document.activeElement = last;
  events.get("keydown")({ key: "Tab", shiftKey: false, preventDefault() {} });
  assert.equal(global.document.activeElement, close);
  events.get("keydown")({ key: "Tab", shiftKey: true, preventDefault() {} });
  assert.equal(global.document.activeElement, last);
  events.get("keydown")({ key: "Escape", preventDefault() {} });
  assert.equal(
    render().find((node) => node.type === styles.Sidebar).props.inert,
    true,
  );
  cleanup();
  assert.equal(global.document.activeElement, opener);
  assert.equal(events.size, 0);
});
