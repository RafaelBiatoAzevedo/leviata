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

function load(mocks = {}) {
  const filename = resolve(
    __dirname,
    "../src/admin/pages/AdminLogin/index.tsx",
  );
  const loaded = new Module(filename, module);
  const localRequire = Module.createRequire(filename);
  const dependencies = {
    "../../../assets/images/leviataLogo.png": "/brand.png",
    "../../../components/ThemeToggle": { ThemeToggle: () => null },
    ...mocks,
  };
  loaded.filename = filename;
  loaded.paths = Module._nodeModulePaths(dirname(filename));
  loaded.require = (id) =>
    id in dependencies ? dependencies[id] : localRequire(id);
  loaded._compile(compile(readFileSync(filename, "utf8"), filename), filename);
  return loaded.exports.AdminLogin;
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
const styles = require("../src/admin/pages/AdminLogin/styles.ts");
const { lightTheme, darkTheme } = require("../src/styles/themes.ts");
function harness(implementation) {
  const state = [],
    refs = [],
    calls = [],
    sessions = [],
    navigations = [],
    effects = [];
  let cursor = 0,
    refCursor = 0;
  const hooks = {
    ...React,
    useState(initial) {
      const i = cursor++;
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
    useEffect: (callback) => effects.push(callback),
  };
  const Login = load({
    react: hooks,
    "react-router-dom": {
      ...router,
      useNavigate:
        () =>
        (...args) =>
          navigations.push(args),
    },
    "../../hooks/useAuth": {
      useAuth: () => ({ signIn: (response) => sessions.push(response) }),
    },
    "../../services/auth": {
      login: (data) => {
        calls.push(data);
        return implementation(data);
      },
    },
  });
  function render() {
    cursor = refCursor = 0;
    return nodes(Login());
  }
  const find = (type) => render().find((node) => node.type === type);
  const input = (name) =>
    render().find(
      (node) => node.type === styles.Input && node.props.name === name,
    );
  return {
    calls,
    sessions,
    navigations,
    render,
    find,
    input,
    unmount() {
      effects[0]()?.();
    },
    fill(email, password) {
      input("email").props.onChange({ target: { value: email } });
      input("password").props.onChange({ target: { value: password } });
    },
    submit: () => find(styles.Form).props.onSubmit({ preventDefault() {} }),
  };
}

test("the password eye changes visibility without changing credentials or submitting", () => {
  const form = harness(async () => {
    throw new Error("Must not log in");
  });
  form.fill("ana@example.com", " Minha senha 123! ");
  assert.equal(form.input("password").props.type, "password");
  let toggle = form.find(styles.PasswordToggle);
  assert.equal(toggle.props.type, "button");
  assert.equal(toggle.props["aria-label"], "Mostrar senha");
  assert.equal(toggle.props["aria-controls"], form.input("password").props.id);
  toggle.props.onClick();
  assert.equal(form.input("password").props.type, "text");
  toggle = form.find(styles.PasswordToggle);
  assert.equal(toggle.props["aria-label"], "Ocultar senha");
  assert.equal(toggle.props["aria-pressed"], true);
  toggle.props.onClick();
  assert.equal(form.input("password").props.type, "password");
  assert.equal(form.input("password").props.value, " Minha senha 123! ");
  assert.equal(form.input("email").props.value, "ana@example.com");
  assert.equal(form.calls.length, 0);
});

test("login blocks repeated submits, preserves password whitespace and signs in only after success", async () => {
  let finish;
  const response = {
    accessToken: "test-token",
    refreshToken: "test-refresh",
    user: { email: "ana@example.com" },
  };
  const form = harness(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  form.fill(" ANA@EXAMPLE.COM ", " Password 123! ");
  form.find(styles.PasswordToggle).props.onClick();
  const first = form.submit();
  await form.submit();
  assert.deepEqual(form.calls, [
    { email: "ana@example.com", password: " Password 123! " },
  ]);
  assert.equal(form.find(styles.SubmitButton).props.disabled, true);
  assert.equal(form.find(styles.Form).props["aria-busy"], true);
  assert.ok(
    form.input("email").props.disabled && form.input("password").props.disabled,
  );
  assert.deepEqual(form.sessions, []);
  assert.deepEqual(form.navigations, []);
  finish(response);
  await first;
  assert.deepEqual(form.sessions, [response]);
  assert.deepEqual(form.navigations, [["/admin", { replace: true }]]);
  assert.equal(form.input("password").props.type, "password");
  assert.equal(form.find(styles.SubmitButton).props.disabled, false);
});

for (const [status, message] of [
  [401, /Confira seu e-mail e sua senha/],
  [429, /Muitas tentativas/],
  [503, /serviço está indisponível/],
  [undefined, /Verifique sua conexão/],
]) {
  test(`failed login ${status ?? "network"} explains the issue and preserves the draft for retry`, async () => {
    let failure = true;
    const form = harness(async () => {
      if (failure)
        throw { isAxiosError: true, ...(status && { response: { status } }) };
      return { accessToken: "test-token" };
    });
    form.fill("ana@example.com", "Senha preservada");
    await form.submit();
    const error = form.find(styles.ErrorNotice);
    assert.equal(error.props.role, "alert");
    assert.match(error.props.children[1].props.children, message);
    assert.equal(form.input("password").props.value, "Senha preservada");
    assert.equal(form.input("email").props.value, "ana@example.com");
    assert.equal(
      form.input("password").props["aria-describedby"],
      error.props.id,
    );
    assert.equal(form.find(styles.SubmitButton).props.disabled, false);
    assert.deepEqual(form.sessions, []);
    assert.deepEqual(form.navigations, []);
    form.fill("ana@example.com", "Senha corrigida");
    assert.equal(form.find(styles.ErrorNotice), undefined);
    failure = false;
    await form.submit();
    assert.equal(form.calls.length, 2);
    assert.equal(form.sessions.length, 1);
  });
}

test("login supports browser validation and password managers, with a real portal link in both themes", () => {
  const Login = load({
    "../../hooks/useAuth": { useAuth: () => ({ signIn() {} }) },
    "../../services/auth": {
      login: () => {
        throw new Error("Rendering must not authenticate");
      },
    },
  });
  for (const theme of [lightTheme, darkTheme]) {
    const html = renderToStaticMarkup(
      React.createElement(
        ThemeProvider,
        { theme },
        React.createElement(
          router.MemoryRouter,
          null,
          React.createElement(Login),
        ),
      ),
    );
    assert.match(html, /href="\/"[^>]*>.*?Voltar ao portal/s);
    assert.match(html, /<label for="login-email">E-mail<\/label>/);
    assert.match(html, /<label for="login-password">Senha<\/label>/);
    const inputs = [...html.matchAll(/<input\b[^>]*>/g)].map(
      (match) => match[0],
    );
    for (const [name, autocomplete] of [
      ["email", "username"],
      ["password", "current-password"],
    ]) {
      const input = inputs.find((tag) => tag.includes(`name="${name}"`));
      assert.ok(input);
      assert.ok(input.includes(`type="${name}"`));
      assert.ok(input.includes(`autoComplete="${autocomplete}"`));
      assert.ok(input.includes('required=""'));
    }
    assert.match(html, /aria-label="Mostrar senha"/);
    assert.match(html, /<form[^>]*aria-busy="false"/);
    assert.doesNotMatch(html, /role="alert"/);
  }
});

test("returning to the portal during login prevents a late response from reopening the admin", async () => {
  let finish;
  const form = harness(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  form.fill("ana@example.com", "Senha 123");
  assert.equal(form.find(styles.BackLink).props.to, "/");
  const pending = form.submit();
  form.unmount();
  finish({ accessToken: "late-response" });
  await pending;
  assert.deepEqual(form.sessions, []);
  assert.deepEqual(form.navigations, []);
});
