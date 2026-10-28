export const NewsRelatedType = {
  BOARD: "BOARD",
  JURY: "JURY",
  MEETING: "MEETING",
  PRESENTED_WORK: "PRESENTED_WORK",
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
  MEETING: "Evento (encontro, seminário, simpósio ou mostra)",
  PRESENTED_WORK: "Apresentação de trabalhos",
  PUBLICATION: "Publicação",
  RESEARCH: "Pesquisa",
  RESEARCH_INSTRUMENT: "Instrumento de pesquisa",
  THEMATIC: "Temática",
};
