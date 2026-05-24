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
  Carousel,
} from "./styles";
import { ArticleCard } from "../../components/Articles";

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
    title:
      "No rastro da criança escrava: os percursos do historiador Manolo Garcia Florentino",
    author: "Mariana de Oliveira Lima",
    journal: "Revista Epígrafe",
    volume: "v. 14",
    year: "2025",
    cover: "/images/articles/epigrafe.jpg",
    to: "#",
  },

  {
    title:
      "‘Toda a vigilância policial’: O contrabando de africanos no expediente das primeiras autoridades policiais do Império brasileiro (1827-1841)",
    author: "Larissa Biato de Azevedo",
    journal: "Revista Varia Historia",
    volume: "v. 41",
    year: "2025",
    cover: "/images/articles/varia-historia.jpg",
    to: "#",
  },

  {
    title: "As Luzes em perspectiva: o caso português",
    author: "Marília Tofanetto Alves e Maria Fernanda Minutti Teixeira",
    journal: "Revista Albuquerque",
    volume: "v. 17",
    year: "2025",
    cover: "/images/articles/albuquerque.jpg",
    to: "#",
  },

  {
    title:
      "Perdigão Malheiro e os dilemas do binômio razão e escravidão na história do Estado luso-brasileiro",
    author: "Ricardo Alexandre Ferreira",
    journal: "Revista Almanack",
    volume: "v. 37",
    year: "2024",
    cover: "/images/articles/almanack.jpg",
    to: "#",
  },

  {
    title: "Morremos todos: atitudes diante da morte (São Paulo, século XVII)",
    author: "Marília Tofanetto Alves",
    journal: "Revista AEDOS",
    volume: "v. 16",
    year: "2024",
    cover: "/images/articles/aedos.jpg",
    to: "#",
  },

  {
    title:
      "A cor que suscita inquietação: os primeiros jornais de imprensa negra no Brasil Oitocentista",
    author: "Maria Isabela da Silva Gomes",
    journal: "Revista Faces da História",
    volume: "v. 11",
    year: "2024",
    cover: "/images/articles/faces-da-historia.jpg",
    to: "#",
  },

  {
    title: "Se amem eficazmente: as recomendações para o casamento perfeito",
    author: "Marília Tofanetto Alves",
    journal: "Revista Mosaico",
    volume: "v. 16",
    year: "2023",
    cover: "/images/articles/mosaico.jpg",
    to: "#",
  },

  {
    title:
      "Cristianismo, política e condenação da escravidão: os quakers do Delaware Valley durante o século XVIII",
    author: "Sofia Zambelli Menck",
    journal: "Revista Homos",
    volume: "v. 4",
    year: "2023",
    cover: "/images/articles/homos.jpg",
    to: "#",
  },

  {
    title:
      "Periodismo cultural y profesionalización del escritor: un análisis del capítulo La forja del escritor profesional (1900-1930), de Jorge B. Rivera",
    author: "Maria Isabela da Silva Gomes",
    journal: "Revista Ciencia Nueva",
    volume: "v. 7",
    year: "2023",
    cover: "/images/articles/ciencia-nueva.jpg",
    to: "#",
  },

  {
    title:
      "Perigos internos: espiões paraguaios e insurreições numa investigação da Polícia paulista (1865)",
    author: "Larissa Biato de Azevedo",
    journal: "Revista Saeculum",
    volume: "v. 27",
    year: "2022",
    cover: "/images/articles/saeculum.jpg",
    to: "#",
  },

  {
    title:
      "Segurança individual e escravidão nos relatos policiais (Brasil, 1840-1880)",
    author: "Larissa Biato de Azevedo",
    journal: "Revista Trashumante",
    volume: "v. 19",
    year: "2022",
    cover: "/images/articles/trashumante.jpg",
    to: "#",
  },

  {
    title:
      "O homem de côr: o problema da cidadania entre a escravidão e a liberdade no Brasil da primeira metade do século XIX",
    author: "Maria Isabela da Silva Gomes",
    journal: "Revista Ensaios de História",
    volume: "v. 22",
    year: "2021",
    cover: "/images/articles/ensaios.jpg",
    to: "#",
  },

  {
    title: "A ‘destruição’ de um quilombo na Serra do Cubatão (1827-1828)",
    author: "Larissa Biato de Azevedo",
    journal: "Revista Afro-Ásia",
    volume: "v. 64",
    year: "2021",
    cover: "/images/articles/afro-asia.jpg",
    to: "#",
  },

  {
    title:
      "Polissemias da desigualdade no Livro V das Ordenações Filipinas: o escravo integrado",
    author: "Ricardo Alexandre Ferreira",
    journal: "Revista História (São Paulo)",
    volume: "v. 34",
    year: "2015",
    cover: "/images/articles/historia-sp.jpg",
    to: "#",
  },
];

const dossiersMock = [
  {
    title:
      "Dossiê “Construções do Estado Moderno: administração, direito e justiça entre os séculos XVII e XIX”",
    author: "Ricardo Alexandre Ferreira e Larissa Biato de Azevedo",
    journal: "Revista Ensaios de História",
    volume: "v. 26",
    year: "2026",
    cover: "/images/articles/epigrafe.jpg",
    to: "#",
  },
  {
    title:
      "Dossiê “Escravidão moderna e Instituições Luso-brasileiras entre os séculos XVII e XIX”",
    author: "Ricardo Alexandre Ferreira e Larissa Biato de Azevedo",
    journal: "Revista Ágora",
    volume: "v. 35",
    year: "2024",
    cover: "/images/articles/epigrafe.jpg",
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
          <Carousel>
            <Swiper
              modules={[Navigation, Pagination]}
              slidesPerView={"auto"}
              spaceBetween={40}
              navigation
              pagination={{ clickable: true }}
            >
              {articlesMock.map((article, index) => (
                <SwiperSlide key={index} style={{ width: "300px" }}>
                  <ArticleCard {...article} />
                </SwiperSlide>
              ))}
            </Swiper>
          </Carousel>
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

        {activeTab === "dossies" && (
          <Carousel>
            <Swiper
              modules={[Navigation, Pagination]}
              slidesPerView={"auto"}
              spaceBetween={40}
              navigation
              pagination={{ clickable: true }}
            >
              {dossiersMock.map((dossier, index) => (
                <SwiperSlide key={index} style={{ width: "300px" }}>
                  <ArticleCard {...dossier} />
                </SwiperSlide>
              ))}
            </Swiper>
          </Carousel>
        )}
      </Content>
    </Container>
  );
}
