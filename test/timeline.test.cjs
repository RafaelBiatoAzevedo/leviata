const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve, dirname } = require("node:path");
const { Module } = require("node:module");
const ts = require("typescript");

const filename = resolve(__dirname, "../src/utils/timeline.ts");
const loaded = new Module(filename, module);
loaded.filename = filename;
loaded.paths = Module._nodeModulePaths(dirname(filename));
loaded._compile(
  ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText,
  filename,
);
const {
  groupTimeline,
  timelineStatus,
  timelineDateLabel,
  timelineDateStamp,
  timelineExternalUrl,
} = loaded.exports;

const now = new Date("2026-10-20T15:00:00Z");
const entry = (id, date, options = {}) => ({ id, title: id, date, ...options });

test("keeps a date-only presentation on its registered day across the São Paulo day boundary", () => {
  const work = entry("presentation", "2026-09-08T00:00:00.000Z", {
    dateOnly: true,
  });
  assert.equal(
    timelineStatus(work, new Date("2026-09-08T02:59:59Z")),
    "upcoming",
  );
  assert.equal(timelineStatus(work, new Date("2026-09-08T03:00:00Z")), "today");
  assert.equal(timelineStatus(work, new Date("2026-09-09T02:59:59Z")), "today");
  assert.equal(timelineStatus(work, new Date("2026-09-09T03:00:00Z")), "past");
  assert.deepEqual(timelineDateStamp(work), { day: "08", month: "set" });
  assert.equal(timelineDateLabel(work), "8 de setembro de 2026");
});

test("keeps a multi-day agenda event upcoming until its real end", () => {
  const event = entry("conference", "2026-10-19T12:00:00Z", {
    endDate: "2026-10-21T21:00:00Z",
  });
  assert.equal(
    timelineStatus(event, new Date("2026-10-18T15:00:00Z")),
    "upcoming",
  );
  assert.equal(timelineStatus(event, now), "ongoing");
  assert.equal(
    timelineStatus(event, new Date("2026-10-21T20:59:59Z")),
    "ongoing",
  );
  assert.equal(timelineStatus(event, new Date("2026-10-21T21:00:00Z")), "past");
});

test("distinguishes today's scheduled event, an event in progress and an ended event", () => {
  const event = entry("today", "2026-10-20T18:00:00Z", {
    endDate: "2026-10-20T20:00:00Z",
  });
  assert.equal(timelineStatus(event, now), "today");
  assert.equal(timelineStatus(event, new Date(event.date)), "ongoing");
  assert.equal(timelineStatus(event, new Date(event.endDate)), "past");
});

test("keeps today's event visible all day when its end time is unknown", () => {
  const event = entry("no-end", "2026-10-20T12:00:00Z");
  assert.equal(timelineStatus(event, now), "today");
  assert.equal(
    timelineStatus(event, new Date("2026-10-21T02:59:59Z")),
    "today",
  );
  assert.equal(timelineStatus(event, new Date("2026-10-21T03:00:00Z")), "past");
});

test("orders upcoming events nearest first and the archive newest first, grouped by year", () => {
  const entries = [
    entry("past-2024", "2024-09-08"),
    entry("future-2027", "2027-03-01"),
    entry("past-recent", "2026-10-19"),
    entry("future-near", "2026-10-21"),
    entry("past-2025", "2025-11-01"),
    entry("past-older", "2026-01-02"),
    entry("future-later", "2026-11-01"),
  ].map((item) => ({ ...item, dateOnly: true }));
  const before = structuredClone(entries);
  const grouped = groupTimeline(entries, now);
  assert.deepEqual(
    grouped.upcoming.map((group) => group.year),
    ["2026", "2027"],
  );
  assert.deepEqual(
    grouped.past.map((group) => group.year),
    ["2026", "2025", "2024"],
  );
  assert.deepEqual(
    grouped.upcoming.flatMap((group) => group.entries.map((item) => item.id)),
    ["future-near", "future-later", "future-2027"],
  );
  assert.deepEqual(
    grouped.past.flatMap((group) => group.entries.map((item) => item.id)),
    ["past-recent", "past-older", "past-2025", "past-2024"],
  );
  assert.equal(grouped.upcomingCount, 3);
  assert.equal(grouped.pastCount, 4);
  assert.deepEqual(entries, before);
});

test("groups agenda dates by São Paulo year and date-only presentations by registered year", () => {
  const event = entry("new-year", "2026-01-01T01:00:00Z");
  assert.equal(groupTimeline([event], now).past[0].year, "2025");
  assert.equal(
    groupTimeline([{ ...event, dateOnly: true }], now).past[0].year,
    "2026",
  );
  assert.deepEqual(timelineDateStamp(event), { day: "31", month: "dez" });
});

test("formats agenda times and same-day or multi-day periods in São Paulo time", () => {
  const event = entry("timed", "2026-10-20T12:00:00Z");
  assert.equal(timelineDateLabel(event), "20 de outubro de 2026 às 09:00");
  assert.equal(
    timelineDateLabel({ ...event, endDate: "2026-10-20T21:00:00Z" }),
    "20 de outubro de 2026, das 09:00 às 18:00",
  );
  assert.equal(
    timelineDateLabel({ ...event, endDate: "2026-10-21T21:00:00Z" }),
    "20 de outubro de 2026 às 09:00 até 21 de outubro de 2026 às 18:00",
  );
});

test("supports multi-day date-only events without advancing the final day too early", () => {
  const event = entry("period", "2026-10-19", {
    dateOnly: true,
    endDate: "2026-10-20",
  });
  assert.equal(timelineStatus(event, now), "ongoing");
  assert.equal(timelineStatus(event, new Date("2026-10-21T03:00:00Z")), "past");
  assert.equal(
    timelineDateLabel(event),
    "19 de outubro de 2026 a 20 de outubro de 2026",
  );
});

test("preserves invalid-date records separately instead of misclassifying or crashing", () => {
  const invalid = [entry("invalid", "invalid"), entry("missing", "")];
  const grouped = groupTimeline(invalid, now);
  assert.deepEqual(grouped.undated, invalid);
  assert.deepEqual(grouped.upcoming, []);
  assert.deepEqual(grouped.past, []);
  assert.equal(timelineDateLabel(invalid[0]), "Data a confirmar");
  assert.deepEqual(timelineDateStamp(invalid[0]), {
    day: "—",
    month: "a definir",
  });
});

test("renders only usable web URLs for event and presentation actions", () => {
  for (const value of [
    null,
    undefined,
    "",
    "not-a-url",
    "javascript:alert(1)",
    "data:text/html,test",
    "/relative",
  ]) {
    assert.equal(timelineExternalUrl(value), null);
  }
  assert.equal(
    timelineExternalUrl("https://example.com/recording?a=1&b=2"),
    "https://example.com/recording?a=1&b=2",
  );
  assert.equal(
    timelineExternalUrl("http://localhost:3000/event"),
    "http://localhost:3000/event",
  );
});
