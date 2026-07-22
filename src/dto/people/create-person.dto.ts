import type { PersonCategory } from "../../enums/person-category";

export interface CreatePersonDto {
  slug: string;
  name: string;
  category: PersonCategory;

  isActive?: boolean;
  displayOrder?: number;

  imageUrl?: string;
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
