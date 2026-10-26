import { Link, useParams } from "react-router-dom";
import type { ResearchInstrumentResponseDto } from "../../admin/dtos/researchInstruments/ResearchInstrumentResponseDto";
import {
  ResearchInstrumentType,
  type TResearchInstrumentType,
} from "../../admin/types/TResearchInstrumentType";
import { usePublicRecord } from "../../hooks/usePublicData";
import { researchInstrumentPeriod } from "../../utils/researchInstruments";
import { timelineExternalUrl } from "../../utils/timeline";
import { DocumentViewer } from "../DocumentViewer";
import {
  Container,
  Content,
  Header,
  Links,
  Status,
} from "../GalleryDetails/styles";
import { ParagraphText } from "../ParagraphText";
import { PublicDataState } from "../PublicDataState";
import { PublicPeople } from "../PublicPeople";
import { SectionHeader } from "../SectionHeader";
import { Comments } from "../Comments";
import { PeriodBadge } from "../YearBadge";

export function ResearchInstrumentDetails({
  type,
}: {
  type?: TResearchInstrumentType;
}) {
  const { id } = useParams();
  const { data, loading, error } =
    usePublicRecord<ResearchInstrumentResponseDto>("researchInstruments", id);
  const selectedType = type || data?.type;
  const backPath =
    selectedType === ResearchInstrumentType.DOSSIER
      ? "/instrumentos/planilhas-biblio-tematicas"
      : selectedType === ResearchInstrumentType.CATALOG
        ? "/instrumentos/catalogos"
        : selectedType === ResearchInstrumentType.DATABASE
          ? "/instrumentos/banco-de-dados"
          : "/instrumentos";
  const wrongType = !!type && !!data && data.type !== type;
  if (loading || error || !data || wrongType)
    return (
      <Container>
        <Status>
          <PublicDataState
            loading={loading}
            error={!loading && (error || !data || wrongType)}
            empty={false}
            label="o instrumento de pesquisa"
          />
          {!loading && <Link to={backPath}>Voltar à listagem</Link>}
        </Status>
      </Container>
    );
  const pdf = timelineExternalUrl(data.pdfUrl);
  const external = timelineExternalUrl(data.externalUrl);
  const period = researchInstrumentPeriod(data.startYear, data.endYear);
  return (
    <Container>
      <Content>
        <Header>
          <SectionHeader center title={data.title} />
          <PeriodBadge period={period} />
        </Header>
        {data.content?.trim() && (
          <ParagraphText text={data.content} linkifyUrls />
        )}
        <PublicPeople people={data.people} title="Responsáveis" compact />
        {pdf && <DocumentViewer pdf={pdf} externalLink={external || pdf} />}
        {!pdf && external && (
          <Links>
            <a href={external} target="_blank" rel="noopener noreferrer">
              Acessar material
            </a>
          </Links>
        )}
        {!pdf && !external && (
          <p>Nenhum arquivo ou link disponível no momento.</p>
        )}
        <Comments targetType="RESEARCH_INSTRUMENT" targetId={data.id} />
      </Content>
    </Container>
  );
}
