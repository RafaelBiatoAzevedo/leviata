const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const ts = require("typescript");
const { createFormControl } = require("react-hook-form");
const { zodResolver } = require("@hookform/resolvers/zod");

for (const extension of [".ts", ".tsx"]) {
  require.extensions[extension] = (loaded, filename) =>
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
}

const {
  mapPresentedWorkToForm,
  mapPresentedWorkToCreateDto,
} = require("../src/admin/mappers/presentedWork.mapper.ts");
const {
  presentedWorkSchema,
} = require("../src/admin/validations/presentedWork.schema.ts");
const {
  formatDateTime,
  toLocalDateTime,
} = require("../src/admin/utils/dateTime.ts");

const record = {
  title: "Apresentação cadastrada",
  date: "2026-10-22T18:45:00.000Z",
  authors: [{ id: "autor-1" }],
};

async function inTimeZone(zone, action) {
  const previous = process.env.TZ;
  process.env.TZ = zone;
  try {
    await action();
  } finally {
    if (previous === undefined) delete process.env.TZ;
    else process.env.TZ = previous;
  }
}

test("creates a presentation with its selected local hour saved as an unambiguous instant", async () => {
  await inTimeZone("America/Sao_Paulo", async () => {
    const control = createFormControl({
      defaultValues: {
        ...mapPresentedWorkToForm(record),
        date: "2026-10-22T14:35",
      },
      resolver: zodResolver(presentedWorkSchema),
    });
    let submitted;
    await control.handleSubmit((values) => {
      submitted = mapPresentedWorkToCreateDto(values);
    })();
    assert.equal(submitted.date, "2026-10-22T17:35:00.000Z");
    assert.deepEqual(submitted.authors, ["autor-1"]);
  });
});

test("editing another field preserves the saved date and hour after resetting the form", async () => {
  for (const [zone, local] of [
    ["America/Sao_Paulo", "2026-10-22T15:45"],
    ["UTC", "2026-10-22T18:45"],
    ["Asia/Tokyo", "2026-10-23T03:45"],
  ]) {
    await inTimeZone(zone, async () => {
      const control = createFormControl({
        defaultValues: {},
        resolver: zodResolver(presentedWorkSchema),
      });
      control.reset(mapPresentedWorkToForm(record));
      assert.equal(control.getValues("date"), local);
      control.setValue("title", "Título editado");
      let submitted;
      await control.handleSubmit((values) => {
        submitted = mapPresentedWorkToCreateDto(values);
      })();
      assert.equal(submitted.date, record.date);
      assert.equal(submitted.title, "Título editado");
    });
  }
});

test("the edit field and displayed time agree across midnight and year boundaries", async () => {
  await inTimeZone("America/Sao_Paulo", () => {
    const saved = "2026-01-01T01:15:00.000Z";
    assert.equal(toLocalDateTime(saved), "2025-12-31T22:15");
    assert.match(formatDateTime(saved), /31\/12\/2025/);
    assert.match(formatDateTime(saved), /22:15/);
    const form = mapPresentedWorkToForm({ ...record, date: saved });
    assert.equal(mapPresentedWorkToCreateDto(form).date, saved);
  });
});

test("requires a real date and hour before allowing submission", async () => {
  for (const date of [
    "",
    "2026-10-22",
    "2026-02-30T12:00",
    "2026-10-22T25:00",
    "invalid",
  ]) {
    const control = createFormControl({
      defaultValues: { ...mapPresentedWorkToForm(record), date },
      resolver: zodResolver(presentedWorkSchema),
    });
    let submissions = 0;
    await control.handleSubmit(() => submissions++)();
    assert.equal(submissions, 0, date);
    assert.ok(control.getFieldState("date").error, date);
  }
  assert.equal(toLocalDateTime(null), "");
  assert.equal(toLocalDateTime("invalid"), "");
  assert.equal(formatDateTime("invalid"), "—");
});

test("clearing any saved link sends an explicit null and keeps the other links", async () => {
  const links = {
    documentUrl: "https://example.org/documento.pdf",
    registrationUrl: "https://example.org/inscricao",
    recordingUrl: "https://example.org/gravacao",
    meetingUrl: "https://example.org/transmissao",
  };
  for (const field of Object.keys(links)) {
    const saved = { ...record, ...links };
    const control = createFormControl({
      defaultValues: mapPresentedWorkToForm(saved),
      resolver: zodResolver(presentedWorkSchema),
    });
    control.setValue(field, "");
    let request;
    await control.handleSubmit((values) => {
      request = JSON.parse(JSON.stringify(mapPresentedWorkToCreateDto(values)));
    })();
    assert.equal(Object.hasOwn(request, field), true, field);
    assert.equal(request[field], null, field);
    for (const [otherField, value] of Object.entries(links)) {
      if (otherField !== field) assert.equal(request[otherField], value);
    }
    const reloaded = mapPresentedWorkToForm({
      ...saved,
      ...request,
      authors: saved.authors,
    });
    assert.equal(reloaded[field], "", field);
  }
});

test("removing all links keeps their null values in the JSON request", async () => {
  const control = createFormControl({
    defaultValues: mapPresentedWorkToForm(record),
    resolver: zodResolver(presentedWorkSchema),
  });
  let request;
  await control.handleSubmit((values) => {
    request = JSON.parse(JSON.stringify(mapPresentedWorkToCreateDto(values)));
  })();
  for (const field of [
    "documentUrl",
    "registrationUrl",
    "recordingUrl",
    "meetingUrl",
  ]) {
    assert.equal(Object.hasOwn(request, field), true, field);
    assert.equal(request[field], null, field);
  }
});
