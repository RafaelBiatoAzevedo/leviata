import { HistoryDivider } from "../../components/HistotyDivider";
import { PersonCard } from "../../components/PersonCard";
import { SectionHeader } from "../../components/SectionHeader";
import { Container, Content, Grid } from "./styles";
import type { PersonResponseDto } from "../../admin/dtos/people/PersonResponseDto";
import { usePublicList } from "../../hooks/usePublicData";
import { PublicDataState } from "../../components/PublicDataState";
import { PersonCategory } from "../../admin/types/TPersonCategory";

export function Researchers() {
  const {
    data: people,
    loading,
    error,
  } = usePublicList<PersonResponseDto>("people", {
    isActive: "true",
    sortBy: "displayOrder",
    sortOrder: "asc",
  });
  const activeResearchers = people.filter(
    (person) =>
      person.isActive === true && person.category !== PersonCategory.DISCENTE,
  );
  const nationalsResearchers = activeResearchers.filter(
    (person) => person.nationality?.code === "BR",
  );
  const internatinalsResearchers = activeResearchers.filter(
    (person) => person.nationality?.code !== "BR",
  );
  return (
    <Container>
      <Content>
        <SectionHeader
          title="Pesquisadores"
          subtitle="Conheça os pesquisadores que compõem o grupo e contribuem para a
            construção do acervo histórico e acadêmico."
        />

        <PublicDataState
          loading={loading}
          error={error}
          empty={!activeResearchers.length}
          label="os pesquisadores"
        />
        {!loading && (
          <Grid>
            {nationalsResearchers.map((person) => (
              <PersonCard key={person.id} {...person} />
            ))}
          </Grid>
        )}

        <HistoryDivider />

        <SectionHeader
          as="h2"
          title="Colaboradores Internacionais"
          subtitle="Conheça os pesquisadores e instituições parceiras internacionais que
            colaboram com o grupo na construção e intercâmbio de conhecimentos
            históricos e acadêmicos."
        />

        {!loading && (
          <Grid>
            {internatinalsResearchers.map((person) => (
              <PersonCard key={person.id} {...person} />
            ))}
          </Grid>
        )}
      </Content>
    </Container>
  );
}
