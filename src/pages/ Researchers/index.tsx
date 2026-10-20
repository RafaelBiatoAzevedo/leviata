import { useCallback, useEffect, useState } from "react";
import { HistoryDivider } from "../../components/HistotyDivider";
import { PersonCard } from "../../components/PersonCard";
import { SectionHeader } from "../../components/SectionHeader";
import { Container, Content, Grid } from "./styles";
import type { PersonResponseDto } from "../../admin/dtos/people/PersonResponseDto";
import { peopleService } from "../../admin/services/people";

export function Researchers() {
  const [loading, setLoading] = useState(false);
  const [nationalsResearchers, setNationalsResearchers] = useState(
    [] as PersonResponseDto[],
  );
  const [internatinalsResearchers, setInternatinalsResearchers] = useState(
    [] as PersonResponseDto[],
  );

  function filterPeople(people: PersonResponseDto[]) {
    const nationalsPeople = people.filter(
      (person) => person.nationality?.code === "BR",
    );

    const internationalsPeople = people.filter(
      (person) => person.nationality?.code !== "BR",
    );

    return { nationalsPeople, internationalsPeople };
  }

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const people = await peopleService.getAllAvailable();

      const { internationalsPeople, nationalsPeople } = filterPeople(
        people,
      );

      setNationalsResearchers(nationalsPeople);
      setInternatinalsResearchers(internationalsPeople);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, [load]);

  return (
    <Container>
      <Content>
        <SectionHeader
          title="Pesquisadores"
          subtitle="Conheça os pesquisadores que compõem o grupo e contribuem para a
            construção do acervo histórico e acadêmico."
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
