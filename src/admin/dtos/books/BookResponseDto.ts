import type { PersonResponseDto } from "../people/PersonResponseDto";

export type Author = Partial<PersonResponseDto>;

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

  authors: Author[];

  createdAt: string;
  updatedAt: string;
}
