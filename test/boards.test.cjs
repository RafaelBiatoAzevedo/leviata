const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const ts = require("typescript");
const { createFormControl } = require("react-hook-form");
const { zodResolver } = require("@hookform/resolvers/zod");

require.extensions[".ts"] = (loaded, filename) =>
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

const {
  mapBoardToForm,
  mapBoardToCreateDto,
} = require("../src/admin/mappers/board.mapper.ts");
const { boardSchema } = require("../src/admin/validations/board.schema.ts");
const { formatDateTime } = require("../src/admin/utils/dateTime.ts");

const record = {
  title: "Defesa cadastrada",
  type: "DEFENSE",
  date: "2026-10-30T17:35:00.000Z",
  candidateId: "550e8400-e29b-41d4-a716-446655440000",
  advisorId: "550e8400-e29b-41d4-a716-446655440001",
  members: [{ id: "550e8400-e29b-41d4-a716-446655440002" }],
  meetingUrl: "https://example.org/banca",
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

test("saves a new board with its selected local hour as an explicit UTC instant", async () => {
  await inTimeZone("America/Sao_Paulo", async () => {
    const control = createFormControl({
      defaultValues: { ...mapBoardToForm(record), date: "2026-10-30T14:35" },
      resolver: zodResolver(boardSchema),
    });
    let submitted;
    await control.handleSubmit((values) => {
      submitted = mapBoardToCreateDto(values);
    })();
    assert.equal(submitted.date, record.date);
    assert.equal(submitted.type, record.type);
    assert.deepEqual(submitted.members, record.members.map((member) => member.id));
    assert.equal(submitted.meetingUrl, record.meetingUrl);
  });
});

test("editing other board fields preserves its date and hour across browser time zones", async () => {
  for (const [zone, local] of [
    ["America/Sao_Paulo", "2026-10-30T14:35"],
    ["UTC", "2026-10-30T17:35"],
    ["Asia/Tokyo", "2026-10-31T02:35"],
  ]) {
    await inTimeZone(zone, async () => {
      const control = createFormControl({ resolver: zodResolver(boardSchema) });
      control.reset(mapBoardToForm(record));
      assert.equal(control.getValues("date"), local);
      control.setValue("title", "Título atualizado");
      let submitted;
      await control.handleSubmit((values) => {
        submitted = mapBoardToCreateDto(values);
      })();
      assert.equal(submitted.date, record.date, zone);
      assert.equal(submitted.type, record.type);
      assert.equal(submitted.title, "Título atualizado");
    });
  }
});

test("requires an explicit type and never classifies legacy boards from their titles", async () => {
  for (const type of [null, undefined]) {
    const form = mapBoardToForm({ ...record, type });
    assert.equal(form.type, "");
    assert.equal(boardSchema.safeParse(form).success, false);
    assert.throws(() => mapBoardToCreateDto(form), /Selecione o tipo de banca/);
    for (const selected of ["QUALIFICATION", "DEFENSE"]) {
      const control = createFormControl({
        defaultValues: form,
        resolver: zodResolver(boardSchema),
      });
      control.setValue("type", selected);
      let submitted;
      await control.handleSubmit((values) => {
        submitted = mapBoardToCreateDto(values);
      })();
      assert.equal(submitted.type, selected);
      assert.equal(submitted.date, record.date);
    }
  }
  for (const type of ["", "TCC", "qualification", "DEFENSE "]) {
    assert.equal(boardSchema.safeParse({ ...mapBoardToForm(record), type }).success, false);
  }
});

test("the board edit field and admin display agree across midnight and year boundaries", async () => {
  await inTimeZone("America/Sao_Paulo", () => {
    const date = "2027-01-01T01:15:00.000Z";
    const form = mapBoardToForm({ ...record, date });
    assert.equal(form.date, "2026-12-31T22:15");
    assert.match(formatDateTime(date), /31\/12\/2026/);
    assert.match(formatDateTime(date), /22:15/);
    assert.equal(mapBoardToCreateDto(form).date, date);
  });
});

test("the board form rejects missing hours and impossible dates before submitting", async () => {
  for (const date of ["", "2026-10-30", "2026-02-30T12:00", "2026-10-30T25:00", "invalid"]) {
    const control = createFormControl({
      defaultValues: { ...mapBoardToForm(record), date },
      resolver: zodResolver(boardSchema),
    });
    let submissions = 0;
    await control.handleSubmit(() => submissions++)();
    assert.equal(submissions, 0, date);
    assert.ok(control.getFieldState("date").error, date);
  }
});
