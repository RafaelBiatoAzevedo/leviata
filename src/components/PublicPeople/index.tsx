import styled from "styled-components";
import type { PersonResponseDto } from "../../admin/dtos/people/PersonResponseDto";
import { portalGrid } from "../../styles/portal";
import { PersonCard } from "../PersonCard";
import { SectionHeader } from "../SectionHeader";

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 1080px;
`;
const Grid = styled.div`
  ${portalGrid}
`;

export function PublicPeople({
  people = [],
  title = "Pesquisadores",
}: {
  people?: Partial<PersonResponseDto>[];
  title?: string;
}) {
  const records = people.flatMap((person) =>
    person?.name?.trim() ? [{ ...person, name: person.name.trim() }] : [],
  );
  if (!records.length) return null;
  return (
    <Section>
      <SectionHeader as="h2" small title={title} />
      <Grid>
        {records.map((person, index) => (
          <PersonCard
            key={person.id || `${person.name}-${index}`}
            {...person}
          />
        ))}
      </Grid>
    </Section>
  );
}
