import { ThematicLinkCard } from "../../components/ThematicLinkCard";
import { SectionHeader } from "../../components/SectionHeader";
import { Container, Content, ThematicLinesGrid } from "./styles";
import { useThematics } from "../../hooks/useThematics";
import { thematicAcronym } from "../../utils/thematics";

export function ThematicLines() {
  const { thematics, loading, error } = useThematics();
  return (
    <Container>
      <Content>
        <SectionHeader
          title="Linhas Temáticas"
          subtitle="Conheça as principais linhas de investigação que orientam as
            pesquisas do grupo, abrangendo diferentes abordagens da história,
            memória e construção do conhecimento histórico."
        />

        <ThematicLinesGrid>
          {loading && <p>Carregando linhas temáticas...</p>}
          {error && <p role="alert">{error}</p>}
          {!loading && !error && !thematics.length && (
            <p>Nenhuma linha temática cadastrada.</p>
          )}
          {thematics.map((thematic) => (
            <ThematicLinkCard
              key={thematic.id}
              to={`/grupo/linhas-tematicas/tematica/${thematic.slug}`}
              acronym={thematicAcronym(thematic.title)}
              description={thematic.title}
            />
          ))}
        </ThematicLinesGrid>
      </Content>
    </Container>
  );
}
