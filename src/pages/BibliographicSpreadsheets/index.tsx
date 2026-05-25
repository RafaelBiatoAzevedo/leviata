import { SectionHeader } from "../../components/SectionHeader";
import { Container, Content, Paragraph } from "./styles";

export function BibliographicSpreadsheets() {
  return (
    <Container>
      <Content>
        <SectionHeader title="Planilhas biblio-temáticas" />
        <Paragraph>
          As planilhas disponibilizadas (navegue pelo menu) visam facilitar o
          acesso dos públicos especializado e não-especializado aos trabalhos
          acadêmicos relacionados à Escravidão, à Polícia, à Família, à
          Imprensa, entre outras temáticas estudadas pelos pesquisadores do
          grupo.
        </Paragraph>
        <Paragraph>
          Os materiais trazem dossiês publicados em revistas da área de
          história, contemplando estudos dos mais recentes aos mais antigos,
          além de análises nacionais e internacionais. Nosso intuito é auxiliar
          trabalhos acadêmicos em andamento, promover novas pesquisas e debates
          na área, bem como auxiliar professores do ensino básico e os
          interessados em geral nos temas por nós estudados. Buscamos, em suma,
          contribuir com a valorização do conhecimento histórico em nossa
          sociedade.
        </Paragraph>
      </Content>
    </Container>
  );
}
