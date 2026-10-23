export const NewsRelatedType = {
  BOARD: "BOARD",
  JURY: "JURY",
  MEETING: "MEETING",
  PUBLICATION: "PUBLICATION",
  RESEARCH: "RESEARCH",
  RESEARCH_INSTRUMENT: "RESEARCH_INSTRUMENT",
  THEMATIC: "THEMATIC",
} as const;

export type TNewsRelatedType =
  (typeof NewsRelatedType)[keyof typeof NewsRelatedType];

export const newsRelatedTypeLabels: Record<TNewsRelatedType, string> = {
  BOARD: "Banca",
  JURY: "Júri",
  MEETING: "Encontro, seminário ou documentário",
  PUBLICATION: "Publicação",
  RESEARCH: "Pesquisa",
  RESEARCH_INSTRUMENT: "Instrumento de pesquisa",
  THEMATIC: "Temática",
};
