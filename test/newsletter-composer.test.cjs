const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve, dirname } = require("node:path");
const { Module } = require("node:module");
const ts = require("typescript");
const React = require("react");

function compile(source, filename) {
  return ts.transpileModule(source, { fileName: filename, compilerOptions: {
    module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true, target: ts.ScriptTarget.ES2022,
  } }).outputText;
}
for (const extension of [".ts", ".tsx"])
  require.extensions[extension] = (loaded, filename) => loaded._compile(compile(readFileSync(filename, "utf8"), filename), filename);
function load(path, overrides = {}) {
  const filename = resolve(__dirname, path), loaded = new Module(filename, module);
  loaded.filename = filename;
  loaded.paths = Module._nodeModulePaths(dirname(filename));
  const original = Module.createRequire(filename);
  loaded.require = name => Object.hasOwn(overrides, name) ? overrides[name] : original(name);
  loaded._compile(compile(readFileSync(filename, "utf8"), filename), filename);
  return loaded.exports;
}
function nodes(tree, result = []) {
  React.Children.forEach(tree, child => { if (React.isValidElement(child)) { result.push(child); nodes(child.props.children, result); } });
  return result;
}
const { defaultNewsletterContent, moveNewsletterEntry } = load("../src/admin/utils/newsletterComposer.ts");
const { newsletterSchema } = load("../src/admin/validations/newsletter.schema.ts");
const { newsletterPdfUrl } = load("../src/utils/newsletterPdf.ts");
const form = data => ({ title: "Boletim de junho", subject: "Novidades do grupo", htmlContent: "", ...data });

test("generated PDF paths resolve against the API while legacy URLs stay readable", () => {
  assert.equal(newsletterPdfUrl("/newsletter/edition-id/pdf", "https://example.org/api"), "https://example.org/api/newsletter/edition-id/pdf");
  assert.equal(newsletterPdfUrl("https://example.org/antigo.pdf", "https://api.example.org"), "https://example.org/antigo.pdf");
  assert.equal(newsletterPdfUrl("javascript:alert(1)"), null);
  assert.equal(newsletterPdfUrl(null), null);
});

test("visual content generates without requiring the user to write HTML", () => {
  const contentData = defaultNewsletterContent();
  contentData.sections[0].items[0].text = "Uma notícia escrita normalmente.";
  assert.equal(newsletterSchema.safeParse(form({ contentData })).success, true);
  contentData.mode = "html";
  assert.equal(newsletterSchema.safeParse(form({ contentData })).success, false);
  assert.equal(newsletterSchema.safeParse(form({ contentData, htmlContent: "<p>Código personalizado</p>" })).success, true);
});

test("empty editions and unsafe image or button URLs are rejected before saving", () => {
  const contentData = defaultNewsletterContent();
  assert.equal(newsletterSchema.safeParse(form({ contentData })).success, false);
  contentData.sections[0].items[0].title = "Uma chamada";
  contentData.sections[0].items[0].linkUrl = "javascript:alert(1)";
  assert.equal(newsletterSchema.safeParse(form({ contentData })).success, false);
  contentData.sections[0].items[0].linkUrl = "https://example.org/evento";
  assert.equal(newsletterSchema.safeParse(form({ contentData })).success, true);
});

test("reordering is immutable and preserves all text and image data", () => {
  const items = [{ id: "a", text: "Texto A", imageUrl: "foto-a" }, { id: "b", text: "Texto B", imageUrl: "foto-b" }];
  const moved = moveNewsletterEntry(items, 1, -1);
  assert.deepEqual(items.map(item => item.id), ["a", "b"]);
  assert.deepEqual(moved.map(item => item.id), ["b", "a"]);
  assert.equal(moved[0], items[1]);
  assert.equal(moveNewsletterEntry(items, 0, -1), items);
});

function composer(upload = async () => ({ data: { url: "https://example.org/imagem.jpg" } })) {
  let value = defaultNewsletterContent();
  const { NewsletterComposer } = load("../src/admin/components/NewsletterComposer/index.tsx", {
    react: { ...React, useId: () => "test-composer" },
    "../../services/newsletter": { newsletterService: { uploadContentImage: upload } },
  });
  return {
    value: () => value,
    render: () => nodes(NewsletterComposer({ value, onChange: update => { value = update(value); } })),
  };
}

test("template switches preserve the edition's text instead of replacing it with example content", () => {
  const editor = composer();
  editor.render().find(node => node.props.label === "Texto").props.onChange({ target: { value: "Texto que precisa ser preservado" } });
  for (const template of ["CLASSIC", "EDITORIAL", "MAGAZINE"]) {
    editor.render().find(node => node.key === template).props.onClick();
    assert.equal(editor.value().template, template);
    assert.equal(editor.value().sections[0].items[0].text, "Texto que precisa ser preservado");
  }
});

test("adding a compact events section preserves the previous sections and independent IDs", () => {
  const editor = composer();
  const original = editor.value().sections[0];
  editor.render().find(node => node.key === "Chamadas e eventos").props.onClick();
  assert.equal(editor.value().sections.length, 2);
  assert.equal(editor.value().sections[1].layout, "briefs");
  assert.equal(editor.value().sections[0], original);
  assert.notEqual(editor.value().sections[1].id, original.id);
});

test("an image upload does not overwrite text edited while the upload was in flight", async () => {
  let finish;
  const editor = composer(() => new Promise(resolve => { finish = resolve; }));
  const image = editor.render().find(node => node.props.label === "Imagem do conteúdo");
  const uploading = image.props.onChange(new File(["cropped image"], "imagem.png"));
  editor.render().find(node => node.props.label === "Texto").props.onChange({ target: { value: "Texto digitado durante o upload" } });
  finish({ data: { url: "https://example.org/imagem.jpg" } });
  await uploading;
  const item = editor.value().sections[0].items[0];
  assert.equal(item.text, "Texto digitado durante o upload");
  assert.equal(item.imageUrl, "https://example.org/imagem.jpg");
});
