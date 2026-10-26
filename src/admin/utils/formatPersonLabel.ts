import type { PersonResponseDto } from "../dtos/people/PersonResponseDto";

export function formatPersonLabel(person: Partial<PersonResponseDto>) {
  const name = [person.academicTitle?.abbreviation, person.name]
    .filter(Boolean)
    .join(" ");
  const institution = person.institution?.acronym || person.institution?.name;
  return [name, institution].filter(Boolean).join(" - ");
}
