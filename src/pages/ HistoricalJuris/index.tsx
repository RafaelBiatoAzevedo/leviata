import { Navigation, Pagination } from "swiper/modules";
import { HistoryDivider } from "../../components/HistotyDivider";
import { ParagraphText } from "../../components/ParagraphText";
import { SectionHeader } from "../../components/SectionHeader";
import { Container, Content, Grid, Label } from "./styles";
import { Swiper, SwiperSlide } from "swiper/react";
import { Carousel } from "../../components/Carousel";
import { ImageCard } from "../../components/ImageCard";
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

import image7 from "../../assets/images/jurisList/Arte-Juri-2025.webp";
import image6 from "../../assets/images/jurisList/Aula-Preparatoria-1.webp";
import image9 from "../../assets/images/jurisList/II-Juri-2024-3.webp";
import image8 from "../../assets/images/jurisList/II-Juri-2024-5.webp";
import image10 from "../../assets/images/jurisList/II-Processo Juri-2024-1.webp";
import image2 from "../../assets/images/jurisList/III-Juri-Historico-2025-2.webp";
import image1 from "../../assets/images/jurisList/III-Juri-Historico-2025.webp";
import image4 from "../../assets/images/jurisList/Iolanda-Ribeiro-Acusacao.webp";
import image12 from "../../assets/images/jurisList/Juri-2018-2.webp";
import image11 from "../../assets/images/jurisList/Juri-2018.webp";
import image5 from "../../assets/images/jurisList/Processo-Criminal-Franca-1885-1886.webp";
import image3 from "../../assets/images/jurisList/Samuel-Ribeiro-Defesa.webp";

const imagesMock = [
  {
    imageUrl: image1,
    description: "III Júri Histórico 2005",
  },
  {
    imageUrl: image2,
    description: "III Júri Histórico 2025\nPúblico",
  },
  {
    imageUrl: image3,
    description: "III Júri Histórico 2025\nSamuel Ribeiro - Defesa",
  },
  {
    imageUrl: image4,
    description: "III Júri Histórico 2025\nIolanda Ribeiro - Acusação",
  },

  {
    imageUrl: image5,
    description: "III Júri Histórico 2025\nProcesso Criminal",
  },
  {
    imageUrl: image6,
    description: "III Júri Histórico 2025\nArte preparatória",
  },
  {
    imageUrl: image7,
    description: "III Júri Histórico 2025\nArte",
  },
  {
    imageUrl: image8,
    description: "II Júri Histórico 2024\nUNESP/Franca",
  },
  {
    imageUrl: image9,
    description: "II Júri Histórico 2024\nUNESP/Franca",
  },
  {
    imageUrl: image10,
    description: "II Júri Histórico 2024\nProcesso criminal",
  },
  {
    imageUrl: image11,
    description: "I Júri Histórico 2018",
  },
  {
    imageUrl: image12,
    description: "I Júri Histórico 2018",
  },
];

const juris = [
  { id: 1, title: "III Júri Histórico", date: "2025" },
  { id: 2, title: "II Júri Histórico", date: "2024" },
  { id: 3, title: "I Júri Histórico", date: "2018" },
];

export function HistoricalJuris() {
  return (
    <Container>
      <Content>
        <SectionHeader center title="Júris Históricos" />

        <ParagraphText text={text} />

        <HistoryDivider />
        <Label>Júris</Label>

        <Grid>
          {juris.map((juri, index) => (
            <LinkCard
              key={index}
              to={`/atividades/juris-historicos/juris/${juri.id}`}
              icon={<GiInjustice />}
              title={juri.title}
              description={juri.date}
            ></LinkCard>
          ))}
        </Grid>

        <Label>Fotos</Label>
        <Carousel>
          <Swiper
            modules={[Pagination, Navigation]}
            slidesPerView={"auto"}
            spaceBetween={50}
            loop
            navigation
            pagination={{
              clickable: true,
            }}
            style={{ alignItems: "stretch" }}
          >
            {imagesMock.map((imageMock, index) => (
              <SwiperSlide
                key={index}
                style={{
                  width: "400px",
                  height: "auto",
                  display: "flex",
                  alignItems: "stretch",
                }}
              >
                <ImageCard {...imageMock} />
              </SwiperSlide>
            ))}
          </Swiper>
        </Carousel>
      </Content>
    </Container>
  );
}
