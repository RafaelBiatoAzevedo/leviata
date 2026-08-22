import type { TNewsCategory } from "../../types/TNewsCategory";
import type { TNewsRelatedType } from "../../types/TNewsRelatedType";

export interface CreateNewsRequestDto {
  title: string;

  description: string;

  date: string;

  category: TNewsCategory;

  isInternal: boolean;

  externalUrl: string | null;

  relatedType?: TNewsRelatedType | null;

  relatedId?: string | null;
}
