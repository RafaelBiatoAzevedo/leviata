import { DossierCard } from "../../components/DossierCard";
import { ParagraphText } from "../../components/ParagraphText";
import { SectionHeader } from "../../components/SectionHeader";
import { Container, Content, DossiersGrid } from "./styles";

const dossiersMock = [
  { id: 1, title: "Dossiês Escravidão", startYaer: 1983, endYear: 2025 },
  { id: 2, title: "Dossiês Família", startYaer: 2017, endYear: 2024 },
  { id: 3, title: "Dossiês Polícia", startYaer: 1998, endYear: 2023 },
  { id: 4, title: "Dossiês Crime", startYaer: 1928, endYear: 2023 },
  { id: 5, title: "Dossiês Imprensa", startYaer: 2019, endYear: 2023 },
];

const text = ` As planilhas disponibilizadas (nos cartões abaixo) visam facilitar o
          acesso dos públicos especializado e não-especializado aos trabalhos
          acadêmicos relacionados à Escravidão, à Polícia, à Família, à
          Imprensa, entre outras temáticas estudadas pelos pesquisadores do
          grupo.\n
           Os materiais trazem dossiês publicados em revistas da área de
          história, contemplando estudos dos mais recentes aos mais antigos,
          além de análises nacionais e internacionais. Nosso intuito é auxiliar
          trabalhos acadêmicos em andamento, promover novas pesquisas e debates
          na área, bem como auxiliar professores do ensino básico e os
          interessados em geral nos temas por nós estudados. Buscamos, em suma,
          contribuir com a valorização do conhecimento histórico em nossa
          sociedade.`;

export function BibliographicSpreadsheets() {
  return (
    <Container>
      <Content>
        <SectionHeader center title="Planilhas biblio-temáticas" />
        <ParagraphText text={text} />

        <DossiersGrid>
          {dossiersMock.map((dossier) => (
            <DossierCard
              id={dossier.id}
              title={dossier.title}
              startYear={dossier.startYaer}
              endYear={dossier.endYear}
            />
          ))}
        </DossiersGrid>
      </Content>
    </Container>
  );
}
