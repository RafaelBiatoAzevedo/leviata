export const ResearchInstrumentType = {
  DOSSIER: "DOSSIER",
  CATALOG: "CATALOG",
  DATABASE: "DATABASE",
} as const;

export type TResearchInstrumentType =
  (typeof ResearchInstrumentType)[keyof typeof ResearchInstrumentType];

export const researchInstrumentTypeLabels: Record<
  TResearchInstrumentType,
  string
> = {
  DOSSIER: "Dossiê",
  CATALOG: "Catálogo",
  DATABASE: "Base de Dados",
};
