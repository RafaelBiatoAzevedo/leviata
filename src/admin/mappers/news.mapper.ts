import type { NewsResponseDto } from "../dtos/news/NewsResponseDto";
import type { NewsFormData } from "../validations/news.schema";
import type { CreateNewsRequestDto } from "../dtos/news/CreateNewsRequestDto";

export function mapNewsToForm(news: NewsResponseDto): NewsFormData {
  return {
    title: news.title,

    description: news.description,

    date: news.date ? new Date(news.date).toISOString().split("T")[0] : "",

    category: news.category,

    isInternal: news.isInternal,

    externalUrl: news.isInternal ? "" : (news.externalUrl ?? ""),

    relatedType: news.isInternal ? (news.relatedType ?? null) : null,

    relatedId: news.isInternal ? (news.relatedId ?? null) : null,
  };
}

export function mapNewsToCreateDto(data: NewsFormData): CreateNewsRequestDto {
  return {
    title: data.title,
    description: data.description,
    date: data.date,
    category: data.category,
    isInternal: data.isInternal,
    externalUrl: data.isInternal ? null : data.externalUrl.trim(),
    relatedType: data.isInternal ? data.relatedType || null : null,
    relatedId: data.isInternal ? data.relatedId?.trim() || null : null,
  };
}
