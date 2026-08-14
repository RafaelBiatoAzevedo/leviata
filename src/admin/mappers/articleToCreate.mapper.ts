import type { ArticleFormData } from "../validations/article.schema";

export function mapArticleToCreateDto(data: ArticleFormData) {
  const dto = { ...data };

  delete (dto as Partial<ArticleFormData & { coverUrl: string }>).coverUrl;

  return dto;
}
