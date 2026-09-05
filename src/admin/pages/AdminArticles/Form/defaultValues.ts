import type { ArticleFormData } from "../../../validations/article.schema";

export const articleDefaultValues: ArticleFormData = {
  title: "",
  type: "ARTICLE",
  journal: "",
  volume: "",
  year: 0,
  doi: "",
  summary: "",
  externalUrl: "",
  authors: [],
};
