import type { TArticleType } from "../types/TArticleType";

export const articleTypes: TArticleType[] = ["ARTICLE", "DOSSIER"];

export const articleTypesOptions = [
  ...articleTypes.map((type) => ({
    value: type,
    label: type === "ARTICLE" ? "Artigo" : "Dossiê",
  })),
];

export const articleTypeLabels: Record<TArticleType, string> = {
  ARTICLE: "Artigo",
  DOSSIER: "Dossiê",
};
