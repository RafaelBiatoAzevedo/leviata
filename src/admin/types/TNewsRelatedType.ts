export const NewsRelatedType = {
  BOARD: "BOARD",
  JURY: "JURY",
  MEETING: "MEETING",
  PUBLICATION: "PUBLICATION",
  RESEARCH_INSTRUMENT: "RESEARCH_INSTRUMENT",
  THEMATIC: "THEMATIC",
} as const;

export type TNewsRelatedType =
  (typeof NewsRelatedType)[keyof typeof NewsRelatedType];

export const newsRelatedTypeLabels: Record<TNewsRelatedType, string> = {
  BOARD: "Banca",
  JURY: "Juri",
  MEETING: "Reunião",
  PUBLICATION: "Publicação",
  RESEARCH_INSTRUMENT: "Instrumento de pesquisa",
  THEMATIC: "Temática",
};
