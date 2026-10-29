const { test, after } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve, dirname } = require("node:path");
const { Module } = require("node:module");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { ThemeProvider } = require("styled-components");

function compile(source, filename) {
  return ts.transpileModule(
    source.replaceAll(
      "import.meta.env",
      '({ VITE_ANALYTICS_ENABLED: "true" })',
    ),
    {
      fileName: filename,
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
        target: ts.ScriptTarget.ES2022,
      },
    },
  ).outputText;
}
for (const extension of [".ts", ".tsx"])
  require.extensions[extension] = (loaded, filename) =>
    loaded._compile(
      compile(readFileSync(filename, "utf8"), filename),
      filename,
    );
function load(path, mocks = {}) {
  const filename = resolve(__dirname, path);
  const loaded = new Module(filename, module);
  const localRequire = Module.createRequire(filename);
  loaded.filename = filename;
  loaded.paths = Module._nodeModulePaths(dirname(filename));
  loaded.require = (id) => (id in mocks ? mocks[id] : localRequire(id));
  loaded._compile(compile(readFileSync(filename, "utf8"), filename), filename);
  return loaded.exports;
}
const utils = require("../src/admin/pages/AdminAnalytics/utils.ts");
const {
  analyticsPath,
  trafficSource,
  createPageviewTracker,
} = require("../src/analytics/tracker.ts");
const { PAGE_LABELS } = require("../src/analytics/route-catalog.ts");
const { lightTheme, darkTheme } = require("../src/styles/themes.ts");

test("Observatório is directly below Dashboard for both admin roles", () => {
  const {
    adminMenuGroups,
  } = require("../src/admin/components/AdminSidebarMenu/navigation.ts");
  for (const role of ["ADMIN", "SUPER_ADMIN"]) {
    const links = adminMenuGroups(role).flatMap((group) =>
      group.items.map((item) => item.to),
    );
    assert.deepEqual(links.slice(0, 3), [
      "/admin",
      "/admin/observatorio",
      "/admin/notificacoes",
    ]);
    assert.equal(
      adminMenuGroups(role, "estatisticas")[0].items[0].to,
      "/admin/observatorio",
    );
  }
});

test("public route templates redact every dynamic identifier and stay synchronized with the API", () => {
  const { PAGE_LABELS: apiLabels } = load(
    "../../leviata-api/src/analytics/analytics.contract.ts",
  );
  assert.deepEqual(PAGE_LABELS, apiLabels);
  for (const template of Object.keys(PAGE_LABELS)) {
    assert.equal(
      analyticsPath(template.replace(/:[a-z]+/g, "nome-sensivel%40email.test")),
      template,
    );
  }
  for (const path of [
    "/admin",
    "/admin/login",
    "/admin/usuarios/secret",
    "/desconhecido/nome",
    "/?token=secret",
    "/noticias/teste#email",
    "//evil.test/",
  ])
    assert.equal(analyticsPath(path), null);
  assert.equal(analyticsPath("/noticias/newsletter"), "/noticias/newsletter");
  assert.equal(analyticsPath("/noticias/um-nome/"), "/noticias/:id");
});

test("referrers leave only a closed source category, never a URL or query", () => {
  for (const [referrer, expected] of [
    ["", "direct"],
    ["invalid", "direct"],
    ["https://portal.test/contato?email=private", "internal"],
    ["https://www.google.com.br/search?q=secret", "google"],
    ["https://l.instagram.com/?id=secret", "instagram"],
    ["https://google.com.evil.test/", "other"],
    ["https://nome-pessoal.example/segredo", "other"],
  ])
    assert.equal(trafficSource(referrer, "https://portal.test"), expected);
});

const descriptors = Object.fromEntries(
  ["navigator", "localStorage", "crypto"].map((key) => [
    key,
    Object.getOwnPropertyDescriptor(global, key),
  ]),
);
after(() => {
  for (const [key, descriptor] of Object.entries(descriptors)) {
    if (descriptor) Object.defineProperty(global, key, descriptor);
    else delete global[key];
  }
});
function environment({
  dnt,
  gpc,
  out = false,
  storageFails = false,
  webdriver = false,
} = {}) {
  Object.defineProperty(global, "navigator", {
    configurable: true,
    value: { doNotTrack: dnt, globalPrivacyControl: gpc, webdriver },
  });
  Object.defineProperty(global, "localStorage", {
    configurable: true,
    value: {
      getItem() {
        if (storageFails) throw new Error("blocked");
        return String(out);
      },
    },
  });
  Object.defineProperty(global, "crypto", {
    configurable: true,
    value: require("node:crypto").webcrypto,
  });
}
test("SPA tracking ignores rerenders, query-only updates and admin, but counts return navigation", () => {
  environment();
  const events = [];
  const track = createPageviewTracker((body) => events.push(body));
  for (const path of [
    "/",
    "/",
    "/noticias",
    "/noticias",
    "/noticias/secret-one",
    "/noticias/secret-two",
    "/admin",
    "/admin/login",
    "/",
    "/",
  ])
    track(path, "direct");
  assert.equal(events.length, 5);
  assert.equal(new Set(events.map((row) => row.id)).size, 5);
  assert.deepEqual(
    events.map((row) => row.path),
    ["/", "/noticias", "/noticias/:id", "/noticias/:id", "/"],
  );
  assert.ok(
    events.every(
      (row) => Object.keys(row).sort().join(",") === "id,path,source",
    ),
  );
  assert.doesNotMatch(JSON.stringify(events), /secret|admin/);
});
test("DNT, GPC, opt-out, automation and unavailable localStorage all suppress tracking", () => {
  for (const preference of [
    { dnt: "1" },
    { gpc: true },
    { out: true },
    { storageFails: true },
    { webdriver: true },
  ]) {
    environment(preference);
    let sent = false;
    createPageviewTracker(() => (sent = true))("/", "direct");
    assert.equal(sent, false, JSON.stringify(preference));
  }
  environment();
});
test("date filters handle São Paulo midnight, leap days, retention and inclusive 90-day windows", () => {
  assert.equal(
    utils.todayInSaoPaulo(new Date("2026-10-29T01:00:00Z")),
    "2026-10-28",
  );
  assert.deepEqual(utils.period(7, "2026-10-28"), {
    from: "2026-10-22",
    to: "2026-10-28",
  });
  assert.equal(
    utils.validateRange("2026-07-31", "2026-10-28", "2026-10-28"),
    null,
  );
  for (const [from, to] of [
    ["2026-07-30", "2026-10-28"],
    ["2026-02-30", "2026-03-01"],
    ["2026-10-29", "2026-10-29"],
    ["2026-10-28", "2026-10-20"],
    ["2026-01-01", "2026-01-02"],
    ["", ""],
  ])
    assert.ok(utils.validateRange(from, to, "2026-10-28"));
  assert.equal(utils.shiftDay("2024-03-01", -1), "2024-02-29");
});
test("day/week/month aggregation preserves all pageviews and previous-period alignment", () => {
  const series = Array.from({ length: 40 }, (_, i) => ({
    date: utils.shiftDay("2026-09-20", i),
    views: i,
    previousViews: i * 2,
  }));
  for (const granularity of ["day", "week", "month"]) {
    const buckets = utils.chartBuckets(series, granularity);
    assert.equal(
      buckets.reduce((sum, row) => sum + row.views, 0),
      780,
    );
    assert.equal(
      buckets.reduce((sum, row) => sum + row.previousViews, 0),
      1560,
    );
    assert.equal(buckets[0].date, series[0].date);
    assert.equal(buckets.at(-1).end, series.at(-1).date);
  }
  assert.equal(utils.chartBuckets(series, "week").length, 6);
  assert.equal(utils.chartBuckets(series, "month").length, 2);
});

// Deliberately isolated test fixture; never imported by production code.
const data = {
  pageviews: 12,
  previousPageviews: 6,
  changePercent: 100,
  comparisonReliable: true,
  averagePerDay: 6,
  activeDays: 2,
  sessions: null,
  uniqueVisitors: null,
  pagesPerSession: null,
  series: [
    { date: "2026-10-20", views: 4, previousViews: 2 },
    { date: "2026-10-21", views: 8, previousViews: 4 },
  ],
  pages: [{ key: "/", label: "Início", views: 12 }],
  sections: [{ key: "Início", label: "Início", views: 12 }],
  sources: [{ key: "google", label: "Google", views: 12 }],
  devices: [{ key: "Celular", label: "Celular", views: 12 }],
  browsers: [{ key: "Chrome", label: "Chrome", views: 12 }],
};
const report = {
  status: "ready",
  provider: "first-party",
  timezone: "America/Sao_Paulo",
  range: {
    from: "2026-10-20",
    to: "2026-10-21",
    previousFrom: "2026-10-18",
    previousTo: "2026-10-19",
    days: 2,
  },
  generatedAt: "2026-10-22T12:00:00Z",
  cacheSeconds: 300,
  retentionDays: 180,
  earliestAvailableDate: "2026-10-01",
  missing: [],
  quota: { month: "2026-10", used: 12, limit: 10000 },
  limitedMonths: [],
  data,
};
test("CSV includes range, methodology and totals; escapes separators, quotes and spreadsheet formulas", () => {
  const csv = utils.analyticsCsv({
    ...report,
    data: {
      ...data,
      pages: [{ key: "/", label: '=HYPERLINK("danger";"click")', views: 12 }],
    },
  });
  assert.ok(csv.startsWith("\uFEFF"));
  assert.match(csv, /America\/Sao_Paulo/);
  assert.ok(csv.includes('"\'=HYPERLINK(""danger"";""click"")"'));
  assert.match(csv, /"Dia";"2026-10-20"/);
  assert.equal(utils.analyticsCsv({ ...report, data: null }), "");
});

function page(state, theme = lightTheme) {
  const { AdminAnalytics } = load(
    "../src/admin/pages/AdminAnalytics/index.tsx",
    {
      "./useAnalytics": {
        useAnalytics: () => ({
          report: null,
          error: null,
          loading: false,
          refresh() {},
          ...state,
        }),
      },
    },
  );
  return renderToStaticMarkup(
    React.createElement(
      ThemeProvider,
      { theme },
      React.createElement(AdminAnalytics),
    ),
  );
}
test("configuration, loading, unavailable and errors show honest states without fabricated metrics", () => {
  for (const theme of [lightTheme, darkTheme]) {
    const pending = page(
      {
        report: {
          ...report,
          status: "not_configured",
          data: null,
          quota: null,
        },
      },
      theme,
    );
    assert.match(pending, /Aguardando configuração/);
    assert.match(pending, /Não há histórico anterior à coleta/);
    assert.doesNotMatch(pending, /Média diária|Telas de leitura/);
    assert.match(pending, /disabled=""[^>]*>[^]*?Exportar CSV/);
    assert.match(page({ loading: true }, theme), /aria-busy="true"/);
    assert.match(
      page({ report: { ...report, status: "unavailable", data: null } }, theme),
      /Estatísticas temporariamente indisponíveis/,
    );
    assert.match(page({ error: "Falha na rede" }, theme), /Falha na rede/);
  }
});
test("populated, empty and quota states render both themes and expose keyboard chart controls", () => {
  for (const theme of [lightTheme, darkTheme]) {
    const html = page({ report }, theme);
    for (const label of [
      "Observatório",
      "Onde o conhecimento circula",
      "Portas de entrada",
      "Telas de leitura",
      "Navegadores",
      "Leituras do período",
      'role="slider"',
      "aria-valuetext",
      "Google",
      "100% em relação",
    ])
      assert.ok(html.includes(label), label);
    assert.doesNotMatch(html, /NaN|undefined|\[object Object\]/);
    assert.match(
      page({ report: { ...report, status: "quota_reached" } }, theme),
      /A coleta alcançou o limite mensal/,
    );
    const emptyData = {
      ...data,
      pageviews: 0,
      averagePerDay: 0,
      activeDays: 0,
      pages: [],
      sections: [],
      sources: [],
      devices: [],
      browsers: [],
      series: data.series.map((row) => ({ ...row, views: 0 })),
    };
    assert.match(
      page({ report: { ...report, data: emptyData } }, theme),
      /Ainda não há visualizações/,
    );
  }
});
