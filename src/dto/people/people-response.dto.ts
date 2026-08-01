import type { PersonCategory } from "../../admin/enums/person-category";

export interface InstitutionResponseDto {
  id: string;

  name: string;

  acronym: string;
}

export interface AcademicTitleResponseDto {
  id: string;

  name: string;
}

export interface CountryResponseDto {
  id: string;

  name: string;

  acronym: string;
}

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
