import type { TNewsCategory } from "../../types/TNewsCategory";
import type { TNewsRelatedType } from "../../types/TNewsRelatedType";
import type { ImageResponseDto } from "../ImageResponseDto";

export interface NewsResponseDto {
  id: string;

  slug: string;

  title: string;

  description: string;

  coverUrl: string | null;

  date: string;

  category: TNewsCategory;

  isInternal: boolean;

  externalUrl: string | null;

  relatedType: TNewsRelatedType | null;

  relatedId: string | null;

  images: ImageResponseDto[];

  createdAt: string;

  updatedAt: string;
}
