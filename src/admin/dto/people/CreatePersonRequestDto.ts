import type { PersonCategory } from "../../enums/PersonCategory";

export interface CreatePersonDto {
  name: string;
  category: PersonCategory;

  isActive?: boolean;
  displayOrder?: number;

  birthDate?: string;

  bio?: string;

  orcid?: string;
  email?: string;

  lattesUrl?: string;
  website?: string;
  linkedinUrl?: string;

  honorificTitle?: string;

  nationalityId?: string;
  academicTitleId?: string;
  institutionId?: string;
}
