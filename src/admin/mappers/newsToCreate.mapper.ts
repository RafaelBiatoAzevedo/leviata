import type { NewsFormData } from "../validations/news.schema";

export function mapNewsToCreateDto(data: NewsFormData) {
  const dto = { ...data };

  delete (dto as Partial<NewsFormData & { coverUrl: string }>).coverUrl;

  return dto;
}
