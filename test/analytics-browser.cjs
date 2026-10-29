// Optional browser QA. All data below belongs to an isolated localhost mock API.
const assert = require("node:assert/strict");
const http = require("node:http");
const { mkdirSync } = require("node:fs");
const { resolve } = require("node:path");
const { createRequire } = require("node:module");
const apiRequire = createRequire(
  resolve(__dirname, "../../leviata-api/package.json"),
);
const puppeteer = apiRequire("puppeteer");
const user = {
  id: "browser-qa",
  email: "qa@example.invalid",
  role: "ADMIN",
  firstName: "Equipe",
  lastName: "de pesquisa",
};
const collected = [];
let mode = "ready";
const today = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Sao_Paulo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());
function shift(day, amount) {
  const date = new Date(`${day}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}
function report(url) {
  const from = url.searchParams.get("from") || shift(today, -29);
  const to = url.searchParams.get("to") || today;
  const days = Math.round((Date.parse(to) - Date.parse(from)) / 86400000) + 1;
  const empty = mode === "empty";
  const series = Array.from({ length: days }, (_, index) => ({
    date: shift(from, index),
    views: empty ? 0 : 12 + ((index * 17) % 64),
    previousViews: empty ? 0 : 8 + ((index * 11) % 40),
  }));
  const pageviews = series.reduce((sum, point) => sum + point.views, 0);
  const row = (key, label, percent) => ({
    key,
    label,
    views: Math.round(pageviews * percent),
  });
  const unavailable = ["not_configured", "unavailable"].includes(mode);
  return {
    status: mode === "empty" ? "ready" : mode,
    provider: "first-party",
    timezone: "America/Sao_Paulo",
    range: {
      from,
      to,
      days,
      previousFrom: shift(from, -days),
      previousTo: shift(from, -1),
    },
    generatedAt: new Date().toISOString(),
    cacheSeconds: 300,
    retentionDays: 180,
    earliestAvailableDate: shift(today, -120),
    missing: [],
    limitedMonths: [],
    quota: {
      month: today.slice(0, 7),
      used: mode === "quota_reached" ? 10000 : pageviews,
      limit: 10000,
    },
    data: unavailable
      ? null
      : {
          pageviews,
          previousPageviews: series.reduce(
            (sum, point) => sum + point.previousViews,
            0,
          ),
          changePercent: null,
          comparisonReliable: false,
          averagePerDay: pageviews / days,
          activeDays: empty ? 0 : days,
          sessions: null,
          uniqueVisitors: null,
          pagesPerSession: null,
          series,
          pages: empty
            ? []
            : [
                row("/", "Início", 0.32),
                row("/publicacoes", "Publicações", 0.25),
                row("/instrumentos", "Instrumentos de pesquisa", 0.18),
                row("/noticias/:id", "Detalhes de notícia", 0.15),
                row("/agenda", "Agenda", 0.1),
              ],
          sections: empty
            ? []
            : [
                row("Início", "Início", 0.32),
                row("Publicações", "Publicações", 0.25),
                row("Instrumentos", "Instrumentos", 0.18),
                row("Notícias", "Notícias", 0.15),
                row("Agenda", "Agenda", 0.1),
              ],
          sources: empty
            ? []
            : [
                row("direct", "Direto / não informado", 0.48),
                row("google", "Google", 0.35),
                row("instagram", "Instagram", 0.12),
                row("other", "Outros sites", 0.05),
              ],
          devices: empty
            ? []
            : [
                row("Celular", "Celular", 0.62),
                row("Computador", "Computador", 0.34),
                row("Tablet", "Tablet", 0.04),
              ],
          browsers: empty
            ? []
            : [
                row("Chrome", "Chrome", 0.6),
                row("Safari", "Safari", 0.25),
                row("Firefox", "Firefox", 0.1),
                row("Edge", "Edge", 0.05),
              ],
        },
  };
}
async function main() {
  const output = process.env.ANALYTICS_QA_OUTPUT || "/tmp/leviata-analytics-qa";
  mkdirSync(output, { recursive: true });
  const api = http.createServer(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );
    if (req.method === "OPTIONS") {
      res.writeHead(204).end();
      return;
    }
    const url = new URL(req.url, "http://localhost");
    res.setHeader("Content-Type", "application/json");
    if (url.pathname === "/analytics/collect") {
      let raw = "";
      for await (const chunk of req) raw += chunk;
      collected.push({ body: JSON.parse(raw), headers: req.headers });
      res.writeHead(204).end();
      return;
    }
    if (url.pathname === "/analytics/report") {
      res.end(JSON.stringify(report(url)));
      return;
    }
    if (url.pathname === "/auth/me") {
      res.end(JSON.stringify(user));
      return;
    }
    if (url.pathname === "/notifications/counts") {
      res.end('{"unreadCount":0,"pendingCount":0}');
      return;
    }
    res.end(
      JSON.stringify(
        ["/countries", "/institutions", "/academic-titles"].includes(
          url.pathname,
        )
          ? []
          : { items: [], total: 0, page: 1, limit: 100, totalPages: 0 },
      ),
    );
  });
  let vite, browser;
  try {
    await new Promise((resolve) => api.listen(0, "127.0.0.1", resolve));
    process.env.VITE_API_BASE_URL = `http://127.0.0.1:${api.address().port}`;
    process.env.VITE_ANALYTICS_ENABLED = "true";
    const { createServer } = await import("vite");
    vite = await createServer({
      root: resolve(__dirname, ".."),
      server: { host: "127.0.0.1", port: 5187, strictPort: true, open: false },
    });
    await vite.listen();
    const origin = "http://127.0.0.1:5187";
    browser = await puppeteer.launch({
      executablePath: process.env.CHROME_BIN || "/usr/bin/google-chrome",
      headless: true,
      args: ["--no-sandbox", "--disable-dev-shm-usage"],
    });
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.evaluateOnNewDocument(() =>
      Object.defineProperty(navigator, "webdriver", { get: () => false }),
    );
    await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
    await page.goto(`${origin}/admin/observatorio`, {
      waitUntil: "networkidle0",
    });
    assert.ok(
      page.url().includes("/admin/login"),
      "private route must redirect anonymous users",
    );
    await page.evaluate((user) => {
      localStorage.setItem("@leviata:user", JSON.stringify(user));
      localStorage.setItem("@leviata:token", "local-browser-test-only");
    }, user);
    await page.goto(`${origin}/admin/observatorio`, {
      waitUntil: "networkidle0",
    });
    await page.waitForFunction(() =>
      document.body.innerText.includes("Portas de entrada"),
    );
    assert.equal(collected.length, 0, "admin never generates pageviews");
    const links = await page.$$eval(
      'nav[aria-label="Navegação administrativa"] a',
      (links) => links.slice(0, 3).map((link) => link.getAttribute("href")),
    );
    assert.deepEqual(links, [
      "/admin",
      "/admin/observatorio",
      "/admin/notificacoes",
    ]);
    await page.screenshot({ path: `${output}/desktop.png`, fullPage: true });
    await page.focus('[role="slider"]');
    await page.keyboard.press("Home");
    await page.keyboard.press("ArrowRight");
    assert.equal(
      await page.$eval('[role="slider"]', (element) =>
        element.getAttribute("aria-valuenow"),
      ),
      "1",
    );
    await page.select('select[aria-label="Agrupar gráfico por"]', "week");
    assert.equal(
      await page.$eval('[role="slider"]', (element) =>
        element.getAttribute("aria-valuemax"),
      ),
      "4",
    );
    await page.select('select[aria-label="Agrupar gráfico por"]', "month");
    await page.click("button::-p-text(Personalizado)");
    async function dates(from, to) {
      await page.$$eval(
        'input[type="date"]',
        (inputs, values) => {
          const setter = Object.getOwnPropertyDescriptor(
            HTMLInputElement.prototype,
            "value",
          ).set;
          inputs.forEach((input, index) => {
            setter.call(input, values[index]);
            input.dispatchEvent(new Event("input", { bubbles: true }));
          });
        },
        [from, to],
      );
    }
    await dates(shift(today, -100), today);
    await page.click("button::-p-text(Aplicar período)");
    await page.waitForSelector("#analytics-range-error");
    await dates(shift(today, -13), shift(today, -1));
    await page.click("button::-p-text(Aplicar período)");
    await page.waitForFunction(
      () => !document.querySelector("#analytics-range-error"),
    );
    await page.click("button::-p-text(30 dias)");
    await page.waitForFunction(
      () => !!document.querySelector('[role="slider"]'),
    );
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
    await page.waitForFunction(
      () =>
        getComputedStyle(document.querySelector("#admin-navigation"))
          .visibility === "hidden",
    );
    await new Promise((resolve) => setTimeout(resolve, 300));
    await page.screenshot({ path: `${output}/mobile.png`, fullPage: true });
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      "mobile page must not overflow horizontally",
    );
    await page.evaluate(() => {
      const content = document.querySelector("main > div:last-child");
      content.scrollTop = 1350;
    });
    await page.screenshot({
      path: `${output}/mobile-chart.png`,
      fullPage: true,
    });
    assert.ok(
      await page.evaluate(() => {
        const content = document.querySelector("main > div:last-child");
        return content.scrollWidth <= content.clientWidth;
      }),
      "mobile content must not overflow its scrolling container",
    );
    await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
    await page.evaluate(() => {
      document.querySelector("main > div:last-child").scrollTop = 800;
    });
    await page.screenshot({
      path: `${output}/desktop-chart.png`,
      fullPage: true,
    });
    // Theme preference uses the same key as the application.
    const themeSource = require("node:fs").readFileSync(
      resolve(__dirname, "../src/utils/themePreference.ts"),
      "utf8",
    );
    const themeKey = themeSource.match(
      /THEME_STORAGE_KEY\s*=\s*["']([^"']+)/,
    )[1];
    await page.evaluate((key) => localStorage.setItem(key, "dark"), themeKey);
    await page.reload({ waitUntil: "networkidle0" });
    await page.screenshot({ path: `${output}/dark.png`, fullPage: true });
    for (const [state, text] of [
      ["not_configured", "A próxima história começa"],
      ["unavailable", "Estatísticas temporariamente indisponíveis"],
      ["quota_reached", "A coleta alcançou o limite mensal"],
      ["empty", "Ainda não há visualizações"],
    ]) {
      mode = state;
      await page.reload({ waitUntil: "networkidle0" });
      await page.waitForFunction(
        (text) => document.body.innerText.includes(text),
        {},
        text,
      );
      if (state === "not_configured")
        await page.screenshot({
          path: `${output}/configuration.png`,
          fullPage: true,
        });
    }
    mode = "ready";
    await page.goto(
      `${origin}/publicacoes?email=never-send@example.invalid#private`,
      { waitUntil: "networkidle0" },
    );
    await page.waitForFunction(() => document.querySelector("footer"));
    await new Promise((resolve) => setTimeout(resolve, 500));
    assert.equal(collected.length, 1);
    assert.equal(collected[0].body.path, "/publicacoes");
    assert.deepEqual(Object.keys(collected[0].body).sort(), [
      "id",
      "path",
      "source",
    ]);
    assert.ok(
      !collected[0].headers.authorization &&
        !collected[0].headers.cookie &&
        !collected[0].headers.referer,
    );
    await page.evaluate(() =>
      document.querySelector('a[href="/noticias"]').click(),
    );
    await new Promise((resolve) => setTimeout(resolve, 700));
    assert.equal(collected.length, 2);
    assert.equal(collected[1].body.path, "/noticias");
    // Search/hash updates and rerendering must not create another pageview.
    await page.evaluate(() => {
      history.pushState({}, "", "?query=private#private");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
    await new Promise((resolve) => setTimeout(resolve, 600));
    assert.equal(collected.length, 2);
    await page.click(
      "summary::-p-text(Privacidade das estatísticas de acesso)",
    );
    await page.click("button::-p-text(Desativar estatísticas neste navegador)");
    await page.evaluate(() =>
      document.querySelector('a[href="/publicacoes"]').click(),
    );
    await new Promise((resolve) => setTimeout(resolve, 600));
    assert.equal(collected.length, 2, "opt-out suppresses later SPA events");
    assert.doesNotMatch(
      JSON.stringify(collected.map((event) => event.body)),
      /private|never-send|email|token/,
    );
    assert.deepEqual(errors, []);
    console.log(
      `PASS: auth redirect, menu order, chart keyboard/grouping, date validation, mobile, themes, provider states, SPA deduplication, private URLs, transport and opt-out. Screenshots: ${output}`,
    );
  } finally {
    await browser?.close();
    await vite?.close();
    await new Promise((resolve) => api.close(resolve));
  }
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
