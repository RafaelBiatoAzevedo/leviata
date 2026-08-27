import {
  ArticleType,
  articleTypeLabels,
  type TArticleType,
} from "../types/TArticleType";

export const articlesTypeOptions = [
  ...(Object.values(ArticleType) as TArticleType[]).map((category) => ({
    value: category,
    label: articleTypeLabels[category],
  })),
];
