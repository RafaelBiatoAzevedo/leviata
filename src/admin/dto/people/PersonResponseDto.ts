import type { TPersonCategory } from "../../enums/PersonCategory";
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

  email?: string;

  lattesUrl?: string;

  website?: string;

  linkedinUrl?: string;

  honorificTitle?: string;

  nationality?: CountryResponseDto;

  academicTitle?: AcademicTitleResponseDto;

  institution?: InstitutionResponseDto;

  createdAt: string;

  updatedAt: string;
}
