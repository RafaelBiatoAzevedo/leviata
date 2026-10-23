import { ResearchInstrumentList } from "../../components/ResearchInstrumentList";
import { ResearchInstrumentType } from "../../admin/types/TResearchInstrumentType";

export function Database() {
  return (
    <ResearchInstrumentList
      type={ResearchInstrumentType.DATABASE}
      title="Banco de Dados"
    />
  );
}
