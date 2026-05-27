import { LinkCard } from "../../components/LinkCard";
import { SectionHeader } from "../../components/SectionHeader";
import { Container, Content, ThematicLinesGrid } from "./styles";

const thematicLines = [
  {
    id: 1,
    acronym: "CSA",
    description: "Cativeiro, saúde e alimentação: séculos XVII e XVIII",
  },
  {
    id: 2,
    acronym: "MCE",
    description:
      "Monarquia, Cristianismo e Escravidão no Mundo Luso-brasileiro (séculos XVII e XVIII)",
  },
  {
    id: 3,
    acronym: "EIE",
    description: "Estado, Imprensa e Escravidão no Brasil do Século XIX",
  },
];

export function ThematicLines() {
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
          {thematicLines.map((thematic) => (
            <LinkCard
              to={`/grupo/linhas-tematicas/tematica/${thematic.id}`}
              acronym={thematic.acronym}
              description={thematic.description}
            />
          ))}
        </ThematicLinesGrid>
      </Content>
    </Container>
  );
}
