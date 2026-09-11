import type { ArticleResponseDto } from "../dtos/articles/ArticleResponseDto";
import type { ArticleFormData } from "../validations/article.schema";

export function mapArticleToForm(book: ArticleResponseDto): ArticleFormData {
  return {
    title: book.title,

    type: book.type,

    volume: book.volume ?? "",

    doi: book.doi ?? "",

    journal: book.journal,

    year: book.year,

    externalUrl: book.externalUrl ?? "",

    summary: book.summary ?? "",

    authors: book.authors.map((author) => author.id!),
  };
}

export function mapArticleToCreateDto(data: ArticleFormData) {
  const dto = { ...data };

  delete (dto as Partial<ArticleFormData & { coverUrl: string }>).coverUrl;

  return dto;
}
