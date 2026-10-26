const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const vm = require("node:vm");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { ThemeProvider, ServerStyleSheet } = require("styled-components");
const { MemoryRouter } = require("react-router-dom");

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
function load(relative, overrides = {}) {
  const filename = path.resolve(__dirname, relative);
  const loaded = new Module(filename, module);
  loaded.filename = filename;
  loaded.paths = Module._nodeModulePaths(path.dirname(filename));
  const originalRequire = loaded.require.bind(loaded);
  loaded.require = (id) =>
    Object.hasOwn(overrides, id) ? overrides[id] : originalRequire(id);
  loaded._compile(
    compile(fs.readFileSync(filename, "utf8"), filename),
    filename,
  );
  return loaded.exports;
}
for (const extension of [".ts", ".tsx"])
  require.extensions[extension] = (loaded, filename) =>
    loaded._compile(
      compile(fs.readFileSync(filename, "utf8"), filename),
      filename,
    );
for (const extension of [".css", ".png", ".webp", ".jpeg"])
  require.extensions[extension] = (loaded, filename) => {
    loaded.exports = filename;
  };

const { lightTheme, darkTheme } = load("../src/styles/themes.ts");
const preference = load("../src/utils/themePreference.ts");
const { darkThemeTokens } = load("../src/styles/darkThemeVariables.ts");

function environment(context, initial = {}) {
  const original = Object.fromEntries(
    ["localStorage", "document", "window"].map((key) => [
      key,
      Object.getOwnPropertyDescriptor(globalThis, key),
    ]),
  );
  const values = new Map(Object.entries(initial));
  const events = new Map();
  const meta = {};
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
  const document = {
    documentElement: { dataset: {}, style: {} },
    querySelector: () => ({
      setAttribute: (key, value) => {
        meta[key] = value;
      },
    }),
  };
  const window = {
    addEventListener: (key, handler) => events.set(key, handler),
    removeEventListener: (key) => events.delete(key),
    matchMedia: () => ({ matches: true }),
    location: { pathname: "/admin", href: "" },
  };
  for (const [key, value] of Object.entries({
    localStorage: storage,
    document,
    window,
  }))
    Object.defineProperty(globalThis, key, {
      configurable: true,
      writable: true,
      value,
    });
  context.after(() => {
    for (const [key, descriptor] of Object.entries(original)) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  });
  return { values, storage, document, window, events, meta };
}

function providerHarness() {
  const slots = [],
    pending = [];
  let cursor = 0;
  const hooks = {
    ...React,
    useState(initial) {
      const index = cursor++;
      if (!(index in slots))
        slots[index] = typeof initial === "function" ? initial() : initial;
      return [
        slots[index],
        (value) => {
          slots[index] =
            typeof value === "function" ? value(slots[index]) : value;
        },
      ];
    },
    useEffect(effect, deps) {
      const index = cursor++;
      const old = slots[index];
      if (!old || deps.some((value, i) => !Object.is(value, old.deps[i])))
        pending.push(() => {
          old?.cleanup?.();
          slots[index] = { deps, cleanup: effect() };
        });
    },
    useMemo: (factory) => factory(),
    useCallback: (callback) => callback,
  };
  const { AppearanceProvider } = load("../src/contexts/ThemeContext.tsx", {
    react: hooks,
  });
  return {
    render() {
      cursor = 0;
      const node = AppearanceProvider({ children: null });
      while (pending.length) pending.shift()();
      return node;
    },
    unmount() {
      for (const slot of slots) slot?.cleanup?.();
    },
  };
}

test("preserves every original light palette, font and breakpoint value", () => {
  const baseline = JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, "fixtures/light-theme.json"),
      "utf8",
    ),
  );
  const {
    mode,
    colors: { heading, onPrimary, ...originalColors },
    ...originalLayout
  } = lightTheme;
  assert.equal(mode, "light");
  assert.equal(heading, baseline.colors.secondary);
  assert.equal(onPrimary, baseline.colors.text);
  assert.deepEqual({ ...originalLayout, colors: originalColors }, baseline);
});

test("defaults to light even on a dark operating system and rejects invalid saved preferences", (context) => {
  const env = environment(context);
  assert.equal(preference.readThemePreference(), "light");
  for (const value of ["auto", "system", "DARK", "invalid", ""]) {
    env.values.set(preference.THEME_STORAGE_KEY, value);
    assert.equal(preference.readThemePreference(), "light");
  }
  env.values.set(preference.THEME_STORAGE_KEY, "dark");
  assert.equal(preference.readThemePreference(), "dark");
});

test("switches and persists the theme, restores it on reload and synchronizes across tabs", (context) => {
  const env = environment(context);
  const provider = providerHarness();
  let node = provider.render();
  assert.equal(node.props.value.mode, "light");
  node.props.value.toggleTheme();
  node = provider.render();
  assert.equal(node.props.value.mode, "dark");
  assert.equal(node.props.children.props.theme.mode, "dark");
  assert.equal(env.values.get(preference.THEME_STORAGE_KEY), "dark");
  assert.equal(env.document.documentElement.dataset.theme, "dark");
  assert.equal(env.document.documentElement.style.colorScheme, "dark");
  assert.equal(env.meta.content, darkTheme.colors.background);
  const reloaded = providerHarness();
  assert.equal(reloaded.render().props.value.mode, "dark");
  env.events.get("storage")({ key: "unrelated", newValue: "light" });
  assert.equal(reloaded.render().props.value.mode, "dark");
  env.events.get("storage")({
    key: preference.THEME_STORAGE_KEY,
    newValue: "light",
  });
  assert.equal(reloaded.render().props.value.mode, "light");
  reloaded.unmount();
  provider.unmount();
  assert.equal(env.events.size, 0);
});

test("theme switching still works when browser storage is unavailable", (context) => {
  const env = environment(context);
  env.storage.getItem = () => {
    throw new Error("blocked");
  };
  env.storage.setItem = () => {
    throw new Error("blocked");
  };
  const provider = providerHarness();
  let node = provider.render();
  assert.equal(node.props.value.mode, "light");
  node.props.value.toggleTheme();
  node = provider.render();
  assert.equal(node.props.value.mode, "dark");
  assert.equal(env.document.documentElement.dataset.theme, "dark");
  provider.unmount();
});

test("the initial HTML restores only an explicit dark preference before React paints", () => {
  const html = fs.readFileSync(
    path.resolve(__dirname, "../index.html"),
    "utf8",
  );
  const bootstrap = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  for (const [value, expected] of [
    [null, "light"],
    ["dark", "dark"],
    ["light", "light"],
    ["system", "light"],
  ]) {
    const document = { documentElement: { dataset: {} } };
    vm.runInNewContext(bootstrap, {
      document,
      localStorage: { getItem: () => value },
    });
    assert.equal(document.documentElement.dataset.theme, expected);
  }
  const document = { documentElement: { dataset: {} } };
  vm.runInNewContext(bootstrap, {
    document,
    localStorage: {
      getItem: () => {
        throw new Error("blocked");
      },
    },
  });
  assert.equal(document.documentElement.dataset.theme, "light");
});

test("the shared theme switch exposes its state and works with keyboard-native button activation", () => {
  let mode = "light";
  const { ThemeToggle } = load("../src/components/ThemeToggle/index.tsx", {
    "../../hooks/useThemeMode": {
      useThemeMode: () => ({
        mode,
        toggleTheme: () => {
          mode = mode === "light" ? "dark" : "light";
        },
      }),
    },
  });
  let button = ThemeToggle();
  assert.equal(button.props.type, "button");
  assert.equal(button.props.role, "switch");
  assert.equal(button.props["aria-checked"], false);
  assert.equal(button.props["aria-label"], "Tema escuro");
  button.props.onClick();
  button = ThemeToggle();
  assert.equal(button.props["aria-checked"], true);
  assert.equal(button.props.title, "Ativar tema claro");
});

function contrast(first, second) {
  const luminance = (hex) => {
    const channels = hex
      .slice(1)
      .match(/../g)
      .map((value) => parseInt(value, 16) / 255)
      .map((value) =>
        value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
      );
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  };
  const a = luminance(first),
    b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

test("dark text, muted text, primary controls and feedback maintain readable contrast", () => {
  for (const background of [
    darkTheme.colors.background,
    darkTheme.colors.surface,
    darkThemeTokens.elevated,
  ]) {
    for (const color of [
      darkTheme.colors.text,
      darkTheme.colors.heading,
      darkTheme.colors.textSoft,
      darkThemeTokens["accent-text"],
    ])
      assert.ok(
        contrast(color, background) >= 4.5,
        `${color} on ${background}`,
      );
  }
  assert.ok(
    contrast(darkTheme.colors.onPrimary, darkTheme.colors.primary) >= 4.5,
  );
  assert.ok(
    contrast(darkThemeTokens["field-border"], darkTheme.colors.surface) >= 3,
  );
  for (const status of Object.values(darkTheme.colors.feedback))
    assert.ok(contrast(status.main, status.light) >= 4.5);
});

test("portal cards and admin controls render with valid styles in both themes, keeping light fallbacks", () => {
  const { GlobalStyle } = require("../src/styles/GlobalStyle.ts");
  const { ThemeContext } = require("../src/contexts/theme-context.ts");
  const { ThemeToggle } = require("../src/components/ThemeToggle/index.tsx");
  const { NewsCard } = require("../src/components/NewsCard/index.tsx");
  const {
    AdminButton,
  } = require("../src/admin/components/AdminButton/index.tsx");
  const {
    Popover: NotificationPopover,
  } = require("../src/admin/components/NotificationBell/styles.ts");
  const {
    Input: AdminInputControl,
  } = require("../src/admin/components/AdminInput/styles.ts");
  for (const theme of [lightTheme, darkTheme]) {
    const sheet = new ServerStyleSheet();
    try {
      const html = renderToStaticMarkup(
        sheet.collectStyles(
          React.createElement(
            ThemeProvider,
            { theme },
            React.createElement(
              ThemeContext.Provider,
              { value: { mode: theme.mode, toggleTheme() {} } },
              React.createElement(
                MemoryRouter,
                null,
                React.createElement(GlobalStyle),
                React.createElement(ThemeToggle),
                React.createElement(NewsCard, {
                  slug: "noticia",
                  date: "2026-10-25",
                  title: "Notícia de teste",
                  description: "Descrição da notícia",
                  category: "EVENT",
                }),
                React.createElement(AdminButton, null, "Salvar"),
                React.createElement(AdminInputControl, {
                  "aria-label": "Nome",
                  placeholder: "Nome completo",
                }),
                React.createElement(NotificationPopover, null, "Notificações"),
              ),
            ),
          ),
        ),
      );
      const css = sheet.getStyleTags();
      assert.ok(!/undefined|NaN|\[object Object\]/.test(css));
      assert.match(
        html,
        new RegExp(`role="switch"[^>]*aria-checked="${theme.mode === "dark"}"`),
      );
      assert.match(css, new RegExp(`color-scheme:${theme.mode}`));
      assert.match(css, /var\(--theme-surface,\s*#fcfaf5\)/);
      assert.match(css, /var\(--theme-field-border,/);
      if (theme.mode === "dark") assert.match(css, /--theme-surface:#191F2A/);
      else assert.doesNotMatch(css, /--theme-surface:/);
      assert.ok(html.includes('href="/noticias/noticia"'));
    } finally {
      sheet.seal();
    }
  }
});

test("an expired admin session clears only authentication data and preserves the saved theme", async (context) => {
  const env = environment(context, {
    [preference.THEME_STORAGE_KEY]: "dark",
    "portfolio-language": "pt",
  });
  const { authStorage } = require("../src/admin/services/auth-storage.ts");
  authStorage.setToken("expired");
  authStorage.setRefreshToken("expired-refresh");
  authStorage.setUser({ id: "user", email: "test@example.org", role: "ADMIN" });
  let rejected;
  const client = {
    defaults: { headers: { common: {} } },
    interceptors: {
      response: {
        use(_success, failure) {
          rejected = failure;
        },
      },
    },
    post: async () => {
      throw new Error("expired");
    },
  };
  load("../src/services/api.ts", {
    axios: { create: () => client },
    "../config/env": { envs: { API_BASE_URL: "https://example.test" } },
  });
  const failure = {
    response: { status: 401 },
    config: { url: "/notifications", headers: {} },
  };
  await assert.rejects(rejected(failure), (error) => error === failure);
  assert.equal(authStorage.getToken(), null);
  assert.equal(authStorage.getRefreshToken(), null);
  assert.equal(authStorage.getUser(), null);
  assert.equal(env.values.get(preference.THEME_STORAGE_KEY), "dark");
  assert.equal(env.values.get("portfolio-language"), "pt");
  assert.equal(env.window.location.href, "/admin/login");
});
