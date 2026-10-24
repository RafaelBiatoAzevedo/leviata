const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { ThemeProvider } = require("styled-components");

for (const extension of [".ts", ".tsx"]) {
  require.extensions[extension] = (module, filename) => {
    const { outputText } = ts.transpileModule(readFileSync(filename, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
        target: ts.ScriptTarget.ES2022,
      },
      fileName: filename,
    });
    module._compile(outputText, filename);
  };
}
const { AdminTable } = require("../src/admin/components/AdminTable/index.tsx");
const { lightTheme } = require("../src/styles/themes.ts");
const h = React.createElement;

function table({
  headers = ["Título", "Ano", "Ações"],
  cells = [
    h("strong", null, "História do cativeiro"),
    2026,
    h("button", { onClick() {} }, "Editar"),
  ],
  ...props
} = {}) {
  return h(
    AdminTable,
    props,
    h(
      "thead",
      null,
      h(
        "tr",
        null,
        headers.map((name, i) => h("th", { key: i }, name)),
      ),
    ),
    h(
      "tbody",
      null,
      h(
        "tr",
        { key: "record" },
        cells.map((value, i) => h("td", { key: i }, value)),
      ),
    ),
  );
}
function render(content) {
  return renderToStaticMarkup(h(ThemeProvider, { theme: lightTheme }, content));
}
function elements(node, result = []) {
  React.Children.forEach(node, (child) => {
    if (React.isValidElement(child)) {
      result.push(child);
      elements(child.props.children, result);
    }
  });
  return result;
}

test("each mobile field remains associated with its table header", () => {
  const html = render(table());
  const ids = [...html.matchAll(/<th\b[^>]*id="([^"]+)"/g)].map(
    (match) => match[1],
  );
  const associations = [...html.matchAll(/<td\b[^>]*headers="([^"]+)"/g)].map(
    (match) => match[1],
  );
  assert.equal(ids.length, 3);
  assert.deepEqual(associations, ids);
  assert.match(html, /scope="col" role="columnheader"/);
  assert.match(html, /data-kind="field" data-label="Ano"/);
  assert.match(html, /aria-hidden="true"[^>]*>Ano<\/span>/);
  assert.match(html, /role="table" aria-label="Registros cadastrados"/);
});

test("people use their name as the card heading and retain their academic title", () => {
  const html = render(
    table({
      headers: ["Foto", "Título", "Nome", "Ações"],
      cells: [
        h("img", { alt: "Maria", src: "data:image/png;base64,AA" }),
        "Doutora",
        h("strong", null, "Maria Santos"),
        "Editar",
      ],
    }),
  );
  assert.match(html, /data-kind="image" data-label="Foto"/);
  assert.match(html, /data-kind="field" data-label="Título"[^]*?Doutora/);
  assert.match(html, /data-kind="primary" data-label="Nome"[^]*?Maria Santos/);
  assert.match(html, /data-has-image="true"/);
});

test("loading replaces stale rows with one announced state spanning every column", () => {
  const html = render(table({ loading: true }));
  assert.match(html, /aria-busy="true"/);
  assert.match(html, /colSpan="3"/i);
  assert.match(html, /role="status"/);
  assert.match(html, /Carregando registros/);
  assert.doesNotMatch(html, /História do cativeiro/);
});

test("responsive rendering retains action handlers and disabled permissions", () => {
  let calls = 0,
    captured;
  const action = h(
    "button",
    { disabled: true, onClick: () => calls++ },
    "Excluir",
  );
  function Capture() {
    const source = table({ cells: ["Registro", 2026, action] });
    captured = AdminTable(source.props);
    return captured;
  }
  render(h(Capture));
  const button = elements(captured).find((node) => node.type === "button");
  assert.equal(button.props.disabled, true);
  assert.equal(button.props.onClick, action.props.onClick);
  button.props.onClick();
  assert.equal(calls, 1);
});

test("multiple lists on one screen have distinct header IDs", () => {
  const html = render(h(React.Fragment, null, table(), table()));
  const ids = [...html.matchAll(/<th\b[^>]*id="([^"]+)"/g)].map(
    (match) => match[1],
  );
  assert.equal(ids.length, 6);
  assert.equal(new Set(ids).size, ids.length);
});

test("empty lists preserve their structure without announcing a false loading state", () => {
  const html = render(
    h(
      AdminTable,
      { label: "Pessoas cadastradas" },
      h("thead", null, h("tr", null, h("th", { id: "person-name" }, "Nome"))),
      h("tbody"),
    ),
  );
  assert.match(html, /aria-label="Pessoas cadastradas" aria-busy="false"/);
  assert.match(html, /id="person-name"/);
  assert.doesNotMatch(html, /role="status"/);
});
