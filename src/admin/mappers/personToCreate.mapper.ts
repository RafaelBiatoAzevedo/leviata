import type { PersonFormData } from "../validations/person.schema";

export function mapPersonToCreateDto(data: PersonFormData) {
  const dto = { ...data };

  delete (dto as Partial<PersonFormData & { imageUrl: string }>).imageUrl;

  return dto;
}
