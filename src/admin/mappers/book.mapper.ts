import type { BookResponseDto } from "../dto/books/BookResponseDto";
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
