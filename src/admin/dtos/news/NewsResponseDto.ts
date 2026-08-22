import type { TNewsCategory } from "../../enums/NewsCategory";
import type { TNewsRelatedType } from "../../enums/NewsRelatedType";

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

  createdAt: string;

  updatedAt: string;
}
