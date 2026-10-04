import { usePublicList } from "../../hooks/usePublicData";
import type { JuryResponseDto } from "../../admin/dtos/juries/JuryResponseDto";
import { ImageGallery } from "../../components/ImageGallery";
import { Loading } from "../../components/Loading";
import { HistoryDivider } from "../../components/HistotyDivider";
import { ParagraphText } from "../../components/ParagraphText";
import { SectionHeader } from "../../components/SectionHeader";
import { Container, Content, Grid, Label } from "./styles";
import { LinkCard } from "../../components/LinkCard";
import { GiInjustice } from "react-icons/gi";

const text = `“Júris Históricos: reflexões críticas sobre passado, presente, história e justiça no Brasil” 
    é um projeto que teve início em 2018, com a realização de um Júri Simulado baseado em um processo criminal 
    de 1848. A atividade é uma iniciativa dos professores doutores Ricardo Alexandre Ferreira e Paulo Cesar Correia 
    Borges, dos cursos de graduação e de pós-graduação em História e Direito do UNESP/campus de Franca.\n
    Lançamos mão de processos criminais instaurados na Comarca de Franca durante o século XIX, lotados no 
    Arquivo Histórico Municipal “Capitão Hipólito Antônio Pinheiro”, para a apuração de crimes de homicídio, 
    reproduzindo os julgamentos com alunos e com a participação da comunidade externa à UNESP, além de colocar 
    em debate questões atuais como racismo, criminalidade e o lugar da mulher na sociedade.`;

export function HistoricalJuries() {
  const {
    data: juris,
    loading,
    error,
  } = usePublicList<JuryResponseDto>("juries");
  const images = Array.from(
    new Map(
      juris
        .flatMap((jury) => jury.images ?? [])
        .map((image) => [image.id, image]),
    ).values(),
  );
  return (
    <Container>
      <Content>
        <SectionHeader center title="Júris Históricos" />

        <ParagraphText text={text} />

        <HistoryDivider />
        <Label>Júris</Label>

        {loading && <Loading />}
        {error && <p>Não foi possível carregar os júris.</p>}
        {!loading && !error && juris.length === 0 && (
          <p>Nenhum júri disponível.</p>
        )}
        <Grid>
          {juris.map((juri) => (
            <LinkCard
              key={juri.id}
              to={`/atividades/juris-historicos/juris/${juri.slug}`}
              icon={<GiInjustice />}
              title={juri.title}
              description={new Date(juri.date).toLocaleDateString("pt-BR", {
                timeZone: "America/Sao_Paulo",
              })}
            ></LinkCard>
          ))}
        </Grid>

        {images.length > 0 && (
          <>
            <Label>Fotos</Label>
            <ImageGallery images={images} />
          </>
        )}
      </Content>
    </Container>
  );
}
