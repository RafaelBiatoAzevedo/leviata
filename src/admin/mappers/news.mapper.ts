import type { NewsResponseDto } from "../dto/news/NewsResponseDto";
import type { NewsFormData } from "../validations/news.schema";

export function mapNewsToForm(news: NewsResponseDto): NewsFormData {
  return {
    title: news.title,

    description: news.description,

    date: news.date ? new Date(news.date).toISOString().split("T")[0] : "",

    category: news.category,

    isInternal: news.isInternal,

    externalUrl: news.externalUrl ?? "",

    relatedType: news.relatedType ?? null,

    relatedId: news.relatedId ?? null,
  };
}
