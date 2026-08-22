import type { TArticleType } from "../../types/TArticleType";

export interface CreateArticleRequestDto {
  title: string;

  type: TArticleType;

  journal?: string;

  volume?: string;

  year: number;

  doi?: string;

  summary?: string;

  externalUrl?: string;

  authors: string[];
}
