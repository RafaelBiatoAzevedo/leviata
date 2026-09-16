import type { ArticleResponseDto } from "../dtos/articles/ArticleResponseDto";
import type { ArticleFormData } from "../validations/article.schema";

export function mapArticleToForm(article: ArticleResponseDto): ArticleFormData {
  return {
    title: article.title,

    type: article.type,

    volume: article.volume ?? "",

    doi: article.doi ?? "",

    journal: article.journal,

    year: article.year,

    externalUrl: article.externalUrl ?? "",

    summary: article.summary ?? "",

    authors: article.authors.map((author) => author.id!),
  };
}

export function mapArticleToCreateDto(data: ArticleFormData) {
  const dto = { ...data };

  delete (dto as Partial<ArticleFormData & { coverUrl: string }>).coverUrl;

  return dto;
}
