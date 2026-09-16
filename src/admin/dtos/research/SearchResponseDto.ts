import type { ImageResponseDto } from "../ImageResponseDto";
import type { PersonResponseDto } from "../people/PersonResponseDto";

export interface SearchResponseDto {
  id: string;

  title: string;

  slug: string;

  coverUrl: string | null;

  coverPublicId: string | null;

  content: string | null;

  people: PersonResponseDto[];

  images: ImageResponseDto[];

  supports: ImageResponseDto[];

  createdAt: string;

  updatedAt: string;
}
