const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve, dirname } = require("node:path");
const { Module } = require("node:module");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { MemoryRouter } = require("react-router-dom");
const { ThemeProvider } = require("styled-components");
const compile = (filename) =>
  ts.transpileModule(readFileSync(filename, "utf8"), {
    fileName: filename,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
for (const extension of [".ts", ".tsx"])
  require.extensions[extension] = (loaded, filename) =>
    loaded._compile(compile(filename), filename);
const apiFilename = resolve(__dirname, "../src/services/api.ts");
require.cache[apiFilename] ??= {
  id: apiFilename,
  filename: apiFilename,
  loaded: true,
  exports: { api: {} },
};
const { AuthContext } = require("../src/contexts/auth-context.ts");
const { lightTheme } = require("../src/styles/themes.ts");
const {
  AdminIconButton,
} = require("../src/admin/components/AdminIconButton/index.tsx");
const {
  AdminButton,
} = require("../src/admin/components/AdminButton/index.tsx");
const {
  AdminGallery,
} = require("../src/admin/components/AdminGallery/index.tsx");
const {
  adminMenuGroups,
} = require("../src/admin/components/AdminSidebarMenu/navigation.ts");
function render(role, element) {
  return renderToStaticMarkup(
    React.createElement(
      AuthContext.Provider,
      { value: { user: role ? { role, email: "admin@example.test" } : null } },
      React.createElement(
        ThemeProvider,
        { theme: lightTheme },
        React.createElement(MemoryRouter, null, element),
      ),
    ),
  );
}
function openedUserMenu() {
  const filename = resolve(
    __dirname,
    "../src/admin/components/AdminUserMenu/index.tsx",
  );
  const loaded = new Module(filename, module);
  loaded.filename = filename;
  loaded.paths = Module._nodeModulePaths(dirname(filename));
  const req = Module.createRequire(filename);
  loaded.require = (name) =>
    name === "react"
      ? { ...React, useState: () => [true, () => {}] }
      : req(name);
  loaded._compile(compile(filename), filename);
  return loaded.exports.AdminUserMenu;
}
test("only superadministrators can see record or file deletion controls", () => {
  for (const Component of [AdminButton, AdminIconButton]) {
    const action = React.createElement(
      Component,
      { permission: "delete", title: "Excluir" },
      "Excluir registro",
    );
    assert.doesNotMatch(render("ADMIN", action), /Excluir/);
    assert.doesNotMatch(render(undefined, action), /Excluir/);
    assert.match(render("SUPER_ADMIN", action), /Excluir registro/);
    assert.match(
      render("ADMIN", React.createElement(Component, null, "Salvar")),
      /Salvar/,
    );
  }
});
test("administrators cannot remove saved gallery files, but can discard unsaved uploads", () => {
  const gallery = {
    images: [
      {
        id: "saved-image",
        key: "saved",
        imageUrl: "/saved.png",
        title: "",
        description: "",
      },
      { key: "draft", imageUrl: "/draft.png", title: "", description: "" },
    ],
    add() {},
    update() {},
    remove() {},
  };
  const admin = render("ADMIN", React.createElement(AdminGallery, { gallery }));
  assert.doesNotMatch(admin, /aria-label="Remover imagem 1"/);
  assert.match(admin, /aria-label="Remover imagem 2"/);
  assert.match(
    render("SUPER_ADMIN", React.createElement(AdminGallery, { gallery })),
    /aria-label="Remover imagem 1"/,
  );
});
test("user management is absent from the administrator top menu and sidebar, and remains available to superadministrators", () => {
  const Menu = openedUserMenu();
  for (const role of ["ADMIN", "SUPER_ADMIN"]) {
    const html = render(role, React.createElement(Menu, { onLogout() {} }));
    assert.equal(html.includes("Gerenciar usuários"), role === "SUPER_ADMIN");
    const links = adminMenuGroups(role).flatMap((group) => group.items);
    assert.equal(
      links.some((item) => item.to === "/admin/usuarios"),
      role === "SUPER_ADMIN",
    );
    assert.match(html, /Minha conta/);
  }
});
