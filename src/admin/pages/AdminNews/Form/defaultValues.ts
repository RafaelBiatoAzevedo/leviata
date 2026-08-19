import type { NewsFormData } from "../../../validations/news.schema";

export const newsDefaultValues: NewsFormData = {
  title: "",
  description: "",
  date: "",
  category: "RESEARCH",
  isInternal: false,
  externalUrl: "",
  relatedType: null,
  relatedId: null,
};
