import styled from "styled-components";
import type { PersonResponseDto } from "../../admin/dtos/people/PersonResponseDto";
import { portalGrid } from "../../styles/portal";
import { PersonCard } from "../PersonCard";
import { PersonProfile } from "../PersonProfile";
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
const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  min-width: 0;
`;

export function PublicPeople({
  people = [],
  title = "Pesquisadores",
  compact = false,
}: {
  people?: Partial<PersonResponseDto>[];
  title?: string;
  compact?: boolean;
}) {
  const records = people.flatMap((person) =>
    person?.name?.trim() ? [{ ...person, name: person.name.trim() }] : [],
  );
  if (!records.length) return null;
  const List = compact ? Column : Grid;
  return (
    <Section>
      <SectionHeader as="h2" small title={title} />
      <List>
        {records.map((person, index) =>
          compact ? (
            <PersonProfile
              key={person.id || `${person.name}-${index}`}
              person={person}
              showBio={false}
            />
          ) : (
            <PersonCard
              key={person.id || `${person.name}-${index}`}
              {...person}
            />
          ),
        )}
      </List>
    </Section>
  );
}
