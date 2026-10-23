import styled from "styled-components";
import type { ResearchInstrumentResponseDto } from "../../admin/dtos/researchInstruments/ResearchInstrumentResponseDto";
import type { TResearchInstrumentType } from "../../admin/types/TResearchInstrumentType";
import { usePublicList } from "../../hooks/usePublicData";
import { Container, Content } from "../GalleryDetails/styles";
import { SectionHeader } from "../SectionHeader";
import { ParagraphText } from "../ParagraphText";
import { DossierCard } from "../DossierCard";
import { PublicDataState } from "../PublicDataState";

const Grid = styled.div`
  display: flex;
  justify-content: center;
  align-items: stretch;
  flex-wrap: wrap;
  gap: 24px;
  width: 100%;
`;

export function ResearchInstrumentList({
  type,
  title,
  intro,
}: {
  type: TResearchInstrumentType;
  title: string;
  intro?: string;
}) {
  const { data, loading, error } = usePublicList<ResearchInstrumentResponseDto>(
    "researchInstruments",
    { type },
  );
  const records = data.filter((record) => record.type === type);
  return (
    <Container>
      <Content>
        <SectionHeader center title={title} />
        {intro && <ParagraphText text={intro} />}
        <PublicDataState
          loading={loading}
          error={error}
          empty={!records.length}
          label="os instrumentos de pesquisa"
        />
        <Grid>
          {records.map((record, index) => (
            <DossierCard key={record.id} {...record} reference={index + 1} />
          ))}
        </Grid>
      </Content>
    </Container>
  );
}
