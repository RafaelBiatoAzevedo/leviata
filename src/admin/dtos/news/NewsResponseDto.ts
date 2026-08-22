import type { TNewsCategory } from "../../types/TNewsCategory";
import type { TNewsRelatedType } from "../../types/TNewsRelatedType";

export interface NewsResponseDto {
  id: string;

  slug: string;

  title: string;

  description: string;

  coverUrl: string | null;

  date: string;

  category: TNewsCategory;

  isInternal: boolean;

  externalUrl: string;

  relatedType: TNewsRelatedType | null;

  relatedId: string | null;

  createdAt: string;

  updatedAt: string;
}
