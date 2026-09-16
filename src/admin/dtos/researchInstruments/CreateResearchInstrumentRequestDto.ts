import type { TResearchInstrumentType } from "../../types/TResearchInstrumentType";

export interface CreateResearchInstrumentRequestDto {
  title: string;

  type: TResearchInstrumentType;

  startYear?: number;

  endYear?: number;

  content?: string;

  externalUrl?: string;

  people: string[];
}
