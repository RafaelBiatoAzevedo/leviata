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

import dossieContruction from "../../assets/images/dossieConstrucao.webp";
import dossieEscravidao from "../../assets/images/dossieEscravidao.webp";

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
  Carousel,
  TimeLineAuthor,
  TimeLineEvent,
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
    cover: dossieContruction,
    to: "https://periodicos.franca.unesp.br/index.php/ensaiosdehistoria/issue/view/218",
  },
  {
    title:
      "Dossiê “Escravidão moderna e Instituições Luso-brasileiras entre os séculos XVII e XIX”",
    author: "Ricardo Alexandre Ferreira e Larissa Biato de Azevedo",
    journal: "Revista Ágora",
    volume: "v. 35",
    year: "2024",
    cover: dossieEscravidao,
    to: "https://periodicos.ufes.br/agora/issue/view/1632",
  },
];

export const presentedWorksMock = [
  {
    author: "Marília Tofanetto Alves",

    title:
      "Concubinato, família, e tensões domésticas e conjugais na São Paulo setecentista",

    event:
      "Companheiras ou Propriedade: Concubinato e Escravidão no Mundo Luso-Atlântico",

    year: "2025",
  },
  {
    author: "Gabriel do Nascimento Barbosa",

    title:
      "Da escravidão ao pós-abolição em Franca-SP: a trajetória de Manoel Vallim (1860-1921)",

    event:
      "I Encontro Internacional do Grupo de Pesquisa “Leviatã e o Cativeiro”: Escravidão, Direito e instituições luso-brasileiras",

    year: "2024",
  },
  {
    author: "Larissa Biato de Azevedo",

    title:
      "O contrabando de africanos no expediente das primeiras autoridades policiais do Império brasileiro (1827-1841)",

    event:
      "II Encontro Internacional de Novos Pesquisadores em História da Polícia e do Crime",

    year: "2024",
  },
  {
    author: "Maria Fernanda Minutti Teixeira",

    title:
      "O papel dos relatos de viagem e de pensamentos iluministas no debate antiescravista europeu",

    event:
      "I Encontro Internacional do Grupo de Pesquisa “Leviatã e o Cativeiro”: Escravidão, Direito e instituições luso-brasileiras",

    year: "2024",
  },
  {
    author: "Mariana de Oliveira Lima",

    title:
      "O caminho e o papel da criança escrava no tráfico interno no século XIX (1809-1834)",

    event:
      "I Encontro Internacional do Grupo de Pesquisa “Leviatã e o Cativeiro”: Escravidão, Direito e instituições luso-brasileiras",

    year: "2024",
  },
  {
    author: "Ricardo Alexandre Ferreira",

    title: "Pensamiento jurídico sobre la esclavitud (siglos XVII y XVIII)",

    event:
      "XX Congreso de la Asociación de Historiadores Latinoamericanista Europeos (AHILA): Entre América y Mediterráneo. Actores, ideas, circulaciones en los mundos ibéricos",

    year: "2024",
  },
  {
    author: "Sofia Zambelli Menck",

    title:
      "Os ‘Quakers’ e a condenação da escravidão no Rio de Janeiro (1840-1850)",

    event:
      "I Encontro Internacional do Grupo de Pesquisa “Leviatã e o Cativeiro”: Escravidão, Direito e instituições luso-brasileiras",

    year: "2024",
  },
  {
    author: "Talyssa de Souza Soares",

    title:
      "Entre a cruz e os grilhões: Duas perspectivas católicas sobre a escravidão de africanos no Brasil colonial",

    event:
      "I Encontro Internacional do Grupo de Pesquisa “Leviatã e o Cativeiro”: Escravidão, Direito e instituições luso-brasileiras",

    year: "2024",
  },
  {
    author: "Maria Isabela da Silva Gomes",

    title:
      "A reafirmação da cidadania de negros e mestiços livres na primeira metade do século XIX em O Homem De Côr (1833)",

    event:
      "XIII Encontro Estadual da ANPUH-GO: História, Crise Ambiental e Vulnerabilidades Sociais",

    year: "2022",
  },
];

type TabType = "books" | "articles" | "presentations" | "dossiers";

export function Publications() {
  const [activeTab, setActiveTab] = useState<TabType>("books");

  return (
    <Container>
      <Content>
        <SectionHeader
          title="Publicações"
          subtitle="Explore as produções acadêmicas desenvolvidas pelo grupo, reunindo livros, artigos, apresentações de trabalho e dossiês relacionados às pesquisas sobre Estado Moderno e escravidão."
        />

        <Tabs>
          <TabButton
            $active={activeTab === "books"}
            onClick={() => setActiveTab("books")}
          >
            Livros
          </TabButton>

          <TabButton
            $active={activeTab === "articles"}
            onClick={() => setActiveTab("articles")}
          >
            Artigos
          </TabButton>

          <TabButton
            $active={activeTab === "presentations"}
            onClick={() => setActiveTab("presentations")}
          >
            Apresentações de Trabalhos
          </TabButton>

          <TabButton
            $active={activeTab === "dossiers"}
            onClick={() => setActiveTab("dossiers")}
          >
            Dossiês
          </TabButton>
        </Tabs>

        {activeTab === "books" && (
          <Carousel>
            <Swiper
              modules={[Autoplay, Pagination, Navigation]}
              slidesPerView={"auto"}
              spaceBetween={50}
              navigation
              pagination={{
                clickable: true,
              }}
              style={{ alignItems: "stretch" }}
            >
              {booksMocks.map((book, index) => (
                <SwiperSlide
                  key={index}
                  style={{
                    width: "290px",
                    height: "auto",
                    display: "flex",
                    alignItems: "stretch",
                  }}
                >
                  <BookCard {...book} />
                </SwiperSlide>
              ))}
            </Swiper>
          </Carousel>
        )}

        {activeTab === "articles" && (
          <Carousel>
            <Swiper
              modules={[Navigation, Pagination]}
              slidesPerView={"auto"}
              spaceBetween={50}
              navigation
              pagination={{ clickable: true }}
            >
              {articlesMock.map((article, index) => (
                <SwiperSlide key={index} style={{ width: "340px" }}>
                  <ArticleCard {...article} />
                </SwiperSlide>
              ))}
            </Swiper>
          </Carousel>
        )}

        {activeTab === "presentations" && (
          <Timeline>
            {presentedWorksMock.map((work, index) => (
              <TimelineItem key={index}>
                <TimelineDot />

                <TimelineContent>
                  <TimeLineAuthor>{work.author}</TimeLineAuthor>

                  <TimelineTitle>{work.title}</TimelineTitle>

                  <TimeLineEvent>{work.event}</TimeLineEvent>

                  <TimelineYear>{work.year}</TimelineYear>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        )}

        {activeTab === "dossiers" && (
          <Carousel>
            <Swiper
              modules={[Navigation, Pagination]}
              slidesPerView={"auto"}
              spaceBetween={50}
              navigation
              pagination={{ clickable: true }}
            >
              {dossiersMock.map((dossier, index) => (
                <SwiperSlide key={index} style={{ width: "340px" }}>
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
