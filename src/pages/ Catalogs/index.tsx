import { ResearchInstrumentList } from "../../components/ResearchInstrumentList";
import { ResearchInstrumentType } from "../../admin/types/TResearchInstrumentType";

export function Catalogs() {
  return (
    <ResearchInstrumentList
      type={ResearchInstrumentType.CATALOG}
      title="Catálogos"
    />
  );
}
