export const ArticleType = {
  ARTICLE: "ARTICLE",
  DOSSIER: "DOSSIER",
} as const;

export type TArticleType = (typeof ArticleType)[keyof typeof ArticleType];

export const articleTypeLabels: Record<TArticleType, string> = {
  ARTICLE: "Artigo",
  DOSSIER: "Dossiê",
};
