import { HistoryDivider } from "../../components/HistotyDivider";
import { ParagraphText } from "../../components/ParagraphText";
import { SectionHeader } from "../../components/SectionHeader";
import { Container, Content } from "./styles";

const text = `“Júris Históricos: reflexões críticas sobre passado, presente, história e justiça no Brasil” 
    é um projeto que teve início em 2018, com a realização de um Júri Simulado baseado em um processo criminal 
    de 1848. A atividade é uma iniciativa dos professores doutores Ricardo Alexandre Ferreira e Paulo Cesar Correia 
    Borges, dos cursos de graduação e de pós-graduação em História e Direito do UNESP/campus de Franca.\n
    Lançamos mão de processos criminais instaurados na Comarca de Franca durante o século XIX, lotados no 
    Arquivo Histórico Municipal “Capitão Hipólito Antônio Pinheiro”, para a apuração de crimes de homicídio, 
    reproduzindo os julgamentos com alunos e com a participação da comunidade externa à UNESP, além de colocar 
    em debate questões atuais como racismo, criminalidade e o lugar da mulher na sociedade.`;

export function HistoricalJuris() {
  return (
    <Container>
      <Content>
        <SectionHeader center title="Júris Históricos" />

        <ParagraphText text={text} />

        <HistoryDivider />

        <SectionHeader title="Pesquisadores" />

        <SectionHeader title="Discentes" />

        <SectionHeader title="Apoiadores" />

        <SectionHeader title="Fotos" />
      </Content>
    </Container>
  );
}
