const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve, dirname } = require("node:path");
const { Module } = require("node:module");
const ts = require("typescript");
const { zodResolver } = require("@hookform/resolvers/zod");
const { createFormControl } = require("react-hook-form");

function load(relativePath, dependencies = {}) {
  const filename = resolve(__dirname, relativePath);
  const loaded = new Module(filename, module);
  loaded.filename = filename;
  loaded.paths = Module._nodeModulePaths(dirname(filename));
  const actualRequire = loaded.require.bind(loaded);
  loaded.require = (request) =>
    Object.hasOwn(dependencies, request)
      ? dependencies[request]
      : actualRequire(request);
  loaded._compile(
    ts.transpileModule(readFileSync(filename, "utf8"), {
      fileName: filename,
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText,
    filename,
  );
  return loaded.exports;
}

const { newsletterSubscriptionSchema } = load(
  "../src/validations/newsletter.ts",
);
const { newsletterSubscriptionData, newsletterSubscriptionError } = load(
  "../src/utils/newsletter.ts",
);
const {
  groupNewsletterEditions,
  newsletterEditionDate,
  newsletterEditionStatus,
  newsletterReaderDocument,
} = load("../src/utils/newsletterEditions.ts");
const api = { post() {} };
const { newsletterSubscriptionsService } = load(
  "../src/services/newsletter.ts",
  { "./api": { api } },
);

test("submits only email to the public subscription endpoint when optional fields are blank", async (context) => {
  const calls = [];
  context.mock.method(api, "post", async (url, body) => {
    calls.push({ url, body });
    return { data: { message: "Inscrição realizada com sucesso." } };
  });
  const control = createFormControl({
    resolver: zodResolver(newsletterSubscriptionSchema),
    defaultValues: {
      email: "  Pessoa@EXAMPLE.com  ",
      name: "",
      lastName: "  ",
      cellphone: "",
    },
  });
  await control.handleSubmit((values) =>
    newsletterSubscriptionsService.subscribe(
      newsletterSubscriptionData(values),
    ),
  )();
  assert.deepEqual(calls, [
    { url: "/newsletter/subscribe", body: { email: "pessoa@example.com" } },
  ]);
});

test("combines the optional name and surname and preserves formatted phone numbers", () => {
  const values = newsletterSubscriptionSchema.parse({
    email: "pessoa@example.com",
    name: " Ana ",
    lastName: " D’Ávila ",
    cellphone: " (16) 99999-0000 ",
  });
  assert.deepEqual(newsletterSubscriptionData(values), {
    email: "pessoa@example.com",
    name: "Ana D’Ávila",
    cellphone: "(16) 99999-0000",
  });
});

test("blocks missing and invalid email with an inline field error", async () => {
  for (const email of ["", "   ", "email-invalido"]) {
    const control = createFormControl({
      resolver: zodResolver(newsletterSubscriptionSchema),
      defaultValues: { email },
    });
    let submissions = 0;
    await control.handleSubmit(() => submissions++)();
    assert.equal(submissions, 0);
    assert.match(control.getFieldState("email").error.message, /e-mail/);
  }
});

test("accepts email alone and validates optional details only when provided", () => {
  assert.equal(
    newsletterSubscriptionSchema.safeParse({ email: "pessoa@example.com" })
      .success,
    true,
  );
  assert.equal(
    newsletterSubscriptionSchema.safeParse({
      email: "pessoa@example.com",
      cellphone: "1".repeat(31),
    }).success,
    false,
  );
});

test("propagates a failed save and keeps the submitted values available for retry", async (context) => {
  const failure = new Error("Network unavailable");
  context.mock.method(api, "post", async () => {
    throw failure;
  });
  const control = createFormControl({
    defaultValues: { email: "pessoa@example.com", name: "Ana" },
    resolver: zodResolver(newsletterSubscriptionSchema),
  });
  await assert.rejects(
    control.handleSubmit((values) =>
      newsletterSubscriptionsService.subscribe(
        newsletterSubscriptionData(values),
      ),
    ),
    failure,
  );
  assert.equal(control.getValues().email, "pessoa@example.com");
  assert.equal(control.getValues().name, "Ana");
});

test("shows validation errors while keeping server and network failures understandable", () => {
  assert.equal(
    newsletterSubscriptionError({
      isAxiosError: true,
      response: {
        status: 400,
        data: { message: ["Informe um e-mail válido."] },
      },
    }),
    "Informe um e-mail válido.",
  );
  for (const error of [
    null,
    new Error("offline"),
    {
      isAxiosError: true,
      response: { status: 500, data: { message: "Internal server error" } },
    },
  ]) {
    assert.equal(
      newsletterSubscriptionError(error),
      "Não foi possível concluir a inscrição. Tente novamente.",
    );
  }
});

function edition(id, publishedAt, extra = {}) {
  return {
    id,
    slug: id,
    title: id,
    subject: `Assunto: ${id}`,
    htmlContent: "<p>Conteúdo da edição.</p>",
    coverUrl: null,
    pdfUrl: null,
    publishedAt,
    sentAt: null,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    ...extra,
  };
}

test("publishes a date-only newsletter when its calendar day starts in Brazil", () => {
  const item = edition("today", "2026-10-21T00:00:00.000Z");
  assert.equal(
    newsletterEditionStatus(item, new Date("2026-10-21T02:59:59Z")),
    "upcoming",
  );
  assert.equal(
    newsletterEditionStatus(item, new Date("2026-10-21T03:00:00Z")),
    "published",
  );
  assert.equal(
    newsletterEditionStatus(item, new Date("2026-10-22T02:59:59Z")),
    "published",
  );
  assert.equal(newsletterEditionDate(item), "21 de outubro de 2026");
});

test("keeps newsletters without a valid publication date in preparation, regardless of creation or delivery", () => {
  for (const date of [null, "", "invalid"]) {
    const item = edition("draft", date, { sentAt: "2025-01-01T00:00:00Z" });
    assert.equal(
      newsletterEditionStatus(item, new Date("2026-10-21T15:00:00Z")),
      "preparing",
    );
    assert.equal(newsletterEditionDate(item), "Data a confirmar");
  }
});

test("highlights the newest published edition exactly once and groups its archive newest first", () => {
  const input = [
    edition("2024", "2024-12-01"),
    edition("older-2026", "2026-02-01"),
    edition("latest", "2026-10-21"),
    edition("2025", "2025-12-01"),
    edition("recent-2026", "2026-08-01"),
  ];
  const before = structuredClone(input);
  const grouped = groupNewsletterEditions(
    input,
    new Date("2026-10-21T15:00:00Z"),
  );
  assert.equal(grouped.latest.id, "latest");
  assert.equal(grouped.publishedCount, 5);
  assert.deepEqual(
    grouped.archive.map((group) => group.year),
    ["2026", "2025", "2024"],
  );
  assert.deepEqual(
    grouped.archive.flatMap((group) => group.items.map((item) => item.id)),
    ["recent-2026", "older-2026", "2025", "2024"],
  );
  assert.deepEqual(input, before);
});

test("orders upcoming editions nearest first and places unscheduled editions after them", () => {
  const input = [
    edition("draft", null),
    edition("later", "2027-01-01"),
    edition("near", "2026-10-22"),
  ];
  const grouped = groupNewsletterEditions(
    input,
    new Date("2026-10-21T15:00:00Z"),
  );
  assert.deepEqual(
    grouped.upcoming.map((item) => item.id),
    ["near", "later", "draft"],
  );
  assert.equal(grouped.latest, null);
  assert.equal(grouped.publishedCount, 0);
  assert.deepEqual(grouped.archive, []);
  const empty = groupNewsletterEditions([], new Date("2026-10-21T15:00:00Z"));
  assert.equal(empty.latest, null);
  assert.deepEqual(empty.upcoming, []);
});

test("keeps publication years and dates on the registered UTC calendar day", () => {
  const grouped = groupNewsletterEditions(
    [
      edition("latest", "2026-10-21"),
      edition("new-year", "2026-01-01T00:00:00Z"),
    ],
    new Date("2026-10-21T15:00:00Z"),
  );
  assert.equal(grouped.archive[0].year, "2026");
  assert.equal(
    newsletterEditionDate(grouped.archive[0].items[0]),
    "1 de janeiro de 2026",
  );
});

test("prepares HTML fragments and full newsletter documents for the isolated responsive reader", () => {
  const fragment = newsletterReaderDocument(
    "<h1>Leitura</h1><p>Texto completo.</p>",
  );
  assert.match(fragment, /<!doctype html>/i);
  assert.match(fragment, /<html lang="pt-BR">/);
  assert.match(fragment, /name="viewport"/);
  assert.match(fragment, /<base target="_blank">/);
  assert.match(fragment, /<h1>Leitura<\/h1><p>Texto completo\.<\/p>/);
  assert.doesNotMatch(fragment, /img, video, table\s*\{[^}]*!important/);
  const constrained = newsletterReaderDocument('<html><head></head><body><table class="nl-document" style="width:100%;max-width:640px"><tr><td>Texto</td></tr></table></body></html>');
  assert.match(constrained, /max-width:640px/);
  assert.doesNotMatch(constrained, /(?:^|[},])\s*table\s*\{[^}]*!important/);
  for (const source of [
    "<!doctype html><html><head><style>p{color:blue}</style></head><body>Conteúdo original</body></html>",
    '<html lang="pt-BR"><body>Conteúdo original</body></html>',
  ]) {
    const prepared = newsletterReaderDocument(source);
    assert.equal((prepared.match(/<head>/g) || []).length, 1);
    assert.equal((prepared.match(/<html[ >]/g) || []).length, 1);
    assert.match(prepared, /Conteúdo original/);
    assert.match(prepared, /name="viewport"/);
    assert.match(prepared, /max-width: 100% !important/);
  }
});
