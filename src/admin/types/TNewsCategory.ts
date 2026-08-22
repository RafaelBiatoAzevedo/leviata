export const NewsCategory = {
  PUBLICATION: "PUBLICATION",
  EVENT: "EVENT",
  AWARD: "AWARD",
  INTERNSHIP: "INTERNSHIP",
  RESEARCH: "RESEARCH",
  PODCAST: "PODCAST",
  CALL: "CALL",
} as const;

export type TNewsCategory = (typeof NewsCategory)[keyof typeof NewsCategory];

export const newsCategoryLabels: Record<TNewsCategory, string> = {
  PUBLICATION: "Publicação",
  EVENT: "Evento",
  AWARD: "Premiação",
  INTERNSHIP: "Estágio",
  RESEARCH: "Pesquisa",
  PODCAST: "Podcast",
  CALL: "Convocação",
};
