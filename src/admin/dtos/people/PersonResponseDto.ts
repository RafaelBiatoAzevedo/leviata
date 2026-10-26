import type { TPersonCategory } from "../../types/TPersonCategory";
import type { AcademicTitleResponseDto } from "../AcademicTitleResponseDto";
import type { CountryResponseDto } from "../CountryResponseDto";
import type { InstitutionResponseDto } from "../InstitutionResponseDto";

export interface PersonResponseDto {
  id: string;

  slug: string;

  name: string;

  category: TPersonCategory;

  isActive: boolean;

  displayOrder: number;

  imageUrl?: string;

  birthDate?: string;

  bio?: string;

  orcid?: string;

  email: string | null;

  lattesUrl?: string;

  website?: string;

  linkedinUrl?: string;

  honorificTitle?: string;

  nationality: CountryResponseDto | null;

  academicTitle: AcademicTitleResponseDto | null;

  institution: InstitutionResponseDto | null;

  createdAt: string;

  updatedAt: string;
}
