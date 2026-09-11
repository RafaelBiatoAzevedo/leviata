import type { BookResponseDto } from "../dtos/books/BookResponseDto";
import type { BookFormData } from "../validations/book.schema";

export function mapBookToForm(book: BookResponseDto): BookFormData {
  return {
    title: book.title,
    subtitle: book.subtitle ?? "",
    description: book.description ?? "",
    isbn: book.isbn ?? "",
    year: book.year,
    publisher: book.publisher,
    externalUrl: book.externalUrl,
    authors: book.authors.map((author) => author.id!),
  };
}

export function mapBookToCreateDto(data: BookFormData) {
  const dto = { ...data };

  delete (dto as Partial<BookFormData & { coverUrl: string }>).coverUrl;

  return dto;
}
