import {
  Carousel,
  Container,
  Content,
  ImageHero,
  LinesLInksWrapper,
} from "./styles";
import leviataHero from "../../assets/images/leviataHero.webp";

import bookLary from "../../assets/images/bookLary.webp";
import bookGabriel from "../../assets/images/bookGabriel.webp";
import bookMaria from "../../assets/images/bookMaria.webp";
import bookMarilia from "../../assets/images/bookMarilia.webp";

import groupLeviata from "../../assets/images/grupoLeviataEncontro.webp";
import projectJuris from "../../assets/images/ProjetoJuris.webp";
import simposio from "../../assets/images/Simposio.webp";
import meetLeviata from "../../assets/images/leviataEncrontro.webp";

import { Button } from "../../components/Button";
import { LinkCard } from "../../components/LinkCard";
import { BookCard } from "../../components/BookCard";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { NewsCard } from "../../components/NewsCard";
import { HistoryDivider } from "../../components/HistotyDivider";
import { SectionHeader } from "../../components/SectionHeader";

const booksMocks = [
  {
    author: "Gabriel Ferreira Gurian",
    title: "Do conflito e do convívio",
    to: "https://livraria.cepe.com.br/do-conflito-e-do-convivio",
    year: 2026,
    cover: bookGabriel,
  },
  {
    author: "Larissa Biato de Azevedo",
    title: "Policiar no tempo da escravidão",
    to: "https://edufscar.com.br/policiar-no-tempo-da-escravidao-502000057",
    year: 2025,
    cover: bookLary,
  },
  {
    author: "Maria Isabela da Silva Gomes",
    title: "Dicionário Histórias entrelaçadas de mulheres afrodiaspóricas",
    to: "https://www.editoramale.com.br/product-page/dicion%C3%A1rio-biogr%C3%A1fico-hist%C3%B3rias-entrela%C3%A7adas-de-mulheres-afrodiasp%C3%B3ricas-vol-2",
    year: 2025,
    cover: bookMaria,
  },
  {
    author: "Marília Tofanetto Alves",
    title: "Concubinato: a bastardia tingida pela cor",
    to: "https://www.amazon.com.br/dp/8546229406",
    year: 2025,
    cover: bookMarilia,
  },
  {
    author: "Gabriel Ferreira Gurian",
    title: "Do conflito e do convívio",
    to: "https://livraria.cepe.com.br/do-conflito-e-do-convivio",
    year: 2026,
    cover: bookGabriel,
  },
  {
    author: "Larissa Biato de Azevedo",
    title: "Policiar no tempo da escravidão",
    to: "https://edufscar.com.br/policiar-no-tempo-da-escravidao-502000057",
    year: 2025,
    cover: bookLary,
  },
  {
    author: "Maria Isabela da Silva Gomes",
    title: "Dicionário Histórias entrelaçadas de mulheres afrodiaspóricas",
    to: "https://www.editoramale.com.br/product-page/dicion%C3%A1rio-biogr%C3%A1fico-hist%C3%B3rias-entrela%C3%A7adas-de-mulheres-afrodiasp%C3%B3ricas-vol-2",
    year: 2025,
    cover: bookMaria,
  },
  {
    author: "Marília Tofanetto Alves",
    title: "Concubinato: a bastardia tingida pela cor",
    to: "https://www.amazon.com.br/dp/8546229406",
    year: 2025,
    cover: bookMarilia,
  },
];

const newsMocks = [
  {
    image: groupLeviata,
    to: "https://leviataeocativeiro.com.br/2026/05/15/ii-encontro-internacional-do-grupo-leviata-e-o-cativeiro/",
    date: "15 de maio de 2026",
    title: "II Encontro Internacional do Grupo Leviatã e o Cativeiro",
    description:
      "Aconteceu, entre os dias 5 e 7 de maio de 2026, o II Encontro do Grupo de Pesquisa Leviatã e…",
  },
  {
    image: projectJuris,
    to: "https://leviataeocativeiro.com.br/2026/05/08/projeto-juris-historicos-recebe-certificacao-ods/",
    date: "8 de maio de 2026",
    title: "Projeto “Júris Históricos” recebe certificação ODS",
    description:
      "O Projeto de extensão universitária “Júris Históricos” recebeu o Selo ODS Educação pelas ações realizadas no ano de…",
  },
  {
    image: simposio,
    to: "https://leviataeocativeiro.com.br/2026/04/20/iii-simposio-do-lhpl-ufes/",
    date: "20 de abril de 2026",
    title: "III Simpósio do LHPL – UFES",
    description:
      "Entre os dias 14 e 15 de abril de 2026, Ricardo Alexandre Ferreira e Larissa Biato de Azevedo participaram…",
  },
  {
    image: meetLeviata,
    to: "https://leviataeocativeiro.com.br/2026/04/06/ii-encontro-internacional-do-grupo-de-pesquisa-leviata-e-o-cativeiro/",
    date: "8 de maio de 2026",
    title:
      "II Encontro Internacional do Grupo de Pesquisa Leviatã e o Cativeiro",
    description:
      "Encontram-se abertas as inscrições para o II Encontro Internacional do Grupo de Pesquisa Leviatã e o Cativeiro – Mobilidades, Experiências…",
  },
  {
    image: groupLeviata,
    to: "https://leviataeocativeiro.com.br/2026/05/15/ii-encontro-internacional-do-grupo-leviata-e-o-cativeiro/",
    date: "15 de maio de 2026",
    title: "II Encontro Internacional do Grupo Leviatã e o Cativeiro",
    description:
      "Aconteceu, entre os dias 5 e 7 de maio de 2026, o II Encontro do Grupo de Pesquisa Leviatã e…",
  },
  {
    image: projectJuris,
    to: "https://leviataeocativeiro.com.br/2026/05/08/projeto-juris-historicos-recebe-certificacao-ods/",
    date: "8 de maio de 2026",
    title: "Projeto “Júris Históricos” recebe certificação ODS",
    description:
      "O Projeto de extensão universitária “Júris Históricos” recebeu o Selo ODS Educação pelas ações realizadas no ano de…",
  },
  {
    image: simposio,
    to: "https://leviataeocativeiro.com.br/2026/04/20/iii-simposio-do-lhpl-ufes/",
    date: "20 de abril de 2026",
    title: "III Simpósio do LHPL – UFES",
    description:
      "Entre os dias 14 e 15 de abril de 2026, Ricardo Alexandre Ferreira e Larissa Biato de Azevedo participaram…",
  },
  {
    image: meetLeviata,
    to: "https://leviataeocativeiro.com.br/2026/04/06/ii-encontro-internacional-do-grupo-de-pesquisa-leviata-e-o-cativeiro/",
    date: "8 de maio de 2026",
    title:
      "II Encontro Internacional do Grupo de Pesquisa Leviatã e o Cativeiro",
    description:
      "Encontram-se abertas as inscrições para o II Encontro Internacional do Grupo de Pesquisa Leviatã e o Cativeiro – Mobilidades, Experiências…",
  },
];

export function Home() {
  return (
    <Container>
      <ImageHero src={leviataHero}></ImageHero>
      <Content>
        <h1>
          Criado em 2019, o grupo de pesquisa “Leviatã e o Cativeiro” reúne
          pesquisadores em torno do binômio temático Estado Moderno e
          escravidão. Ao considerar um largo arco temporal, que vai do século
          XVI ao XIX, nossas pesquisas procuram analisar a relação entre as
          diversas instituições luso-brasileiras – Inquisição, família, polícia,
          Imprensa – e a escravidão de africanos e descendentes.
        </h1>
        <Button title="Saiba mais"></Button>
        <HistoryDivider />
        <SectionHeader
          center
          title="Linhas Temáticas"
          subtitle="Conheça as principais linhas de investigação que orientam as
            pesquisas do grupo, abrangendo diferentes abordagens da história,
            memória e construção do conhecimento histórico."
        />
        <LinesLInksWrapper>
          <LinkCard
            to="/grupo/pesquisadores"
            acronym="CSA"
            description="Cativeiro, saúde e alimentação: séculos XVII e XVIII"
          ></LinkCard>
          <LinkCard
            to="/grupo/pesquisadores"
            acronym="MCE"
            description="Monarquia, Cristianismo e Escravidão no Mundo Luso-brasileiro (séculos XVII e XVIII)"
          ></LinkCard>
          <LinkCard
            to="/grupo/pesquisadores"
            acronym="EIE"
            description="Estado, Imprensa e Escravidão no Brasil do Século XIX"
          ></LinkCard>
        </LinesLInksWrapper>
        <HistoryDivider />
        <h1>Publicações recentes</h1>

        <Carousel>
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            slidesPerView={"auto"}
            spaceBetween={50}
            loop
            navigation
            speed={700}
            pagination={{
              clickable: true,
            }}
            // autoplay={{
            //   delay: 3000,
            //   disableOnInteraction: false,
            // }}
          >
            {booksMocks.map((book, index) => (
              <SwiperSlide key={index} style={{ width: "350px" }}>
                <BookCard {...book} />
              </SwiperSlide>
            ))}
          </Swiper>
        </Carousel>
        <Button title="Mais"></Button>
        <HistoryDivider />
        <SectionHeader
          center
          title="Notícias"
          subtitle="As notícias reúnem atualizações sobre as atividades, pesquisas, eventos e produções do grupo “Leviatã e o Cativeiro”, que desde 2019 investiga o Estado Moderno e a escravidão entre os séculos XVI e XIX, com foco nas instituições luso-brasileiras e suas relações com a experiência da escravização de africanos e seus descendentes."
        />

        <Carousel>
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            slidesPerView={"auto"}
            spaceBetween={50}
            loop
            navigation
            speed={700}
            pagination={{
              clickable: true,
            }}
            // autoplay={{
            //   delay: 3000,
            //   disableOnInteraction: false,
            // }}
            style={{ alignItems: "stretch" }}
          >
            {newsMocks.map((newMock, index) => (
              <SwiperSlide
                key={index}
                style={{
                  width: "350px",
                  height: "auto",
                  display: "flex",
                  alignItems: "stretch",
                }}
              >
                <NewsCard {...newMock} />
              </SwiperSlide>
            ))}
          </Swiper>
        </Carousel>
      </Content>
    </Container>
  );
}
