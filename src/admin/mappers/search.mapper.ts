import type { SearchResponseDto } from "../dtos/research/SearchResponseDto";
import type { SearchFormData } from "../validations/search.schema";

export function mapSearchToForm(search: SearchResponseDto): SearchFormData {
  return {
    title: search.title,
    content: search.content ?? "",
    people: search.people.map((person) => person.id),
    images: search.images.map((image) => image.id),
    supports: search.supports.map((support) => support.id),
  };
}

export function mapSearchToCreateDto(data: SearchFormData) {
  const dto = { ...data };

  delete (dto as Partial<SearchFormData & { coverUrl: string }>).coverUrl;

  return dto;
}
