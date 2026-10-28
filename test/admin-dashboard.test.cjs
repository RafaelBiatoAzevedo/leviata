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

function load(relative, mocks) {
  const filename = resolve(__dirname, relative);
  const loaded = new Module(filename, module);
  const localRequire = Module.createRequire(filename);
  loaded.filename = filename;
  loaded.paths = Module._nodeModulePaths(dirname(filename));
  loaded.require = (id) => (id in mocks ? mocks[id] : localRequire(id));
  loaded._compile(compile(readFileSync(filename, "utf8"), filename), filename);
  return loaded.exports;
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
function text(node) {
  if (Array.isArray(node)) return node.map(text).join("");
  return React.isValidElement(node)
    ? text(node.props.children)
    : node == null
      ? ""
      : String(node);
}

const {
  dashboardMetrics,
} = require("../src/admin/pages/AdminDashboard/metrics.ts");
const {
  adminMenuGroups,
} = require("../src/admin/components/AdminSidebarMenu/navigation.ts");
const styles = require("../src/admin/pages/AdminDashboard/styles.ts");
const { lightTheme, darkTheme } = require("../src/styles/themes.ts");
const summary = {
  title: "Resumo do portal",
  generatedAt: "2026-10-27T15:00:00Z",
  totalRecords: 105,
  items: dashboardMetrics.map((metric, index) => ({
    key: metric.key,
    label: metric.label,
    total: index,
  })),
};

function harness(initial = {}) {
  let props = {
    summary,
    loading: false,
    error: false,
    onRetry() {},
    ...initial,
  };
  const state = [],
    refs = [];
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
    useId: () => "dashboard-test",
  };
  const { DashboardOverview } = load(
    "../src/admin/pages/AdminDashboard/Overview.tsx",
    {
      react: hooks,
      "swiper/react": {
        Swiper: "metrics-swiper",
        SwiperSlide: "metrics-slide",
      },
      "swiper/modules": { A11y: {} },
    },
  );
  const render = () => {
    cursor = refCursor = 0;
    return nodes(DashboardOverview(props));
  };
  const find = (type) => render().find((node) => node.type === type);
  return {
    render,
    find,
    update(next) {
      props = { ...props, ...next };
    },
    cards: () => render().filter((node) => node.type === styles.StatCard),
    filter(key) {
      render()
        .find((node) => node.type === styles.MetricFilter && node.key === key)
        .props.onClick();
    },
    control(label) {
      return render().find(
        (node) =>
          node.type === styles.CarouselButton &&
          node.props["aria-label"] === label,
      );
    },
  };
}

test("the panorama covers every content area in the sidebar exactly once, separating editorial dossiers", () => {
  const destinations = adminMenuGroups("ADMIN")
    .flatMap((group) => group.items.map((item) => item.to))
    .filter((to) => !["/admin", "/admin/notificacoes"].includes(to));
  assert.deepEqual(
    new Set(dashboardMetrics.map((metric) => metric.to)),
    new Set(destinations),
  );
  assert.equal(new Set(dashboardMetrics.map((metric) => metric.key)).size, 15);
  assert.equal(
    dashboardMetrics.filter((metric) => metric.to === "/admin/artigos").length,
    2,
  );
  assert.ok(dashboardMetrics.some((metric) => metric.key === "juries"));
});

test("all cards show their real totals, including zero, and unknown counts never become a false zero", () => {
  const partial = {
    ...summary,
    items: summary.items.filter((item) => item.key !== "juries"),
  };
  const view = harness({ summary: partial });
  assert.equal(view.cards().length, 15);
  const people = view
    .cards()
    .find((card) => card.props.to === "/admin/pessoas");
  const jury = view.cards().find((card) => card.props.to === "/admin/juris");
  assert.match(people.props["aria-label"], /: 0$/);
  assert.match(jury.props["aria-label"], /indisponível/);
  assert.equal(
    text(nodes(jury).find((node) => node.type === styles.StatValue)),
    "—",
  );
});

test("area filters expose activities and communication without modifying the overall panorama", () => {
  const view = harness();
  const original = structuredClone(summary);
  view.filter("activities");
  assert.equal(view.cards().length, 5);
  assert.deepEqual(
    new Set(view.cards().map((card) => card.props.to)),
    new Set([
      "/admin/juris",
      "/admin/encontros",
      "/admin/bancas",
      "/admin/apresentacoes-trabalhos",
      "/admin/agenda",
    ]),
  );
  view.filter("communication");
  assert.deepEqual(
    view.cards().map((card) => card.props.to),
    ["/admin/noticias", "/admin/newsletter"],
  );
  view.filter("all");
  assert.equal(view.cards().length, 15);
  assert.deepEqual(summary, original);
});

test("carousel controls reflect boundaries, navigate and restart when changing area", () => {
  const view = harness();
  let previous = 0,
    next = 0;
  const instance = {
    activeIndex: 0,
    isBeginning: true,
    isEnd: false,
    isLocked: false,
    params: { slidesPerView: 4 },
    slidePrev() {
      previous++;
    },
    slideNext() {
      next++;
    },
  };
  view.find("metrics-swiper").props.onSwiper(instance);
  assert.equal(view.control("Indicadores anteriores").props.disabled, true);
  assert.equal(text(view.find(styles.CarouselRange)), "1–4 de 15");
  view.control("Próximos indicadores").props.onClick();
  assert.equal(next, 1);
  instance.activeIndex = 11;
  instance.isBeginning = false;
  instance.isEnd = true;
  view.find("metrics-swiper").props.onSlideChange(instance);
  assert.equal(text(view.find(styles.CarouselRange)), "12–15 de 15");
  assert.equal(view.control("Próximos indicadores").props.disabled, true);
  view.control("Indicadores anteriores").props.onClick();
  assert.equal(previous, 1);
  view.filter("all");
  assert.equal(
    text(view.find(styles.CarouselRange)),
    "12–15 de 15",
    "clicking the selected filter must not announce a false reset",
  );
  view.filter("activities");
  assert.equal(view.find("metrics-swiper").key, "activities");
  assert.equal(text(view.find(styles.CarouselRange)), "1 de 5");
  assert.equal(view.control("Indicadores anteriores").props.disabled, true);
  assert.equal(view.find("metrics-swiper").props.breakpointsBase, "container");
});

test("loading masks stale totals and an unavailable report preserves retry and navigation", () => {
  let retries = 0;
  const view = harness({ loading: true, onRetry: () => retries++ });
  assert.equal(
    view.render().filter((node) => node.type === styles.Skeleton).length,
    15,
  );
  assert.ok(
    view
      .cards()
      .every((card) => card.props["aria-label"].endsWith("carregando")),
  );
  view.update({ loading: false, summary: null, error: true });
  const error = view.find(styles.ErrorState);
  assert.equal(error.props.role, "alert");
  nodes(error)
    .find((node) => node.type === "button")
    .props.onClick();
  assert.equal(retries, 1);
  assert.equal(view.cards().length, 15);
  assert.ok(
    view
      .cards()
      .every((card) => card.props["aria-label"].endsWith("indisponível")),
  );
});

test("the banner uses the server total and actual category count in both themes", () => {
  const { AdminDashboard } = load(
    "../src/admin/pages/AdminDashboard/index.tsx",
    {
      "./useDashboard": {
        useDashboard: () => ({
          summary,
          events: [],
          news: [],
          errors: { summary: false, events: false, news: false },
          loading: false,
          retry() {},
        }),
      },
      "./Overview": { DashboardOverview: () => null },
    },
  );
  for (const theme of [lightTheme, darkTheme]) {
    const markup = renderToStaticMarkup(
      React.createElement(
        ThemeProvider,
        { theme },
        React.createElement(
          MemoryRouter,
          null,
          React.createElement(AdminDashboard),
        ),
      ),
    );
    assert.match(markup, />105<\/div>/);
    assert.match(markup, /registros em 15 áreas de conteúdo/);
    assert.doesNotMatch(markup, /seis categorias/);
  }
});

function dashboardLoader(context, initialReport) {
  const originalWindow = global.window,
    originalDocument = global.document;
  const windowEvents = new Map(),
    documentEvents = new Map(),
    timers = new Map();
  const signals = { reports: [], events: [], news: [] };
  let response = initialReport,
    effect,
    cursor = 0,
    timerId = 0;
  const state = [];
  global.window = {
    setInterval(callback, delay) {
      const id = ++timerId;
      timers.set(id, { callback, delay });
      return id;
    },
    clearInterval(id) {
      timers.delete(id);
    },
    addEventListener: (name, callback) => windowEvents.set(name, callback),
    removeEventListener: (name) => windowEvents.delete(name),
  };
  global.document = {
    visibilityState: "visible",
    addEventListener: (name, callback) => documentEvents.set(name, callback),
    removeEventListener: (name) => documentEvents.delete(name),
  };
  const hooks = {
    ...React,
    useState(initial) {
      const i = cursor++;
      if (!(i in state)) state[i] = initial;
      return [
        state[i],
        (update) => {
          state[i] = typeof update === "function" ? update(state[i]) : update;
        },
      ];
    },
    useEffect(callback) {
      effect = callback;
    },
  };
  const { useDashboard } = load(
    "../src/admin/pages/AdminDashboard/useDashboard.ts",
    {
      react: hooks,
      "../../services/reports": {
        reportsService: {
          getSummary(signal) {
            signals.reports.push(signal);
            if (response instanceof Error) return Promise.reject(response);
            return response instanceof Promise
              ? response
              : Promise.resolve({ data: structuredClone(response) });
          },
        },
      },
      "../../services/schedule": {
        scheduleService: {
          getAll(query, signal) {
            signals.events.push(signal);
            return Promise.resolve({ data: [{ id: "future-event" }] });
          },
        },
      },
      "../../services/news": {
        newsService: {
          getAll(query, signal) {
            signals.news.push(signal);
            return Promise.resolve({ data: [{ id: "recent-news" }] });
          },
        },
      },
    },
  );
  function read() {
    cursor = 0;
    return useDashboard();
  }
  read();
  const cleanup = effect();
  context.after(() => {
    cleanup();
    if (originalWindow === undefined) delete global.window;
    else global.window = originalWindow;
    if (originalDocument === undefined) delete global.document;
    else global.document = originalDocument;
  });
  return {
    read,
    signals,
    timers,
    cleanup,
    respondWith(next) {
      response = next;
    },
    focus() {
      windowEvents.get("focus")?.();
    },
    tick() {
      [...timers.values()].forEach(({ callback }) => callback());
    },
    visibility(value) {
      global.document.visibilityState = value;
      documentEvents.get("visibilitychange")?.();
    },
    listeners: () => windowEvents.size + documentEvents.size,
    flush: () => new Promise(setImmediate),
  };
}

const currentCounts = {
  title: "Resumo do portal",
  generatedAt: "2026-10-27T20:00:00.000Z",
  totalRecords: 110,
  items: [
    { key: "people", total: 23 },
    { key: "books", total: 15 },
    { key: "articles", total: 15 },
    { key: "dossiers", total: 2 },
    { key: "news", total: 16 },
    { key: "meetings", total: 5 },
    { key: "juries", total: 3 },
    { key: "boards", total: 1 },
    { key: "presentedWorks", total: 9 },
    { key: "research", total: 1 },
    { key: "researchInstruments", total: 7 },
    { key: "thematics", total: 3 },
    { key: "videos", total: 6 },
    { key: "schedule", total: 4 },
    { key: "newsletters", total: 0 },
  ],
};

test("returning to the dashboard refreshes an old six-area snapshot with real jury, board and overall counts", async (context) => {
  const loader = dashboardLoader(context, {
    ...currentCounts,
    totalRecords: 76,
    items: currentCounts.items.slice(0, 6),
  });
  await loader.flush();
  assert.equal(loader.read().summary.totalRecords, 76);
  loader.respondWith(currentCounts);
  loader.focus();
  assert.equal(
    loader.read().loading,
    false,
    "background refresh should not blank the whole dashboard",
  );
  await loader.flush();
  const report = loader.read().summary;
  assert.equal(report.items.find((item) => item.key === "juries").total, 3);
  assert.equal(report.items.find((item) => item.key === "boards").total, 1);
  assert.equal(report.totalRecords, 110);
  assert.equal(
    report.items.reduce((total, item) => total + item.total, 0),
    report.totalRecords,
  );
});

test("automatic refresh respects tab visibility and avoids duplicate focus/timer requests", async (context) => {
  const loader = dashboardLoader(context, currentCounts);
  await loader.flush();
  assert.equal([...loader.timers.values()][0].delay, 30000);
  loader.visibility("hidden");
  loader.tick();
  loader.focus();
  assert.equal(loader.signals.reports.length, 1);
  let finish;
  loader.respondWith(
    new Promise((resolve) => {
      finish = resolve;
    }),
  );
  loader.visibility("visible");
  loader.focus();
  loader.tick();
  assert.equal(loader.signals.reports.length, 2);
  finish({ data: currentCounts });
  await loader.flush();
  assert.equal(loader.read().summary.totalRecords, 110);
});

test("leaving the dashboard aborts all requests and ignores late data", async (context) => {
  let finish;
  const loader = dashboardLoader(
    context,
    new Promise((resolve) => {
      finish = resolve;
    }),
  );
  assert.equal(loader.signals.events[0], loader.signals.reports[0]);
  assert.equal(loader.signals.news[0], loader.signals.reports[0]);
  loader.cleanup();
  assert.equal(loader.signals.reports[0].aborted, true);
  assert.equal(loader.timers.size, 0);
  assert.equal(loader.listeners(), 0);
  finish({ data: currentCounts });
  await loader.flush();
  assert.equal(loader.read().summary, null);
});

test("a failed count refresh is an error instead of zero and leaves agenda/news available", async (context) => {
  const loader = dashboardLoader(context, new Error("Report unavailable"));
  await loader.flush();
  const dashboard = loader.read();
  assert.equal(dashboard.summary, null);
  assert.equal(dashboard.errors.summary, true);
  assert.equal(dashboard.errors.events, false);
  assert.equal(dashboard.events[0].id, "future-event");
  assert.equal(dashboard.news[0].id, "recent-news");
});
