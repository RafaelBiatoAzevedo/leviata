import type { TPersonCategory } from "../../enums/PersonCategory";

export interface CreatePersonDto {
  name: string;

  category: TPersonCategory;

  isActive?: boolean;

  displayOrder?: number;

  birthDate?: string;

  bio?: string;

  orcid?: string;

  email: string;

  lattesUrl?: string;

  website?: string;

  linkedinUrl?: string;

  honorificTitle?: string;

  nationalityId: string;

  academicTitleId: string;

  institutionId: string;
}
