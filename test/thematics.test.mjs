import { test } from "node:test";
import assert from "node:assert/strict";
import { thematicSchema } from "../src/admin/validations/thematic.schema.ts";
import {
  mapThematicToCreateDto,
  mapThematicToForm,
} from "../src/admin/mappers/thematic.mapper.ts";
import { loadAllPages } from "../src/utils/loadAllPages.ts";
import { thematicAcronym } from "../src/utils/thematics.ts";

const videoId = "550e8400-e29b-41d4-a716-446655440000";
const linkId = "550e8400-e29b-41d4-a716-446655440001";
const personId = "550e8400-e29b-41d4-a716-446655440002";
const base = {
  title: "Temática",
  description: "",
  mainVideoId: "",
  coordinatorId: "",
  additionalVideos: [],
};
const link = { videoId, title: "Vídeo", description: "", personId: "" };

test("accepts an empty list and optional main video/coordinator", () => {
  assert.equal(thematicSchema.safeParse(base).success, true);
  assert.deepEqual(mapThematicToCreateDto(base).additionalVideos, []);
});
test("requires a real video ID and a contextual title for each item", () => {
  assert.equal(
    thematicSchema.safeParse({
      ...base,
      additionalVideos: [{ ...link, title: "  " }],
    }).success,
    false,
  );
  assert.equal(
    thematicSchema.safeParse({
      ...base,
      additionalVideos: [{ ...link, videoId: "bad" }],
    }).success,
    false,
  );
  assert.equal(
    thematicSchema.safeParse({
      ...base,
      additionalVideos: [{ ...link, personId: "bad" }],
    }).success,
    false,
  );
  assert.equal(
    thematicSchema.safeParse({ ...base, additionalVideos: [link] }).success,
    true,
  );
});
test("preserves link IDs and all contextual fields across an edit", () => {
  const form = mapThematicToForm({
    title: "Temática",
    mainVideo: { id: videoId },
    coordinator: { id: personId },
    additionalVideos: [
      {
        id: linkId,
        videoId,
        personId,
        person: { id: personId },
        title: "Título próprio",
        description: "Pesquisa",
      },
    ],
  });
  assert.equal(form.mainVideoId, videoId);
  assert.equal(form.coordinatorId, personId);
  assert.deepEqual(mapThematicToCreateDto(form).additionalVideos, [
    {
      id: linkId,
      videoId,
      personId,
      title: "Título próprio",
      description: "Pesquisa",
    },
  ]);
});
test("sends null to clear optional fields and omits IDs for new links", () => {
  const dto = mapThematicToCreateDto({
    ...base,
    additionalVideos: [{ ...link, title: " Vídeo ", description: "  " }],
  });
  assert.equal(dto.mainVideoId, null);
  assert.equal(dto.coordinatorId, null);
  assert.deepEqual(dto.additionalVideos, [
    { videoId, title: "Vídeo", description: null, personId: null },
  ]);
});
test("clears references to people or main videos hidden after deletion", () => {
  const form = mapThematicToForm({
    title: "Temática",
    mainVideoId: videoId,
    mainVideo: null,
    coordinatorId: personId,
    coordinator: null,
    additionalVideos: [
      {
        id: linkId,
        videoId,
        title: "Vídeo",
        description: null,
        personId,
        person: null,
      },
    ],
  });
  assert.equal(form.mainVideoId, "");
  assert.equal(form.coordinatorId, "");
  assert.equal(form.additionalVideos[0].personId, "");
});
test("loads all catalog pages so selectors include videos beyond the first page", async () => {
  const items = Array.from({ length: 241 }, (_, id) => ({ id }));
  const calls = [];
  const result = await loadAllPages(async ({ page, limit }) => {
    calls.push(page);
    return { data: items.slice((page - 1) * limit, page * limit) };
  });
  assert.equal(result.length, 241);
  assert.deepEqual(calls, [1, 2, 3]);
});
test("does not hide loading failures or cancellation behind a partial catalog", async () => {
  await assert.rejects(
    loadAllPages(async ({ page, limit }) => {
      if (page === 2) throw new Error("Request cancelled");
      return { data: Array.from({ length: limit }, (_, id) => id) };
    }),
    /Request cancelled/,
  );
});
test("derives existing card initials from thematic titles", () => {
  assert.equal(thematicAcronym("Cativeiro, saúde e alimentação"), "CSA");
  assert.equal(
    thematicAcronym("Estado, Imprensa e Escravidão no Brasil"),
    "EIE",
  );
});
