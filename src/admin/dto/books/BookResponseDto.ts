import type { AcademicTitleResponseDto } from "../AcademicTitleResponseDto";
import type { InstitutionResponseDto } from "../InstitutionResponseDto";

export interface BookAuthorResponseDto {
  id: string;

  slug: string;

  name: string;

  institution: InstitutionResponseDto;

  academicTitle: AcademicTitleResponseDto;
}

export interface BookResponseDto {
  id: string;

  slug: string;

  title: string;

  subtitle?: string;

  coverUrl: string;

  description?: string;

  isbn?: string;

  year: number;

  publisher: string;

  externalUrl: string;

  authors: BookAuthorResponseDto[];

  createdAt: string;
  updatedAt: string;
}
