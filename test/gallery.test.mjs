import { test } from "node:test";
import assert from "node:assert/strict";
import { saveGallery } from "../src/admin/utils/saveGallery.ts";
import {
  mapMeetingToForm,
  mapMeetingToCreateDto,
} from "../src/admin/mappers/meeting.mapper.ts";
import { mapJuryToForm } from "../src/admin/mappers/jury.mapper.ts";
import { meetingSchema } from "../src/admin/validations/meeting.schem.ts";

const image = (values = {}) => ({
  key: "existing",
  id: "existing",
  imageUrl: "https://res.cloudinary.com/test/existing.png",
  title: "",
  description: "",
  originalTitle: "",
  originalDescription: "",
  ...values,
});

test("uploads images without captions and only updates edited metadata", async () => {
  const calls = [];
  const images = [
    image(),
    image({ key: "edited", id: "edited", title: "  Evento  " }),
    image({ key: "new", id: undefined, file: new File(["png"], "photo.png") }),
  ];
  const saved = [];
  await saveGallery(
    "parent",
    images,
    new Set(),
    {
      async upload(id, file, metadata) {
        calls.push(["upload", id, file.name, metadata]);
        return { data: { id: "new-id" } };
      },
      async update(id, imageId, metadata) {
        calls.push(["update", id, imageId, metadata]);
        return { data: { id: imageId } };
      },
      async remove() {
        assert.fail("No removals expected");
      },
    },
    (before, after) => saved.push([before.key, after.id]),
  );
  assert.deepEqual(calls, [
    ["update", "parent", "edited", { title: "Evento", description: null }],
    ["upload", "parent", "photo.png", { title: null, description: null }],
  ]);
  assert.deepEqual(saved, [
    ["edited", "edited"],
    ["new", "new-id"],
  ]);
});

test("clears captions using nulls", async () => {
  let metadata;
  await saveGallery(
    "parent",
    [
      image({
        originalTitle: "Old",
        originalDescription: "Old description",
        description: "  ",
      }),
    ],
    new Set(),
    {
      async upload() {
        assert.fail("No uploads expected");
      },
      async update(id, imageId, value) {
        metadata = value;
        return { data: { id: imageId } };
      },
      async remove() {
        assert.fail("No removals expected");
      },
    },
    () => {},
  );
  assert.deepEqual(metadata, { title: null, description: null });
});

test("a retry preserves completed uploads and delays deletion until uploads succeed", async () => {
  let images = [
    image({ key: "first", id: undefined, file: new File(["a"], "first.png") }),
    image({
      key: "second",
      id: undefined,
      file: new File(["b"], "second.png"),
    }),
  ];
  const removed = new Set(["old"]);
  const calls = [];
  let fail = true;
  const service = {
    async upload(id, file) {
      calls.push(file.name);
      if (file.name === "second.png" && fail) throw new Error("Upload failed");
      return { data: { id: file.name, title: null, description: null } };
    },
    async update() {
      assert.fail("Completed uploads must not be edited");
    },
    async remove(id, imageId) {
      calls.push(`delete:${imageId}`);
    },
  };
  const onSaved = (before, saved) => {
    images = images.map((item) =>
      item.key === before.key ? image({ key: before.key, id: saved.id }) : item,
    );
  };
  await assert.rejects(
    saveGallery("parent", images, removed, service, onSaved),
    /Upload failed/,
  );
  assert.deepEqual(calls, ["first.png", "second.png"]);
  assert.deepEqual([...removed], ["old"]);
  fail = false;
  await saveGallery("parent", images, removed, service, onSaved);
  assert.deepEqual(calls, [
    "first.png",
    "second.png",
    "second.png",
    "delete:old",
  ]);
  assert.equal(removed.size, 0);
});

test("a deletion retry only processes unfinished removals", async () => {
  const removed = new Set(["first", "second"]);
  const calls = [];
  let fail = true;
  const service = {
    async upload() {
      assert.fail("No uploads expected");
    },
    async update() {
      assert.fail("No edits expected");
    },
    async remove(id, imageId) {
      calls.push(imageId);
      if (imageId === "second" && fail) throw new Error("Delete failed");
    },
  };
  await assert.rejects(
    saveGallery("parent", [], removed, service, () => {}),
    /Delete failed/,
  );
  assert.deepEqual([...removed], ["second"]);
  fail = false;
  await saveGallery("parent", [], removed, service, () => {});
  assert.deepEqual(calls, ["first", "second", "second"]);
});

test("editing a meeting loads its date in date-input format and preserves the recording link", () => {
  const form = mapMeetingToForm({
    title: "Evento",
    type: "MEETING",
    date: "2026-10-04T12:00:00Z",
    recordingUrl: "https://example.com/recording",
    speakers: [],
  });
  assert.equal(form.date, "2026-10-04");
  assert.equal(form.recordingUrl, "https://example.com/recording");
});

test("meeting date inputs preserve the UTC calendar day at year boundaries and accept an absent date", () => {
  for (const [date, expected] of [
    ["2026-01-01T00:00:00.000Z", "2026-01-01"],
    ["2026-12-31T23:59:00.000Z", "2026-12-31"],
    ["2026-10-23", "2026-10-23"],
    [null, ""],
  ]) {
    const form = mapMeetingToForm({
      title: "Encontro",
      type: "MEETING",
      date,
      speakers: [],
    });
    assert.equal(form.date, expected);
    if (expected) assert.match(form.date, /^\d{4}-\d{2}-\d{2}$/);
  }
});

test("meeting create and edit mappings preserve explicit internal and external classifications", () => {
  for (const isInternal of [true, false]) {
    const form = mapMeetingToForm({
      title: "Evento",
      type: "SEMINAR",
      date: "2026-10-23",
      speakers: [],
      isInternal,
    });
    assert.equal(form.isInternal, isInternal);
    assert.equal(mapMeetingToCreateDto(form).isInternal, isInternal);
  }
  assert.equal(
    mapMeetingToForm({ title: "Anterior", speakers: [] }).isInternal,
    true,
  );
});

test("meeting forms accept and round-trip all three event types", () => {
  for (const type of ["MEETING", "SEMINAR", "DOCUMENTARY"]) {
    const form = meetingSchema.parse(
      mapMeetingToForm({
        title: "Atividade cadastrada",
        type,
        isInternal: true,
        date: "2026-10-23",
        speakers: [{ id: "550e8400-e29b-41d4-a716-446655440000" }],
      }),
    );
    assert.equal(mapMeetingToCreateDto(form).type, type);
  }
});

test("editing jury photos preserves the document independently of registration", () => {
  const form = mapJuryToForm({
    title: "Júri",
    date: "2026-10-04T12:00:00Z",
    documentUrl: "https://example.com/document",
    registrationUrl: "https://example.com/registration",
    judges: [],
    jurors: [],
    prosecutors: [],
    defenders: [],
    bailiffs: [],
  });
  assert.equal(form.documentUrl, "https://example.com/document");
  assert.equal(form.registrationUrl, "https://example.com/registration");
});
