import { ResearchInstrumentDetails } from "../../components/ResearchInstrumentDetails";
import { ResearchInstrumentType } from "../../admin/types/TResearchInstrumentType";

export function DossierDetails() {
  return <ResearchInstrumentDetails type={ResearchInstrumentType.DOSSIER} />;
}
