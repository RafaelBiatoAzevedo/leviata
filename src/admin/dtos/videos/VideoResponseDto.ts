import type { PersonResponseDto } from "../people/PersonResponseDto";

export interface VideoResponseDto {
  id: string;

  title: string;

  slug: string;

  embedLink: string;

  description: string | null;

  people: PersonResponseDto[];

  createdAt: string;

  updatedAt: string;
}
