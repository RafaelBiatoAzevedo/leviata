import { PresentedWorksTimeline } from "../../components/PresentedWorksTimeline";
import { SectionHeader } from "../../components/SectionHeader";
import { Container, Content } from "../Schecdule/styles";

export function PresentedWorks() {
  return (
    <Container>
      <Content>
        <SectionHeader
          title="Apresentações de trabalhos"
          subtitle="A pesquisa do grupo em diálogo com outros públicos. Conheça as próximas apresentações, os trabalhos já apresentados e seus registros."
        />
        <PresentedWorksTimeline />
      </Content>
    </Container>
  );
}
