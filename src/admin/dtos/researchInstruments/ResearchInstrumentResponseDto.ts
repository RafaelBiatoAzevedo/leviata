import type { TResearchInstrumentType } from "../../types/TResearchInstrumentType";
import type { PersonResponseDto } from "../people/PersonResponseDto";

export interface ResearchInstrumentResponseDto {
  id: string;

  slug: string;

  title: string;

  type: TResearchInstrumentType;

  startYear: number | null;

  endYear: number | null;

  content: string | null;

  pdfUrl: string | null;

  externalUrl: string | null;

  people: PersonResponseDto[];

  createdAt: string;

  updatedAt: string;
}
