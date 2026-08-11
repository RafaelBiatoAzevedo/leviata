import type { BookFormData } from "../validations/book.schema";

export function mapBookToCreateDto(data: BookFormData) {
  const dto = { ...data };

  delete (dto as Partial<BookFormData & { coverUrl: string }>).coverUrl;

  return dto;
}
