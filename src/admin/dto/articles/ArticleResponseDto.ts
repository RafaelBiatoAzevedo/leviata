import type { TArticleType } from "../../types/TArticleType";

import type { PersonResponseDto } from "../people/PersonResponseDto";

export type Author = Partial<PersonResponseDto>;

export interface ArticleResponseDto {
  id: string;

  slug: string;

  title: string;

  coverUrl: string;

  type: TArticleType;

  journal: string;

  volume: string;

  year: number;

  doi?: string;

  summary?: string;

  externalUrl: string;

  authors: Author[];

  createdAt: string;

  updatedAt: string;
}
