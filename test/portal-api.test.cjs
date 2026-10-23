const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve, dirname } = require("node:path");
const { Module } = require("node:module");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { ThemeProvider } = require("styled-components");
const { MemoryRouter, Routes, Route, matchPath } = require("react-router-dom");

function load(relative, overrides = {}) {
  const filename = resolve(__dirname, relative);
  const loaded = new Module(filename, module);
  loaded.filename = filename;
  loaded.paths = Module._nodeModulePaths(dirname(filename));
  const localRequire = Module.createRequire(filename);
  loaded.require = (name) =>
    Object.hasOwn(overrides, name) ? overrides[name] : localRequire(name);
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
  return loaded.exports;
}
for (const extension of [".ts", ".tsx"])
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
for (const extension of [".css", ".png", ".webp", ".jpeg"])
  require.extensions[extension] = (loaded, filename) => {
    loaded.exports = filename;
  };

const { loadAllPages } = load("../src/utils/loadAllPages.ts");
const api = { get() {} };
const { publicService, publicRecordPath } = load("../src/services/public.ts", {
  "./api": { api },
  "../utils/loadAllPages": { loadAllPages },
});

test("public lists retain their filters and ordering while loading all 241 records", async (context) => {
  const people = Array.from({ length: 241 }, (_, index) => ({
    id: String(index),
  }));
  const controller = new AbortController();
  const query = {
    type: "DOSSIER",
    isActive: "true",
    sortBy: "year",
    sortOrder: "desc",
  };
  const pages = [];
  context.mock.method(api, "get", async (url, { params, signal }) => {
    assert.equal(url, "/researchInstruments");
    assert.equal(signal, controller.signal);
    assert.deepEqual(params, { ...query, page: params.page, limit: 100 });
    pages.push(params.page);
    return { data: people.slice((params.page - 1) * 100, params.page * 100) };
  });
  assert.deepEqual(
    await publicService.getAll("researchInstruments", query, controller.signal),
    people,
  );
  assert.deepEqual(pages, [1, 2, 3]);
});

test("an empty catalog returns no invented records, and a later failed page rejects the whole load", async (context) => {
  context.mock.method(api, "get", async () => ({ data: [] }));
  assert.deepEqual(await publicService.getAll("news"), []);
  context.mock.method(api, "get", async (_url, { params }) => {
    if (params.page > 1) throw new Error("Unavailable");
    return { data: Array.from({ length: 100 }, (_, id) => ({ id })) };
  });
  await assert.rejects(publicService.getAll("books"), /Unavailable/);
});

test("cancellation reaches later pages instead of returning a partial public list", async (context) => {
  const controller = new AbortController();
  context.mock.method(api, "get", async (_url, { signal }) => {
    if (signal.aborted) throw new DOMException("Cancelled", "AbortError");
    controller.abort();
    return { data: Array.from({ length: 100 }, (_, id) => ({ id })) };
  });
  await assert.rejects(
    publicService.getAll("articles", {}, controller.signal),
    { name: "AbortError" },
  );
});

test("detail requests use the API's UUID and slug routes and preserve cancellation", async (context) => {
  const uuid = "68c2af74-c459-4a33-8d98-d4a62d2152c9";
  assert.equal(
    publicRecordPath("researchInstruments", uuid),
    `/researchInstruments/${uuid}`,
  );
  assert.equal(
    publicRecordPath("news", "notícia com espaços"),
    "/news/slug/not%C3%ADcia%20com%20espa%C3%A7os",
  );
  const controller = new AbortController();
  context.mock.method(api, "get", async (url, { signal }) => {
    assert.equal(url, "/news/slug/noticia-real");
    assert.equal(signal, controller.signal);
    return { data: { title: "Registro da API" } };
  });
  assert.equal(
    (await publicService.getRecord("news", "noticia-real", controller.signal))
      .data.title,
    "Registro da API",
  );
});

let lists = {},
  records = {},
  state = {},
  requests = [],
  activeTab = "books",
  thematicRecord = null;
function cache(relative, exports) {
  const filename = resolve(__dirname, relative);
  require.cache[filename] = { id: filename, filename, loaded: true, exports };
}
cache("../src/services/api.ts", { api });
cache("../src/hooks/usePublicData.ts", {
  usePublicList(resource, query = {}) {
    requests.push({ resource, query });
    return {
      data: lists[resource] || [],
      loading: false,
      error: false,
      ...state,
    };
  },
  usePublicRecord(resource, identifier) {
    requests.push({ resource, identifier });
    return {
      data: records[resource] || null,
      loading: false,
      error: false,
      ...state,
    };
  },
});
cache("../src/hooks/useThematics.ts", {
  useThematics: () => ({ thematics: [], loading: false, error: "" }),
});
cache("../src/components/DocumentViewer/index.tsx", {
  DocumentViewer: ({ pdf, externalLink }) =>
    React.createElement(
      "a",
      {
        "data-pdf-viewer": true,
        href: pdf,
        "data-external-link": externalLink,
      },
      "PDF",
    ),
});
const { lightTheme } = require("../src/styles/themes.ts");
const {
  BibliographicSpreadsheets,
} = require("../src/pages/BibliographicSpreadsheets/index.tsx");
const { Catalogs } = require("../src/pages/ Catalogs/index.tsx");
const { Database } = require("../src/pages/Database/index.tsx");
const {
  ResearchInstrumentDetails,
} = require("../src/components/ResearchInstrumentDetails/index.tsx");
const { ResearchCenter } = require("../src/pages/ResearchCenter/index.tsx");
const { Group } = require("../src/pages/Group/index.tsx");
const {
  GalleryDetails,
} = require("../src/components/GalleryDetails/index.tsx");
const { NewsDetails } = require("../src/pages/NewsDetails/index.tsx");
const { News } = require("../src/pages/News/index.tsx");
const { Home } = require("../src/pages/Home/index.tsx");
const { Researchers } = require("../src/pages/ Researchers/index.tsx");
const { Publications } = load("../src/pages/ Publications/index.tsx", {
  react: { ...React, useState: () => [activeTab, () => {}] },
});
const { ThematicDetails } = load("../src/pages/ThematicDetails/index.tsx", {
  react: {
    ...React,
    useState: (initial) => [
      initial === null
        ? thematicRecord
        : typeof initial === "boolean"
          ? false
          : initial,
      () => {},
    ],
  },
});

function render(Component, props = {}, identifier = "registro-real") {
  return renderToStaticMarkup(
    React.createElement(
      ThemeProvider,
      { theme: lightTheme },
      React.createElement(
        MemoryRouter,
        { initialEntries: [`/${identifier}`] },
        React.createElement(
          Routes,
          null,
          React.createElement(Route, {
            path: "/:id",
            element: React.createElement(Component, props),
          }),
        ),
      ),
    ),
  );
}
function reset() {
  lists = {};
  records = {};
  state = {};
  requests = [];
  activeTab = "books";
  thematicRecord = null;
}
const person = (id, name, extra = {}) => ({
  id,
  name,
  category: "PESQUISADOR",
  academicTitle: { abbreviation: "Dra." },
  institution: { acronym: "UNI" },
  ...extra,
});
const instrument = (type, extra = {}) => ({
  id: "68c2af74-c459-4a33-8d98-d4a62d2152c9",
  slug: `registro-${type.toLowerCase()}`,
  title: `Instrumento ${type} da API`,
  type,
  startYear: null,
  endYear: null,
  content: "Conteúdo do cadastro",
  people: [],
  pdfUrl: null,
  externalUrl: null,
  ...extra,
});
const {
  researchInstrumentPeriod,
  researchInstrumentPath,
} = require("../src/utils/researchInstruments.ts");
const { newsRelatedPath } = require("../src/utils/news.ts");

test("each instrument page uses its API type and links to the real slug without fake periods", () => {
  for (const [Component, type] of [
    [BibliographicSpreadsheets, "DOSSIER"],
    [Catalogs, "CATALOG"],
    [Database, "DATABASE"],
  ]) {
    reset();
    lists.researchInstruments = [
      instrument("DOSSIER"),
      instrument("CATALOG"),
      instrument("DATABASE"),
    ];
    const html = render(Component);
    assert.deepEqual(requests[0], {
      resource: "researchInstruments",
      query: { type },
    });
    assert.ok(html.includes(`Instrumento ${type} da API`));
    assert.ok(
      html.includes(
        `href="${researchInstrumentPath(type, `registro-${type.toLowerCase()}`)}"`,
      ),
    );
    assert.ok(!html.includes("undefined"));
    assert.ok(!html.includes("null — null"));
    assert.ok(!html.includes("Dossiês Escravidão"));
    for (const other of ["DOSSIER", "CATALOG", "DATABASE"])
      if (other !== type)
        assert.ok(!html.includes(`Instrumento ${other} da API`));
  }
  assert.equal(researchInstrumentPeriod(null, null), "");
  assert.equal(researchInstrumentPeriod(2020, 2020), "2020");
  assert.equal(researchInstrumentPeriod(2020, null), "A partir de 2020");
  assert.equal(researchInstrumentPeriod(null, 2025), "Até 2025");
});

test("instrument details show API content, people and PDF, and handle external-only and absent materials", () => {
  reset();
  records.researchInstruments = instrument("DOSSIER", {
    startYear: 1998,
    endYear: 2023,
    people: [person("p", "Responsável cadastrado")],
    pdfUrl: "https://example.org/arquivo-api.pdf",
  });
  let html = render(ResearchInstrumentDetails, { type: "DOSSIER" });
  assert.ok(html.includes("1998 — 2023"));
  assert.ok(html.includes("Responsável cadastrado"));
  assert.ok(html.includes("Conteúdo do cadastro"));
  assert.ok(html.includes('href="https://example.org/arquivo-api.pdf"'));
  assert.equal(requests[0].identifier, "registro-real");
  records.researchInstruments = instrument("CATALOG", {
    externalUrl: "https://example.org/catalogo",
  });
  html = render(ResearchInstrumentDetails, { type: "CATALOG" });
  assert.ok(html.includes('href="https://example.org/catalogo"'));
  assert.ok(!html.includes("data-pdf-viewer"));
  records.researchInstruments = instrument("DATABASE");
  assert.match(
    render(ResearchInstrumentDetails),
    /Nenhum arquivo ou link disponível/,
  );
  assert.match(
    render(ResearchInstrumentDetails, { type: "DOSSIER" }),
    /role="alert"/,
  );
});

test("the research center uses registered content, people and galleries without fixed names", () => {
  reset();
  lists.research = [
    {
      id: "r",
      slug: "nucleo-costas-negras",
      title: "Núcleo Em costas negras",
      content: "Texto real do núcleo",
      people: [
        person("researcher", "Pesquisadora cadastrada"),
        person("student", "Discente cadastrado", { category: "DISCENTE" }),
      ],
      images: [
        {
          id: "photo",
          imageUrl: "https://example.org/foto.jpg",
          title: "Foto real",
        },
      ],
      supports: [
        {
          id: "support",
          imageUrl: "https://example.org/apoio.jpg",
          title: "Apoio real",
        },
      ],
    },
  ];
  const html = render(ResearchCenter);
  for (const value of [
    "Texto real do núcleo",
    "Pesquisadora cadastrada",
    "Discente cadastrado",
    "Foto real",
    "Apoio real",
  ])
    assert.ok(html.includes(value), value);
  assert.ok(!html.includes("Mariana de Oliveira Lima"));
  assert.ok(!html.includes("Rafaela Cia Vieira"));
});

test("the group page uses only API videos, titles and associated people", () => {
  reset();
  lists.videos = [
    {
      id: "v",
      title: "Vídeo cadastrado",
      embedLink: "https://www.youtube.com/embed/video-api",
      description: "Descrição cadastrada",
      people: [person("p", "Pessoa do vídeo")],
    },
  ];
  const html = render(Group);
  for (const value of [
    "Vídeo cadastrado",
    "Descrição cadastrada",
    "Pessoa do vídeo",
    "https://www.youtube.com/embed/video-api",
  ])
    assert.ok(html.includes(value), value);
  assert.ok(!html.includes("UqRGZf3lhIQ"));
});

test("the institutional video appears after the introduction and only the other API videos enter the carousel", () => {
  reset();
  lists.videos = [
    {
      id: "research-first",
      title: "Primeira pesquisa cadastrada",
      embedLink: "https://www.youtube.com/embed/primeira-pesquisa",
      people: [],
    },
    {
      id: "group",
      title: "  GRUPO Leviatã e o Cativeiro  ",
      embedLink: "https://www.youtube.com/embed/apresentacao-api",
      description: "Apresentação institucional cadastrada",
      people: [person("prof", "Professor do grupo")],
    },
    {
      id: "research-last",
      title: "Outra pesquisa cadastrada",
      embedLink: "https://www.youtube.com/embed/outra-pesquisa",
      people: [],
    },
  ];
  const html = render(Group);
  const intro = html.indexOf("Criado em 2019");
  const presentation = html.indexOf(
    'src="https://www.youtube.com/embed/apresentacao-api"',
  );
  const carousel = html.indexOf('aria-label="Outros vídeos do grupo"');
  assert.ok(intro < presentation && presentation < carousel);
  assert.ok(html.includes("Professor do grupo"));
  assert.ok(html.includes("Apresentação institucional cadastrada"));
  assert.equal(
    (
      html.match(/src="https:\/\/www.youtube.com\/embed\/apresentacao-api"/g) ||
      []
    ).length,
    1,
  );
  const carouselHtml = html.slice(carousel);
  assert.ok(carouselHtml.includes("swiper-wrapper"));
  assert.ok(carouselHtml.includes("Primeira pesquisa cadastrada"));
  assert.ok(carouselHtml.includes("Outra pesquisa cadastrada"));
  assert.ok(!carouselHtml.includes("apresentacao-api"));
});

test("a group with only its institutional video does not render an empty carousel", () => {
  reset();
  lists.videos = [
    {
      id: "group",
      title: "Grupo Leviata e o Cativeiro",
      embedLink: "https://www.youtube.com/embed/apresentacao-api",
      people: [],
    },
  ];
  const html = render(Group);
  assert.ok(
    html.includes('src="https://www.youtube.com/embed/apresentacao-api"'),
  );
  assert.ok(!html.includes("swiper-wrapper"));
  assert.ok(!html.includes('aria-label="Outros vídeos do grupo"'));
});

test("thematic videos share the group presentation and carousel while preserving contextual people, titles and descriptions", () => {
  reset();
  const genericVideo = {
    id: "generic-video",
    title: "Título genérico do vídeo",
    description: "Descrição genérica do vídeo",
    embedLink: "https://www.youtube.com/embed/pesquisa-tematica",
    people: [person("generic-person", "Pessoa genérica do vídeo")],
  };
  thematicRecord = {
    title: "Temática cadastrada",
    description: "Texto da linha temática",
    coordinator: person("coordinator", "Coordenadora da temática"),
    mainVideo: {
      ...genericVideo,
      id: "main-video",
      title: "Título do vídeo principal",
      description: "Descrição do vídeo principal",
      embedLink: "https://www.youtube.com/embed/apresentacao-tematica",
    },
    additionalVideos: [
      {
        id: "context-one",
        title: "Título contextual da pesquisa",
        description: "Descrição contextual da pesquisa",
        person: person("context-person", "Apresentadora da pesquisa"),
        video: genericVideo,
      },
      {
        id: "context-two",
        title: "Pesquisa sem apresentador ou descrição",
        description: null,
        person: null,
        video: {
          ...genericVideo,
          id: "another-video",
          embedLink: "https://www.youtube.com/embed/outra-pesquisa-tematica",
        },
      },
    ],
  };
  const html = render(ThematicDetails);
  const mainVideo = html.indexOf(
    'src="https://www.youtube.com/embed/apresentacao-tematica"',
  );
  const description = html.indexOf("Descrição do vídeo principal");
  const divider = html.indexOf("✠");
  const carousel = html.indexOf('aria-label="Pesquisas vinculadas"');
  assert.doesNotMatch(html, /<h2\b[^>]*>Título do vídeo principal<\/h2>/);
  assert.ok(html.includes("Apresentado por Coordenadora da temática"));
  assert.ok(
    mainVideo < description && description < divider && divider < carousel,
  );
  const carouselHtml = html.slice(carousel);
  assert.ok(carouselHtml.includes("swiper-wrapper"));
  assert.ok(carouselHtml.includes("Título contextual da pesquisa"));
  assert.ok(carouselHtml.includes("Apresentado por Apresentadora da pesquisa"));
  assert.ok(carouselHtml.includes("Descrição contextual da pesquisa"));
  assert.ok(carouselHtml.includes("Pesquisa sem apresentador ou descrição"));
  assert.ok(!html.includes("Pessoa genérica do vídeo"));
  assert.ok(!html.includes("Título genérico do vídeo"));
  assert.ok(!html.includes("Descrição genérica do vídeo"));
});

test("thematic details support additional videos without a main video and omit empty video sections", () => {
  reset();
  thematicRecord = {
    title: "Temática sem apresentação principal",
    mainVideo: null,
    coordinator: null,
    additionalVideos: [
      {
        id: "context-only",
        title: "Pesquisa vinculada",
        description: null,
        person: null,
        video: {
          id: "video-only",
          embedLink: "https://www.youtube.com/embed/pesquisa-vinculada",
        },
      },
    ],
  };
  const html = render(ThematicDetails);
  assert.ok(html.includes("swiper-wrapper"));
  assert.ok(html.includes("Pesquisa vinculada"));
  assert.ok(!html.includes("✠"));
  assert.ok(!html.includes("Apresentado por"));
  thematicRecord.additionalVideos = [];
  const emptyHtml = render(ThematicDetails);
  assert.ok(emptyHtml.includes("Temática sem apresentação principal"));
  assert.ok(!emptyHtml.includes("swiper-wrapper"));
  assert.ok(!emptyHtml.includes("Pesquisas vinculadas"));
});

test("gallery details expose researchers, speakers, jury roles and board participants", () => {
  for (const [resource, relations] of [
    ["research", { people: [person("r", "Pesquisadora da pesquisa")] }],
    ["meetings", { speakers: [person("s", "Palestrante do encontro")] }],
    [
      "juries",
      {
        judges: [person("j", "Juíza do júri")],
        jurors: [person("juror", "Pessoa jurada")],
        prosecutors: [person("p", "Acusação cadastrada")],
        defenders: [person("d", "Defesa cadastrada")],
        bailiffs: [person("b", "Oficial cadastrado")],
      },
    ],
    [
      "boards",
      {
        candidate: person("c", "Pessoa candidata"),
        advisor: person("a", "Pessoa orientadora"),
        members: [person("m", "Integrante cadastrado")],
      },
    ],
  ]) {
    reset();
    records[resource] = {
      title: "Detalhe da API",
      date: "2026-10-22T00:00:00Z",
      images: [],
      ...relations,
    };
    const html = render(GalleryDetails, { resource, label: "o registro" });
    for (const value of Object.values(relations).flat())
      assert.ok(html.includes(value.name), value.name);
    if (resource !== "research") assert.ok(html.includes("22/10/2026"));
  }
});

test("internal news have a real detail view and valid related destinations", () => {
  reset();
  const uuid = "68c2af74-c459-4a33-8d98-d4a62d2152c9";
  records.news = {
    title: "Notícia cadastrada",
    date: "2026-10-22",
    description: "Texto completo da notícia",
    category: "RESEARCH",
    isInternal: true,
    relatedType: "RESEARCH_INSTRUMENT",
    relatedId: uuid,
    externalUrl: "https://example.org/fonte",
  };
  const html = render(NewsDetails);
  assert.ok(html.includes("Texto completo da notícia"));
  assert.ok(html.includes('href="https://example.org/fonte"'));
  assert.ok(html.includes(`href="/instrumentos/registro/${uuid}"`));
  const source = ts.createSourceFile(
    "routes.tsx",
    readFileSync(resolve(__dirname, "../src/routes/index.routes.tsx"), "utf8"),
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
  for (const type of [
    "BOARD",
    "JURY",
    "MEETING",
    "PUBLICATION",
    "RESEARCH_INSTRUMENT",
    "THEMATIC",
  ])
    assert.ok(
      paths.some((path) => matchPath(path, newsRelatedPath(type, uuid))),
      type,
    );
  assert.equal(newsRelatedPath("MEETING", "MEETING"), null);
  assert.equal(newsRelatedPath("PUBLICATION", ""), null);
});

test("home and news lists render records beyond the former ten-item API default", () => {
  reset();
  lists.books = Array.from({ length: 15 }, (_, index) => ({
    id: `book-${index}`,
    title: `Livro ${index}`,
    authors: [],
    year: 2026 - index,
  }));
  lists.news = Array.from({ length: 15 }, (_, index) => ({
    id: `news-${index}`,
    slug: `news-${index}`,
    title: `Notícia ${index}`,
    date: "2026-10-22",
    isInternal: true,
    description: "Descrição da API",
  }));
  const home = render(Home);
  assert.ok(home.includes("Livro 14"));
  assert.ok(home.includes("Notícia 14"));
  assert.ok(render(News).includes("Notícia 14"));
  assert.ok(
    requests.some(
      (item) =>
        item.resource === "books" &&
        item.query.sortBy === "year" &&
        item.query.sortOrder === "desc",
    ),
  );
  assert.ok(
    requests.some(
      (item) =>
        item.resource === "news" &&
        item.query.sortBy === "date" &&
        item.query.sortOrder === "desc",
    ),
  );
});

test("publication tabs retain descending years, put missing years last and keep types separate", () => {
  reset();
  lists.articles = [
    {
      id: "a1",
      title: "Artigo sem ano",
      type: "ARTICLE",
      year: null,
      authors: [],
    },
    {
      id: "d1",
      title: "Dossiê antigo",
      type: "DOSSIER",
      year: 2020,
      authors: [],
    },
    {
      id: "a2",
      title: "Artigo recente",
      type: "ARTICLE",
      year: 2026,
      authors: [],
    },
    {
      id: "d2",
      title: "Dossiê recente",
      type: "DOSSIER",
      year: 2025,
      authors: [],
    },
  ];
  activeTab = "articles";
  let html = render(Publications);
  assert.ok(html.indexOf("Artigo recente") < html.indexOf("Artigo sem ano"));
  assert.ok(!html.includes("Dossiê antigo"));
  activeTab = "dossiers";
  html = render(Publications);
  assert.ok(html.indexOf("Dossiê recente") < html.indexOf("Dossiê antigo"));
  assert.ok(!html.includes("Artigo recente"));
});

test("the researchers page hides inactive national and international people while preserving display order", () => {
  reset();
  lists.people = [
    person("b", "Primeira ativa", {
      nationality: { code: "BR" },
      isActive: true,
    }),
    person("hidden-br", "Inativa brasileira", {
      nationality: { code: "BR" },
      isActive: false,
    }),
    person("a", "Segunda ativa", {
      nationality: { code: "BR" },
      isActive: true,
    }),
    person("pt", "Pessoa internacional ativa", {
      nationality: { code: "PT" },
      isActive: true,
    }),
    person("hidden-pt", "Inativa internacional", {
      nationality: { code: "PT" },
      isActive: false,
    }),
  ];
  const html = render(Researchers);
  assert.ok(html.indexOf("Primeira ativa") < html.indexOf("Segunda ativa"));
  assert.ok(html.includes("Pessoa internacional ativa"));
  assert.ok(!html.includes("Inativa brasileira"));
  assert.ok(!html.includes("Inativa internacional"));
  assert.equal(requests[0].query.isActive, "true");
  assert.equal(requests[0].query.sortBy, "displayOrder");
});

test("API-only pages provide empty, loading and error states without fixed documents or people", () => {
  reset();
  for (const Component of [
    Catalogs,
    Database,
    BibliographicSpreadsheets,
    ResearchCenter,
    Group,
    News,
  ])
    assert.match(render(Component), /Nenhum registro disponível/);
  state = { loading: true };
  assert.match(render(Catalogs), /role="status"/);
  state = { error: true };
  assert.match(render(Catalogs), /role="alert"/);
  assert.match(render(ResearchInstrumentDetails), /role="alert"/);
});
