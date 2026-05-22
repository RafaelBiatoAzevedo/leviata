import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { SectionHeader } from "../../components/SectionHeader";
import { BookCard } from "../../components/BookCard";

import bookLary from "../../assets/images/bookLary.webp";
import bookGabriel from "../../assets/images/bookGabriel.webp";
import bookMaria from "../../assets/images/bookMaria.webp";
import bookMarilia from "../../assets/images/bookMarilia.webp";

import {
  Container,
  Content,
  Tabs,
  TabButton,
  Timeline,
  TimelineItem,
  TimelineDot,
  TimelineContent,
  TimelineYear,
  TimelineTitle,
  TimelineDescription,
  CarouselWrapper,
  Carousel,
} from "./styles";

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

const articlesMock = [
  {
    title: "Estado Moderno e Escravidão",
    author: "Maria Silva",
    year: "2026",
    cover: "/images/book.jpg",
    to: "#",
  },
];

const dossiersMock = [
  {
    title: "Dossiê Colonial",
    author: "Grupo Leviatã",
    year: "2024",
    cover: "/images/book.jpg",
    to: "#",
  },
];

const presentationsMock = [
  {
    year: "2026",
    title: "Seminário Internacional de História Atlântica",
    description:
      "Apresentação sobre instituições luso-brasileiras e escravidão.",
  },

  {
    year: "2025",
    title: "Encontro de Pesquisa Colonial",
    description: "Debates sobre memória, arquivos e sociedade escravista.",
  },

  {
    year: "2024",
    title: "Congresso de História Moderna",
    description: "Discussão sobre estruturas do Estado Moderno.",
  },
  {
    year: "2023",
    title: "Seminário Internacional de História Atlântica",
    description:
      "Apresentação sobre instituições luso-brasileiras e escravidão.",
  },

  {
    year: "2022",
    title: "Encontro de Pesquisa Colonial",
    description: "Debates sobre memória, arquivos e sociedade escravista.",
  },

  {
    year: "2020",
    title: "Congresso de História Moderna",
    description: "Discussão sobre estruturas do Estado Moderno.",
  },
];

type TabType = "livros" | "artigos" | "apresentacoes" | "dossies";

export function Publications() {
  const [activeTab, setActiveTab] = useState<TabType>("livros");

  return (
    <Container>
      <Content>
        <SectionHeader
          title="Publicações"
          subtitle="Explore as produções acadêmicas desenvolvidas pelo grupo, reunindo livros, artigos, apresentações de trabalho e dossiês relacionados às pesquisas sobre Estado Moderno e escravidão."
        />

        <Tabs>
          <TabButton
            $active={activeTab === "livros"}
            onClick={() => setActiveTab("livros")}
          >
            Livros
          </TabButton>

          <TabButton
            $active={activeTab === "artigos"}
            onClick={() => setActiveTab("artigos")}
          >
            Artigos
          </TabButton>

          <TabButton
            $active={activeTab === "apresentacoes"}
            onClick={() => setActiveTab("apresentacoes")}
          >
            Apresentações de Trabalhos
          </TabButton>

          <TabButton
            $active={activeTab === "dossies"}
            onClick={() => setActiveTab("dossies")}
          >
            Dossiês
          </TabButton>
        </Tabs>

        {activeTab === "livros" && (
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
        )}

        {activeTab === "artigos" && (
          <CarouselWrapper>
            <Swiper
              modules={[Navigation, Pagination]}
              slidesPerView={"auto"}
              spaceBetween={40}
              navigation
              pagination={{ clickable: true }}
            >
              {articlesMock.map((article, index) => (
                <SwiperSlide key={index} style={{ width: "300px" }}>
                  <BookCard {...article} />
                </SwiperSlide>
              ))}
            </Swiper>
          </CarouselWrapper>
        )}

        {activeTab === "dossies" && (
          <CarouselWrapper>
            <Swiper
              modules={[Navigation, Pagination]}
              slidesPerView={"auto"}
              spaceBetween={40}
              navigation
              pagination={{ clickable: true }}
            >
              {dossiersMock.map((dossier, index) => (
                <SwiperSlide key={index} style={{ width: "300px" }}>
                  <BookCard {...dossier} />
                </SwiperSlide>
              ))}
            </Swiper>
          </CarouselWrapper>
        )}

        {activeTab === "apresentacoes" && (
          <Timeline>
            {presentationsMock.map((presentation, index) => (
              <TimelineItem key={index}>
                <TimelineDot />

                <TimelineContent>
                  <TimelineYear>{presentation.year}</TimelineYear>

                  <TimelineTitle>{presentation.title}</TimelineTitle>

                  <TimelineDescription>
                    {presentation.description}
                  </TimelineDescription>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        )}
      </Content>
    </Container>
  );
}
