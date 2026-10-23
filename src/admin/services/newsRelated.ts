import { publicService, type PublicResource } from "../../services/public";
import type { TNewsRelatedType } from "../types/TNewsRelatedType";
import { articleTypeLabels, type TArticleType } from "../types/TArticleType";
import { meetingTypeLabels, type TMeetingType } from "../types/TMeetingType";
import {
  researchInstrumentTypeLabels,
  type TResearchInstrumentType,
} from "../types/TResearchInstrumentType";

export interface NewsRelatedOption {
  value: string;
  label: string;
}

interface RelatedRecord {
  id: string;
  title: string;
  type?: string;
  year?: number | null;
  isInternal?: boolean;
}

const resources = {
  BOARD: "boards",
  JURY: "juries",
  MEETING: "meetings",
  RESEARCH_INSTRUMENT: "researchInstruments",
  THEMATIC: "thematics",
} as const satisfies Record<
  Exclude<TNewsRelatedType, "PUBLICATION">,
  PublicResource
>;

export async function loadNewsRelatedOptions(
  type: TNewsRelatedType,
  signal?: AbortSignal,
): Promise<NewsRelatedOption[]> {
  if (type === "PUBLICATION") {
    const [books, articles] = await Promise.all([
      publicService.getAll<RelatedRecord>("books", {}, signal),
      publicService.getAll<RelatedRecord>("articles", {}, signal),
    ]);
    return [
      ...books.map((record) => ({
        value: record.id,
        label: `Livro — ${record.title}${record.year ? ` (${record.year})` : ""}`,
      })),
      ...articles.map((record) => ({
        value: record.id,
        label: `${articleTypeLabels[record.type as TArticleType] || "Artigo"} — ${record.title}${record.year ? ` (${record.year})` : ""}`,
      })),
    ];
  }
  const records = await publicService.getAll<RelatedRecord>(
    resources[type],
    {},
    signal,
  );
  return records.map((record) => {
    const prefix =
      type === "MEETING"
        ? meetingTypeLabels[record.type as TMeetingType]
        : type === "RESEARCH_INSTRUMENT"
          ? researchInstrumentTypeLabels[record.type as TResearchInstrumentType]
          : undefined;
    return {
      value: record.id,
      label: `${prefix ? `${prefix} — ` : ""}${record.title}${
        type === "MEETING" && typeof record.isInternal === "boolean"
          ? ` (${record.isInternal ? "interno" : "externo"})`
          : ""
      }`,
    };
  });
}
