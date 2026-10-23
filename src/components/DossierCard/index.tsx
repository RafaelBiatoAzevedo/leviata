import {
  FiArchive,
  FiArrowRight,
  FiBookOpen,
  FiDatabase,
} from "react-icons/fi";
import {
  ResearchInstrumentType,
  researchInstrumentTypeLabels,
  type TResearchInstrumentType,
} from "../../admin/types/TResearchInstrumentType";
import {
  researchInstrumentPath,
  researchInstrumentPeriod,
} from "../../utils/researchInstruments";

import {
  Container,
  Header,
  IconWrapper,
  HeaderLabel,
  Reference,
  Content,
  Title,
  Period,
  Footer,
  ReadMore,
  LinkArrow,
} from "./styles";

interface IDossierCardProps {
  id: string;
  slug?: string;
  type?: TResearchInstrumentType;
  reference?: number;
  title: string;
  startYear?: number | null;
  endYear?: number | null;
}

export function DossierCard({
  id,
  slug,
  type = ResearchInstrumentType.DOSSIER,
  reference,
  title,
  startYear,
  endYear,
}: IDossierCardProps) {
  const Icon =
    type === ResearchInstrumentType.CATALOG
      ? FiBookOpen
      : type === ResearchInstrumentType.DATABASE
        ? FiDatabase
        : FiArchive;
  const period = researchInstrumentPeriod(startYear, endYear);
  const label = researchInstrumentTypeLabels[type];
  return (
    <Container to={researchInstrumentPath(type, slug || id)}>
      <Header>
        <IconWrapper aria-hidden="true">
          <Icon />
        </IconWrapper>
        <HeaderLabel>{label}</HeaderLabel>
        {reference != null && (
          <Reference aria-hidden="true">
            {String(reference).padStart(2, "0")}
          </Reference>
        )}
      </Header>

      <Content>
        <Title title={title}>{title}</Title>

        {period && (
          <Period>
            <span>Período</span>
            <strong>{period}</strong>
          </Period>
        )}

        <Footer>
          <ReadMore>Ver detalhes</ReadMore>
          <LinkArrow aria-hidden="true">
            <FiArrowRight />
          </LinkArrow>
        </Footer>
      </Content>
    </Container>
  );
}
