import {
  ResearchInstrumentType,
  researchInstrumentTypeLabels,
  type TResearchInstrumentType,
} from "../types/TResearchInstrumentType";

export const researchInstrumentTypeOptions = [
  ...(Object.values(ResearchInstrumentType) as TResearchInstrumentType[]).map(
    (category) => ({
      value: category,
      label: researchInstrumentTypeLabels[category],
    }),
  ),
];
