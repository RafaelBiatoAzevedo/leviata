import type { PersonResponseDto } from "../../dto/people/people-response.dto";
import type { PersonFormData } from "../validations/person.schema";

export function mapPersonToForm(person: PersonResponseDto): PersonFormData {
  return {
    name: person.name,
    slug: person.slug,

    category: person.category,

    isActive: person.isActive,

    displayOrder: person.displayOrder,

    imageUrl: person.imageUrl ?? "",

    birthDate: person.birthDate
      ? new Date(person.birthDate).toISOString().split("T")[0]
      : "",

    nationalityId: person.nationality?.id ?? "",

    academicTitleId: person.academicTitle?.id ?? "",

    institutionId: person.institution?.id ?? "",

    email: person.email ?? "",

    lattesUrl: person.lattesUrl ?? "",

    orcid: person.orcid ?? "",

    linkedinUrl: person.linkedinUrl ?? "",

    website: person.website ?? "",

    bio: person.bio ?? "",
  };
}
