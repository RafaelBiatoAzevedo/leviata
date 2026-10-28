const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const ts = require("typescript");
const { zodResolver } = require("@hookform/resolvers/zod");
const { createFormControl } = require("react-hook-form");

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
  scheduleSchema,
} = require("../src/admin/validations/schedule.schema.ts");
const {
  mapScheduleToCreateDto,
  mapScheduleToForm,
} = require("../src/admin/mappers/schedule.mapper.ts");
const {
  scheduleDefaultValues,
} = require("../src/admin/pages/AdminSchedule/Form/defaultValues.ts");
const id = "550e8400-e29b-41d4-a716-446655440000";
const data = {
  ...scheduleDefaultValues,
  title: "Simpósio de História",
  date: "2026-10-15T09:00",
  externalUrl: "https://example.com/inscricao",
};

test("agenda accepts an optional registration link and round-trips its destination", () => {
  const dto = mapScheduleToCreateDto(scheduleSchema.parse(data));
  assert.equal(dto.externalUrl, data.externalUrl);
  assert.equal(dto.meetingId, null);
  const edited = mapScheduleToForm({ ...dto, meeting: null });
  assert.equal(edited.destination, "EXTERNAL");
  assert.equal(edited.externalUrl, data.externalUrl);
  assert.equal(edited.date, data.date);
  assert.equal(
    scheduleSchema.safeParse({ ...data, externalUrl: "" }).success,
    true,
  );
});

test("editing the form replaces registration with a saved event and clears the old link", async () => {
  const form = createFormControl({
    defaultValues: data,
    resolver: zodResolver(scheduleSchema),
    shouldFocusError: false,
  });
  for (const field of Object.keys(data)) form.register(field);
  form.setValue("destination", "MEETING");
  form.setValue("meetingId", id);
  let dto;
  await form.handleSubmit((values) => {
    dto = mapScheduleToCreateDto(values);
  })();
  assert.equal(dto.meetingId, id);
  assert.equal(dto.externalUrl, null);
  assert.equal(dto.title, data.title);
  const edited = mapScheduleToForm(dto);
  assert.equal(edited.destination, "MEETING");
  assert.equal(edited.meetingId, id);
  assert.equal(edited.externalUrl, "");
});

test("changing back to an external link removes a previous event and ignores inactive fields", () => {
  const dto = mapScheduleToCreateDto(
    scheduleSchema.parse({ ...data, meetingId: id }),
  );
  assert.equal(dto.meetingId, null);
  assert.equal(dto.externalUrl, data.externalUrl);
  const linked = mapScheduleToCreateDto(
    scheduleSchema.parse({
      ...data,
      destination: "MEETING",
      meetingId: id,
      externalUrl: "old invalid link",
    }),
  );
  assert.equal(linked.externalUrl, null);
  assert.equal(linked.meetingId, id);
});

test("agenda rejects a missing event, unsafe URL and inverted period with field errors", async () => {
  for (const [change, field] of [
    [{ destination: "MEETING", meetingId: "" }, "meetingId"],
    [{ destination: "MEETING", meetingId: "invalid" }, "meetingId"],
    [{ externalUrl: "javascript:alert(1)" }, "externalUrl"],
    [{ endDate: "2026-10-14T09:00" }, "endDate"],
  ]) {
    const result = scheduleSchema.safeParse({ ...data, ...change });
    assert.equal(result.success, false);
    assert.ok(result.error.issues.some((issue) => issue.path[0] === field));
  }
});
