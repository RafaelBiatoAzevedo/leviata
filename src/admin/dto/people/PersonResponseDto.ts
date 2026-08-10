import type { PersonCategory } from "../../enums/PersonCategory";
import type { AcademicTitleResponseDto } from "../AcademicTitleResponseDto";
import type { CountryResponseDto } from "../CountryResponseDto";
import type { InstitutionResponseDto } from "../InstitutionResponseDto";

export interface PersonResponseDto {
  id: string;

  slug: string;

  name: string;

  category: PersonCategory;

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
