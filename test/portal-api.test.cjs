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
const {
  MeetingsAndSeminars,
} = require("../src/pages/MeetingsAndSeminars/index.tsx");
const { Seminars } = require("../src/pages/Seminars/index.tsx");
const { MeetingAgenda } = require("../src/pages/MeetingAgenda/index.tsx");
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
const { MeetingView } = load(
  "../src/admin/pages/AdminMeetings/View/index.tsx",
  {
    react: { ...React, useState: () => [records.meetings || null, () => {}] },
  },
);
const { NewsView } = load("../src/admin/pages/AdminNews/View/index.tsx", {
  react: {
    ...React,
    useState: (initial) => [
      initial === null
        ? records.news || null
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
  assert.ok(
    html.indexOf("Pesquisadora cadastrada") < html.indexOf("Discentes"),
  );
  assert.ok(html.indexOf("Discentes") < html.indexOf("Discente cadastrado"));
  assert.ok(!html.includes("Dra."));
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
    if (resource === "meetings") {
      assert.ok(html.includes('aria-label="Ano: 2026"'));
      assert.ok(!html.includes("22/10/2026"));
    } else if (resource !== "research") assert.ok(html.includes("22/10/2026"));
  }
});

test("meeting speakers and research participants use profile details without biographies", () => {
  reset();
  const speaker = person("speaker", "Maria Palestrante", {
    honorificTitle: "Profa.",
    academicTitle: { abbreviation: "Dra.", name: "Doutora" },
    institution: { name: "Universidade cadastrada", acronym: "UC" },
    imageUrl: "https://example.org/palestrante.jpg",
    bio: "Biografia longa que não deve aparecer no encontro.",
    lattesUrl: "https://example.org/lattes",
    website: "https://example.org/site",
    linkedinUrl: "https://example.org/linkedin",
    orcid: "0000-0001-2345-678X",
  });
  records.meetings = {
    title: "Encontro cadastrado",
    images: [],
    speakers: [speaker, { id: "second", name: "João Palestrante" }],
  };
  const html = render(GalleryDetails, {
    resource: "meetings",
    label: "o encontro",
  });
  for (const value of [
    "Palestrantes",
    "Maria Palestrante",
    "João Palestrante",
    "Profa.",
    "Dra.",
    "Doutora",
    "Universidade cadastrada",
    "Pesquisador",
  ])
    assert.ok(html.includes(value), value);
  assert.ok(html.includes('src="https://example.org/palestrante.jpg"'));
  for (const field of ["lattesUrl", "website", "linkedinUrl"])
    assert.ok(html.includes(`href="${speaker[field]}"`), field);
  assert.ok(html.includes('href="https://orcid.org/0000-0001-2345-678X"'));
  assert.ok(!html.includes(speaker.bio));
  assert.ok(!html.includes("Ver biografia"));
  assert.ok(
    html.indexOf("Maria Palestrante") < html.indexOf("João Palestrante"),
  );
  records.research = {
    title: "Pesquisa cadastrada",
    images: [],
    people: [speaker],
  };
  const researchHtml = render(GalleryDetails, {
    resource: "research",
    label: "a pesquisa",
  });
  for (const value of [
    "Pesquisadores",
    "Maria Palestrante",
    "Doutora",
    "Universidade cadastrada",
  ])
    assert.ok(researchHtml.includes(value), value);
  for (const field of ["lattesUrl", "website", "linkedinUrl"])
    assert.ok(researchHtml.includes(`href="${speaker[field]}"`), field);
  assert.ok(!researchHtml.includes(speaker.bio));
  assert.ok(!researchHtml.includes("Ver biografia"));
  assert.ok(!researchHtml.includes("Dra."));
  assert.ok(researchHtml.includes("Profa."));
});

test("research details separate students below researchers using the same compact profiles", () => {
  reset();
  const student = person("student", "Ana Estudante", {
    category: "DISCENTE",
    bio: "Resumo que não aparece neste perfil compacto",
    academicTitle: { abbreviation: "Grad.", name: "Graduanda" },
    institution: { name: "Universidade da pesquisa", acronym: "UP" },
    lattesUrl: "https://example.org/lattes-discente",
  });
  records.research = {
    title: "Núcleo cadastrado",
    images: [],
    people: [
      student,
      person("researcher", "Maria Pesquisadora"),
      person("student-2", "João Estudante", { category: "DISCENTE" }),
    ],
  };
  const html = render(GalleryDetails, {
    resource: "research",
    label: "a pesquisa",
  });
  assert.ok(html.indexOf("Pesquisadores") < html.indexOf("Maria Pesquisadora"));
  assert.ok(html.indexOf("Maria Pesquisadora") < html.indexOf("Discentes"));
  assert.ok(html.indexOf("Discentes") < html.indexOf("Ana Estudante"));
  assert.ok(html.indexOf("Ana Estudante") < html.indexOf("João Estudante"));
  assert.ok(html.includes("Graduanda"));
  assert.ok(!html.includes("Grad."));
  assert.ok(!html.includes("Dra."));
  assert.ok(html.includes("Universidade da pesquisa"));
  assert.ok(html.includes('href="https://example.org/lattes-discente"'));
  assert.ok(!html.includes(student.bio));
  assert.ok(!html.includes("Ver biografia"));

  records.research.people = [student];
  const onlyStudents = render(GalleryDetails, {
    resource: "research",
    label: "a pesquisa",
  });
  assert.ok(onlyStudents.includes("Discentes"));
  assert.ok(!onlyStudents.includes("Pesquisadores"));
  records.research.people = [person("researcher", "Maria Pesquisadora")];
  assert.ok(
    !render(GalleryDetails, {
      resource: "research",
      label: "a pesquisa",
    }).includes("Discentes"),
  );
});

test("gallery photos show optional API captions below their images without empty caption cards", () => {
  reset();
  records.meetings = {
    title: "Encontro com fotos",
    speakers: [],
    images: [
      {
        id: "captioned",
        imageUrl: "https://example.org/foto-legendada.jpg",
        title: "Registro do encontro",
        description: "Legenda do encontro cadastrada",
      },
      {
        id: "uncaptioned",
        imageUrl: "https://example.org/foto-sem-legenda.jpg",
        title: null,
        description: null,
      },
      {
        id: "blank-caption",
        imageUrl: "https://example.org/foto-legenda-vazia.jpg",
        title: " ",
        description: "\n ",
      },
    ],
  };
  const html = render(GalleryDetails, {
    resource: "meetings",
    label: "o encontro",
  });
  assert.equal((html.match(/<figure\b/g) || []).length, 3);
  assert.equal((html.match(/<figcaption\b/g) || []).length, 1);
  assert.ok(
    html.indexOf('src="https://example.org/foto-legendada.jpg"') <
      html.indexOf("Legenda do encontro cadastrada"),
  );
  assert.ok(html.includes("Registro do encontro"));
  assert.ok(html.includes('src="https://example.org/foto-sem-legenda.jpg"'));
  assert.ok(html.includes('src="https://example.org/foto-legenda-vazia.jpg"'));
});

test("meeting access links are visible before speakers and only available URLs become actions", () => {
  reset();
  records.meetings = {
    title: "Encontro com materiais",
    speakers: [person("p", "Palestrante cadastrado")],
    images: [],
    registrationUrl: "https://example.org/inscricoes",
    recordingUrl: "https://example.org/conteudo",
    meetingUrl: "https://example.org/transmissao",
  };
  const html = render(GalleryDetails, {
    resource: "meetings",
    label: "o encontro",
  });
  assert.ok(html.indexOf("Acessos e materiais") < html.indexOf("Palestrantes"));
  for (const [field, label] of [
    ["registrationUrl", "Inscrições"],
    ["recordingUrl", "Acessar conteúdo"],
    ["meetingUrl", "Acessar transmissão"],
  ]) {
    assert.ok(
      html.includes(
        `href="${records.meetings[field]}" target="_blank" rel="noopener noreferrer"`,
      ),
      field,
    );
    assert.ok(html.includes(label), label);
  }
  records.meetings.registrationUrl = null;
  records.meetings.recordingUrl = "";
  records.meetings.meetingUrl = "javascript:alert(1)";
  const empty = render(GalleryDetails, {
    resource: "meetings",
    label: "o encontro",
  });
  assert.ok(!empty.includes("Acessos e materiais"));
  assert.ok(!empty.includes("javascript:"));
  records.meetings.recordingUrl = "https://example.org/conteudo";
  const oneLink = render(GalleryDetails, {
    resource: "meetings",
    label: "o encontro",
  });
  assert.ok(oneLink.includes("Acessar conteúdo"));
  assert.ok(!oneLink.includes("Acessar transmissão"));
});

test("the admin meeting view pairs each link with its saved field and omits absent destinations", () => {
  reset();
  records.meetings = {
    title: "Encontro cadastrado",
    slug: "encontro-cadastrado",
    date: "2026-10-23",
    type: "MEETING",
    speakers: [],
    images: [],
    registrationUrl: "https://example.org/inscricao",
    recordingUrl: "https://example.org/conteudo",
    meetingUrl: "https://example.org/transmissao",
  };
  const html = render(MeetingView);
  for (const [field, label] of [
    ["registrationUrl", "Link de inscrições"],
    ["recordingUrl", "Link do conteúdo"],
    ["meetingUrl", "Link da transmissão"],
  ]) {
    const value = html.indexOf(
      `href="${records.meetings[field]}"`,
      html.indexOf(label),
    );
    assert.ok(value > html.indexOf(label), label);
    assert.ok(
      html.includes(
        `href="${records.meetings[field]}" target="_blank" rel="noopener noreferrer"`,
      ),
      field,
    );
  }
  records.meetings.registrationUrl = null;
  records.meetings.recordingUrl = null;
  records.meetings.meetingUrl = null;
  const empty = render(MeetingView);
  assert.ok(!empty.includes('target="_blank"'));
  assert.ok(!empty.includes('href="#"'));
  assert.ok(!empty.includes('href="null"'));
});

test("portal meeting cards and seminar timelines only list internal events", () => {
  reset();
  const meeting = (id, type, isInternal) => ({
    id,
    slug: id,
    title: `Evento ${id}`,
    date: "2026-01-01T00:00:00Z",
    speakers: [],
    type,
    isInternal,
  });
  lists.meetings = [
    meeting("encontro-interno", "MEETING", true),
    meeting("seminario-interno", "SEMINAR", true),
    meeting("encontro-externo", "MEETING", false),
    meeting("seminario-externo", "SEMINAR", false),
  ];
  const cards = render(MeetingsAndSeminars);
  assert.ok(cards.includes("Evento encontro-interno"));
  assert.ok(cards.includes("Evento seminario-interno"));
  assert.ok(!cards.includes("Evento encontro-externo"));
  assert.ok(!cards.includes("Evento seminario-externo"));
  const timeline = render(Seminars);
  assert.ok(timeline.includes("Evento seminario-interno"));
  assert.ok(!timeline.includes("Evento encontro-interno"));
  assert.ok(!timeline.includes("Evento seminario-externo"));
  assert.deepEqual(requests, [
    {
      resource: "meetings",
      query: {
        type: undefined,
        isInternal: "true",
        sortBy: "date",
        sortOrder: "desc",
      },
    },
    { resource: "meetings", query: { type: "SEMINAR", isInternal: "true" } },
  ]);

  lists.meetings = lists.meetings.filter((event) => !event.isInternal);
  assert.ok(
    render(MeetingsAndSeminars).includes("Nenhum encontro disponível."),
  );
  assert.ok(!render(Seminars).includes("Evento seminario-externo"));
});

test("each event category has its own cards and agenda without mixing types or external records", () => {
  const types = [
    ["MEETING", "encontros", "Próximos encontros", "Encontros realizados"],
    ["SEMINAR", "seminarios", "Próximos seminários", "Seminários realizados"],
    [
      "DOCUMENTARY",
      "mostra-de-documentarios",
      "Próximas mostras",
      "Mostras realizadas",
    ],
  ];
  for (const [type, path, upcomingTitle, pastTitle] of types) {
    reset();
    lists.meetings = types.flatMap(([eventType]) => [
      {
        id: `${eventType}-past`,
        slug: `${eventType}-past`,
        title: `Registro ${eventType} passado`,
        type: eventType,
        isInternal: true,
        date: "2000-01-01",
        speakers: [],
      },
      {
        id: `${eventType}-upcoming`,
        slug: `${eventType}-upcoming`,
        title: `Registro ${eventType} futuro`,
        type: eventType,
        isInternal: true,
        date: "2099-01-01",
        speakers: [],
      },
      {
        id: `${eventType}-external`,
        title: `Registro ${eventType} externo`,
        type: eventType,
        isInternal: false,
        date: "2099-01-01",
        speakers: [],
      },
    ]);
    const cards = render(MeetingsAndSeminars, { type });
    const timeline = render(MeetingAgenda, { type });
    for (const html of [cards, timeline]) {
      assert.ok(html.includes(`Registro ${type} passado`));
      assert.ok(html.includes(`Registro ${type} futuro`));
      assert.ok(html.includes(`href="/atividades/${path}/${type}-past"`));
      assert.ok(!html.includes(`Registro ${type} externo`));
      for (const [other] of types.filter(([other]) => other !== type))
        assert.ok(!html.includes(`Registro ${other}`));
    }
    assert.ok(timeline.includes(upcomingTitle));
    assert.ok(timeline.includes(pastTitle));
    assert.deepEqual(requests, [
      {
        resource: "meetings",
        query: { type, isInternal: "true", sortBy: "date", sortOrder: "desc" },
      },
      { resource: "meetings", query: { type, isInternal: "true" } },
    ]);
    lists.meetings = [];
    assert.ok(!render(MeetingsAndSeminars, { type }).includes("Registro "));
    assert.ok(!render(MeetingAgenda, { type }).includes("Registro "));
  }
});

test("external meetings remain accessible through linked news and their detail pages", () => {
  reset();
  const id = "68c2af74-c459-4a33-8d98-d4a62d2152c9";
  const destination = `/atividades/encontros-e-seminarios/encontro/${id}`;
  lists.news = [
    {
      id: "news-id",
      title: "Divulgação do evento externo",
      slug: "noticia-evento-externo",
      date: "2026-10-23",
      category: "EVENT",
      description: "Conheça este evento",
      isInternal: true,
      relatedType: "MEETING",
      relatedId: id,
    },
  ];
  assert.ok(render(News).includes('href="/noticias/noticia-evento-externo"'));
  records.news = lists.news[0];
  assert.ok(render(NewsDetails).includes(`href="${destination}"`));
  records.meetings = {
    id,
    title: "Evento externo vinculado",
    isInternal: false,
    date: "2026-10-23",
    description: "Descrição do encontro externo",
    images: [],
    speakers: [],
    registrationUrl: "https://example.org/inscricoes",
  };
  const details = render(
    GalleryDetails,
    { resource: "meetings", label: "o encontro" },
    id,
  );
  assert.ok(details.includes("Evento externo vinculado"));
  assert.ok(details.includes("Descrição do encontro externo"));
  assert.ok(details.includes('href="https://example.org/inscricoes"'));
  assert.ok(render(MeetingView).includes("Externo — acesso pelas notícias"));
  records.meetings.isInternal = true;
  assert.ok(render(MeetingView).includes("Interno — exibido nas listas"));
});

test("news gallery captions appear in portal and admin views, and photo cards open the news page", () => {
  reset();
  records.news = {
    id: "news-id",
    slug: "noticia-com-fotos",
    title: "Notícia com fotos cadastradas",
    date: "2026-10-23",
    category: "EVENT",
    isInternal: true,
    relatedType: "MEETING",
    relatedId: "550e8400-e29b-41d4-a716-446655440000",
    externalUrl: "https://example.org/fonte",
    description: "Texto da notícia",
    images: [
      {
        id: "photo-1",
        imageUrl: "https://example.org/foto-1.jpg",
        title: "Mesa de debate",
        description: "Participantes reunidos no evento.",
      },
      {
        id: "photo-2",
        imageUrl: "https://example.org/foto-2.jpg",
        title: null,
        description: null,
      },
    ],
  };
  for (const Component of [NewsDetails, NewsView]) {
    const html = render(Component);
    assert.ok(html.includes("Fotos"));
    assert.ok(html.includes("swiper-wrapper"));
    assert.ok(html.includes('src="https://example.org/foto-1.jpg"'));
    assert.ok(html.includes('src="https://example.org/foto-2.jpg"'));
    assert.ok(
      html.indexOf('src="https://example.org/foto-1.jpg"') <
        html.indexOf("Mesa de debate</"),
    );
    assert.ok(html.includes("Participantes reunidos no evento."));
  }
  const details = render(NewsDetails);
  assert.ok(details.includes('href="https://example.org/fonte"'));
  assert.ok(
    details.includes(
      'href="/atividades/encontros-e-seminarios/encontro/550e8400-e29b-41d4-a716-446655440000"',
    ),
  );
  for (const isInternal of [true, false]) {
    lists.news = [{ ...records.news, isInternal }];
    for (const Component of [News, Home]) {
      const html = render(Component);
      assert.ok(html.includes('href="/noticias/noticia-com-fotos"'));
      assert.ok(!html.includes('href="https://example.org/fonte"'));
    }
  }
  records.news.images = [];
  assert.ok(!render(NewsDetails).includes("swiper-wrapper"));
  assert.ok(render(NewsView).includes("Nenhuma imagem adicionada."));
});

test("internal news have a real detail view and valid related destinations", () => {
  reset();
  const uuid = "68c2af74-c459-4a33-8d98-d4a62d2152c9";
  records.news = {
    title: "Notícia cadastrada",
    date: "2026-10-22",
    coverUrl: "https://example.org/noticia.jpg",
    description: "Texto completo da notícia",
    category: "RESEARCH",
    isInternal: true,
    relatedType: "RESEARCH_INSTRUMENT",
    relatedId: uuid,
    externalUrl: "https://example.org/fonte",
  };
  const html = render(NewsDetails);
  assert.ok(html.includes("Texto completo da notícia"));
  assert.ok(html.includes('aria-label="Ano: 2026"'));
  assert.ok(!html.includes("22 de outubro de 2026"));
  assert.ok(html.includes('src="https://example.org/noticia.jpg"'));
  assert.equal((html.match(/❧/g) || []).length, 2);
  assert.ok(html.includes("Acessos e materiais"));
  assert.ok(html.includes("<span>Acessar fonte original</span>"));
  assert.ok(
    html.includes(
      'href="https://example.org/fonte" target="_blank" rel="noopener noreferrer"',
    ),
  );
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
    "PRESENTED_WORK",
    "RESEARCH",
    "RESEARCH_INSTRUMENT",
    "THEMATIC",
  ])
    assert.ok(
      paths.some((path) =>
        matchPath(
          path,
          new URL(newsRelatedPath(type, uuid), "https://portal.example")
            .pathname,
        ),
      ),
      type,
    );
  assert.equal(newsRelatedPath("MEETING", "MEETING"), null);
  assert.equal(newsRelatedPath("PUBLICATION", ""), null);
});

test("all news cards open their own portal details, where internal and external access links remain available", () => {
  reset();
  const uuid = "550e8400-e29b-41d4-a716-446655440000";
  for (const type of [
    "BOARD",
    "JURY",
    "MEETING",
    "PUBLICATION",
    "PRESENTED_WORK",
    "RESEARCH",
    "RESEARCH_INSTRUMENT",
    "THEMATIC",
  ]) {
    lists.news = [
      {
        id: "internal-news",
        title: "Notícia interna",
        slug: "noticia-interna",
        date: "2026-10-23",
        isInternal: true,
        externalUrl: null,
        description: "Notícia sobre um cadastro do portal",
        relatedType: type,
        relatedId: uuid,
      },
    ];
    for (const Component of [News, Home]) {
      const html = render(Component);
      assert.ok(html.includes('href="/noticias/noticia-interna"'));
      assert.ok(!html.includes(`href="${newsRelatedPath(type, uuid)}"`), type);
      assert.ok(!html.includes('target="_blank"'));
    }
    records.news = lists.news[0];
    assert.ok(
      render(NewsDetails).includes(`href="${newsRelatedPath(type, uuid)}"`),
      type,
    );
  }
  lists.news[0].relatedId = "registro-antigo-invalido";
  assert.ok(render(News).includes('href="/noticias/noticia-interna"'));
  lists.news[0].isInternal = false;
  lists.news[0].externalUrl = "https://example.org/noticia";
  for (const Component of [News, Home]) {
    const external = render(Component);
    assert.ok(external.includes('href="/noticias/noticia-interna"'));
    assert.ok(!external.includes('href="https://example.org/noticia"'));
    assert.ok(!external.includes('target="_blank"'));
  }
  records.news = lists.news[0];
  assert.ok(
    render(NewsDetails).includes(
      'href="https://example.org/noticia" target="_blank" rel="noopener noreferrer"',
    ),
  );
  lists.news[0].externalUrl = null;
  assert.ok(render(News).includes('href="/noticias/noticia-interna"'));
});

test("publication news opens the matching category and selected book, article or dossier", () => {
  const bookId = "550e8400-e29b-41d4-a716-446655440000";
  const articleId = "550e8400-e29b-41d4-a716-446655440001";
  const dossierId = "550e8400-e29b-41d4-a716-446655440002";
  for (const [id, type, title] of [
    [bookId, "books", "Livro vinculado"],
    [articleId, "articles", "Artigo vinculado"],
    [dossierId, "dossiers", "Dossiê vinculado"],
  ]) {
    reset();
    activeTab = null;
    lists.books = [
      { id: "other-book", title: "Outro livro", year: 2026, authors: [] },
      { id: bookId, title: "Livro vinculado", year: 2024, authors: [] },
    ];
    lists.articles = [
      {
        id: articleId,
        title: "Artigo vinculado",
        year: 2025,
        type: "ARTICLE",
        authors: [],
      },
      {
        id: dossierId,
        title: "Dossiê vinculado",
        year: 2023,
        type: "DOSSIER",
        authors: [],
      },
    ];
    const html = render(Publications, {}, `publicacoes?publicacao=${id}`);
    assert.ok(html.includes(title));
    assert.match(
      html,
      new RegExp(`id="[^"]*-tab-${type}"[^>]*aria-selected="true"`),
    );
    assert.ok(html.includes('aria-current="true"'));
    assert.ok(!html.includes("não está mais disponível"));
  }
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

test("the researchers page hides students and inactive people of every nationality while preserving display order", () => {
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
    person("student-br", "Discente brasileira", {
      nationality: { code: "BR" },
      isActive: true,
      category: "DISCENTE",
    }),
    person("student-pt", "Discente internacional", {
      nationality: { code: "PT" },
      isActive: true,
      category: "DISCENTE",
    }),
  ];
  const html = render(Researchers);
  assert.ok(html.indexOf("Primeira ativa") < html.indexOf("Segunda ativa"));
  assert.ok(html.includes("Pessoa internacional ativa"));
  assert.ok(!html.includes("Inativa brasileira"));
  assert.ok(!html.includes("Inativa internacional"));
  assert.ok(!html.includes("Discente brasileira"));
  assert.ok(!html.includes("Discente internacional"));
  assert.equal(requests[0].query.isActive, "true");
  assert.equal(requests[0].query.sortBy, "displayOrder");
  lists.people = lists.people.filter(
    (person) => person.category === "DISCENTE",
  );
  assert.ok(render(Researchers).includes("Nenhum registro disponível"));
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
