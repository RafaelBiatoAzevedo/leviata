const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { ThemeProvider } = require("styled-components");

// Load the actual TSX component in Node without adding a browser test dependency.
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

const {
  AdminPagination,
} = require("../src/admin/components/AdminPagination/index.tsx");
const { lightTheme } = require("../src/styles/themes.ts");

function render(props = {}) {
  return renderToStaticMarkup(
    React.createElement(
      ThemeProvider,
      { theme: lightTheme },
      React.createElement(AdminPagination, {
        page: 1,
        rowsPerPage: 15,
        total: 241,
        onPageChange() {},
        onRowsPerPageChange() {},
        ...props,
      }),
    ),
  );
}

function isDisabled(markup, label) {
  const button = markup.match(
    new RegExp(`<button[^>]*aria-label="${label}"[^>]*>`),
  );
  assert.ok(button, `Missing button: ${label}`);
  return button[0].includes("disabled=");
}

test("matches the reference range and prevents navigating before the first page", () => {
  const markup = render();
  assert.match(markup, /Linhas por página:/);
  assert.match(markup, /1-15 de 241/);
  assert.match(markup, /<option value="15" selected="">15<\/option>/);
  assert.equal(isDisabled(markup, "Primeira página"), true);
  assert.equal(isDisabled(markup, "Página anterior"), true);
  assert.equal(isDisabled(markup, "Próxima página"), false);
  assert.equal(isDisabled(markup, "Última página"), false);
});

test("shows the partial last page and prevents navigating beyond it", () => {
  const markup = render({ page: 17 });
  assert.match(markup, /241-241 de 241/);
  assert.equal(isDisabled(markup, "Primeira página"), false);
  assert.equal(isDisabled(markup, "Página anterior"), false);
  assert.equal(isDisabled(markup, "Próxima página"), true);
  assert.equal(isDisabled(markup, "Última página"), true);
});

test("handles an empty filtered list without negative ranges", () => {
  const markup = render({ total: 0 });
  assert.match(markup, /0-0 de 0/);
  for (const label of [
    "Primeira página",
    "Página anterior",
    "Próxima página",
    "Última página",
  ]) {
    assert.equal(isDisabled(markup, label), true);
  }
});

test("changing the page size changes the displayed interval", () => {
  const markup = render({ page: 2, rowsPerPage: 50 });
  assert.match(markup, /51-100 de 241/);
  assert.match(markup, /<option value="50" selected="">50<\/option>/);
});

test("prevents new navigation and hides stale ranges while loading", () => {
  const markup = render({ page: 2, loading: true });
  assert.match(markup, /Carregando…/);
  assert.doesNotMatch(markup, /16-30 de 241/);
  for (const label of [
    "Primeira página",
    "Página anterior",
    "Próxima página",
    "Última página",
  ]) {
    assert.equal(isDisabled(markup, label), true);
  }
});
