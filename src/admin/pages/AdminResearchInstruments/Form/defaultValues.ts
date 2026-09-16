import { ResearchInstrumentType } from "../../../types/TResearchInstrumentType";
import type { ResearchInstrumentFormData } from "../../../validations/researchInstrument.schema";

export const researchInstrumentDefaultValues: ResearchInstrumentFormData = {
  title: "",
  type: ResearchInstrumentType.DOSSIER,
  startYear: undefined,
  endYear: undefined,
  content: "",
  externalUrl: "",
  people: [],
};
