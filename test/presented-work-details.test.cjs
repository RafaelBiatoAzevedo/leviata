const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { ThemeProvider, ServerStyleSheet } = require("styled-components");
const { MemoryRouter, Routes, Route } = require("react-router-dom");

for (const extension of [".ts", ".tsx"]) {
  require.extensions[extension] = (loaded, filename) =>
    loaded._compile(
      ts.transpileModule(readFileSync(filename, "utf8"), {
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
}

const fixture = {
  id: "work-id",
  slug: "trabalho-cadastrado",
  title: "História do cativeiro",
  date: "2026-10-22T18:45:00.000Z",
  location: "Auditório cadastrado",
  authors: [
    {
      id: "presenter-id",
      name: "Maria Apresentadora",
      category: "PESQUISADOR",
      academicTitle: { abbreviation: "Dra.", name: "Doutora" },
      institution: { name: "Universidade cadastrada", acronym: "UC" },
      imageUrl: "https://example.org/pessoa.jpg",
      bio: "Biografia cadastrada na API.",
      lattesUrl: "https://example.org/lattes",
      website: "https://example.org/site",
      linkedinUrl: "https://example.org/linkedin",
      orcid: "0000-0001-2345-678X",
    },
  ],
  meetingId: "meeting-id",
  meeting: {
    id: "meeting-id",
    slug: "encontro-cadastrado",
    title: "Seminário vinculado",
    type: "SEMINAR",
    date: "2026-10-23T00:00:00.000Z",
    coverUrl: "https://example.org/encontro.jpg",
    description: "Descrição do encontro vinculado.",
    location: "Local do encontro",
  },
  registrationUrl: "https://example.org/inscricao",
  meetingUrl: "https://example.org/transmissao",
  recordingUrl: "https://example.org/gravacao",
  documentUrl: "https://example.org/documento.pdf",
  images: [
    {
      id: "image-id",
      imageUrl: "https://example.org/registro.jpg",
      title: "Foto da apresentação",
      description: "Legenda cadastrada",
    },
  ],
  createdAt: "2026-10-20T12:00:00.000Z",
  updatedAt: "2026-10-22T15:00:00.000Z",
};
let response;
const hookFile = resolve(__dirname, "../src/hooks/usePublicData.ts");
require.cache[hookFile] = {
  id: hookFile,
  filename: hookFile,
  loaded: true,
  exports: {
    usePublicRecord(resource, identifier) {
      assert.equal(resource, "presented-works");
      assert.equal(identifier, fixture.slug);
      return response;
    },
  },
};
const {
  PresentedWorkDetails,
} = require("../src/pages/PresentedWorkDetails/index.tsx");
const { lightTheme } = require("../src/styles/themes.ts");

function render(data = fixture, options = {}) {
  response = { data, loading: false, error: false, ...options };
  const sheet = new ServerStyleSheet();
  try {
    const html = renderToStaticMarkup(
      sheet.collectStyles(
        React.createElement(
          ThemeProvider,
          { theme: lightTheme },
          React.createElement(
            MemoryRouter,
            {
              initialEntries: [
                `/atividades/apresentacoes-trabalhos/${fixture.slug}`,
              ],
            },
            React.createElement(
              Routes,
              null,
              React.createElement(Route, {
                path: "/atividades/apresentacoes-trabalhos/:id",
                element: React.createElement(PresentedWorkDetails),
              }),
            ),
          ),
        ),
      ),
    );
    assert.ok(!/undefined|NaN/.test(html));
    return { html, css: sheet.getStyleTags() };
  } finally {
    sheet.seal();
  }
}

test("renders the presentation, its presenter, affiliation, meeting, materials and image metadata", () => {
  const { html, css } = render();
  for (const text of [
    fixture.title,
    fixture.location,
    "Apresentador",
    "Maria Apresentadora",
    "Dra.",
    "Doutora",
    "Universidade cadastrada",
    "UC",
    fixture.authors[0].bio,
    fixture.meeting.title,
    fixture.meeting.description,
    fixture.meeting.location,
    "Foto da apresentação",
    "Legenda cadastrada",
    "Cadastrado em",
    "Atualizado em",
  ]) {
    assert.ok(html.includes(text), text);
  }
  assert.match(html, /22 de outubro de 2026 às 15:45/);
  assert.match(html, /23 de outubro de 2026/);
  for (const field of [
    "registrationUrl",
    "meetingUrl",
    "recordingUrl",
    "documentUrl",
  ]) {
    assert.ok(html.includes(`href="${fixture[field]}"`), field);
  }
  for (const field of ["lattesUrl", "website", "linkedinUrl"]) {
    assert.ok(html.includes(`href="${fixture.authors[0][field]}"`), field);
  }
  assert.ok(html.includes('href="https://orcid.org/0000-0001-2345-678X"'));
  assert.ok(html.includes('href="/atividades/seminarios/encontro-cadastrado"'));
  assert.ok(html.includes(`src="${fixture.images[0].imageUrl}"`));
  assert.match(css, /max-width:\s*640px/);
});

test("shows every presenter and handles missing optional profile data", () => {
  const { html } = render({
    ...fixture,
    authors: [fixture.authors[0], { id: "second", name: "João Apresentador" }],
  });
  assert.match(html, /Apresentadores/);
  assert.ok(
    html.indexOf("Maria Apresentadora") < html.indexOf("João Apresentador"),
  );
});

test("omits absent optional sections and reports when presenters were not supplied", () => {
  const { html } = render({
    ...fixture,
    authors: [],
    meeting: null,
    images: [],
    location: null,
    registrationUrl: null,
    meetingUrl: null,
    recordingUrl: null,
    documentUrl: null,
    createdAt: "",
    updatedAt: "",
  });
  assert.match(html, /Apresentadores não informados/);
  assert.match(html, /Não informado/);
  for (const section of [
    "Encontro vinculado",
    "Acessos e materiais",
    "Fotos e registros",
    "Cadastrado em",
    "Atualizado em",
  ])
    assert.ok(!html.includes(section));
  assert.ok(!html.includes('href="#"'));
});

test("does not turn malformed links into public actions", () => {
  const { html } = render({
    ...fixture,
    authors: [],
    registrationUrl: "javascript:alert(1)",
    meetingUrl: "data:text/html,test",
    recordingUrl: "invalid",
    documentUrl: "",
  });
  assert.ok(!html.includes("Acessos e materiais"));
  assert.ok(!html.includes("javascript:"));
});

test("keeps the São Paulo date and time together across year boundaries", () => {
  const { html } = render({ ...fixture, date: "2026-01-01T01:15:00.000Z" });
  assert.match(html, /31 de dezembro de 2025 às 22:15/);
});

test("provides loading and error states without rendering stale content", () => {
  const loading = render(fixture, { loading: true }).html;
  assert.match(loading, /role="status"/);
  assert.match(loading, /Carregando a apresentação/);
  assert.ok(!loading.includes(fixture.title));
  const error = render(null, { error: true }).html;
  assert.match(error, /role="alert"/);
  assert.match(error, /Não foi possível carregar a apresentação/);
  assert.ok(error.includes('href="/atividades/apresentacoes-trabalhos"'));
});
