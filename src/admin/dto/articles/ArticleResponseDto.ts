import type { TArticleType } from "../../types/TArticleType";

import type { PersonResponseDto } from "../people/PersonResponseDto";

export type Author = Partial<PersonResponseDto>;

export interface ArticleResponseDto {
  id: string;
  slug: string;
  title: string;
  coverUrl: string | null;
  type: TArticleType;
  journal: string | null;
  volume: string | null;
  year: number | null;
  doi: string | null;
  summary: string | null;
  externalUrl: string | null;
  authors: Author[];
  createdAt: string;
  updatedAt: string;
}
