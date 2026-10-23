import {
  ResearchInstrumentType,
  type TResearchInstrumentType,
} from "../admin/types/TResearchInstrumentType";

export const researchInstrumentPaths: Record<TResearchInstrumentType, string> =
  {
    [ResearchInstrumentType.DOSSIER]:
      "/instrumentos/planilhas-biblio-tematicas/dossie",
    [ResearchInstrumentType.CATALOG]: "/instrumentos/catalogos",
    [ResearchInstrumentType.DATABASE]: "/instrumentos/banco-de-dados",
  };

export function researchInstrumentPath(
  type: TResearchInstrumentType,
  identifier: string,
) {
  return `${researchInstrumentPaths[type]}/${encodeURIComponent(identifier)}`;
}

export function researchInstrumentPeriod(
  start?: number | null,
  end?: number | null,
) {
  if (start != null && end != null)
    return start === end ? String(start) : `${start} — ${end}`;
  if (start != null) return `A partir de ${start}`;
  if (end != null) return `Até ${end}`;
  return "";
}
