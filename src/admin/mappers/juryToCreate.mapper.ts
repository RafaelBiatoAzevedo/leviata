import type { JuryFormData } from "../validations/jury.schema";

export function mapJuryToCreateDto(data: JuryFormData) {
  const dto = { ...data };

  delete (dto as Partial<JuryFormData & { coverUrl: string }>).coverUrl;

  return dto;
}
