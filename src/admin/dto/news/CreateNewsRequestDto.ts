import type { TNewsCategory } from "../../enums/NewsCategory";
import type { TNewsRelatedType } from "../../enums/NewsRelatedType";

export interface CreateNewsRequestDto {
  title: string;
  description: string;
  date: string;
  category: TNewsCategory;
  isInternal?: boolean;
  externalUrl?: string | null;
  relatedType?: TNewsRelatedType | null;
  relatedId?: string | null;
}
