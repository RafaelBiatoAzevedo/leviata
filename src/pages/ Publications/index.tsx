import { useCallback, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { SectionHeader } from "../../components/SectionHeader";
import { BookCard } from "../../components/BookCard";

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
  Subtitle,
} from "./styles";
import { ArticleCard } from "../../components/ArticlesCard";
import type { BookResponseDto } from "../../admin/dtos/books/BookResponseDto";
import { booksService } from "../../admin/services/books";
import type { ArticleResponseDto } from "../../admin/dtos/articles/ArticleResponseDto";
import { articlesService } from "../../admin/services/articles";
import { ArticleType } from "../../admin/types/TArticleType";

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
  const [books, setBooks] = useState<BookResponseDto[]>(
    [] as BookResponseDto[],
  );

  const [articles, setArticles] = useState<ArticleResponseDto[]>(
    [] as ArticleResponseDto[],
  );

  const [dossiers, setDossiers] = useState<ArticleResponseDto[]>(
    [] as ArticleResponseDto[],
  );

  const load = useCallback(async () => {
    try {
      const responseBooks = await booksService.getAll();
      const responseArticles = await articlesService.getAll();

      setBooks(responseBooks.data);
      setArticles(
        responseArticles.data.filter(
          (article) => article.type === ArticleType.ARTICLE,
        ),
      );
      setDossiers(
        responseArticles.data.filter(
          (article) => article.type === ArticleType.DOSSIER,
        ),
      );
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, [load]);

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
              loop
              navigation
              pagination={{
                clickable: true,
              }}
              style={{ alignItems: "stretch" }}
            >
              {books.map((book, index) => (
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
              loop
              spaceBetween={50}
              navigation
              pagination={{ clickable: true }}
              style={{ alignItems: "stretch" }}
            >
              {articles.map((article, index) => (
                <SwiperSlide
                  key={index}
                  style={{
                    width: "340px",
                    height: "auto",
                    display: "flex",
                    alignItems: "stretch",
                  }}
                >
                  <ArticleCard {...article} />
                </SwiperSlide>
              ))}
            </Swiper>
          </Carousel>
        )}

        {activeTab === "presentations" && (
          <div>
            <Subtitle>
              Confira os trabalhos mais recentes apresentados pelos
              pesquisadores do grupo.
            </Subtitle>
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
          </div>
        )}

        {activeTab === "dossiers" && (
          <Carousel>
            <Swiper
              modules={[Navigation, Pagination]}
              slidesPerView={"auto"}
              spaceBetween={50}
              loop
              navigation
              pagination={{ clickable: true }}
              style={{ alignItems: "stretch" }}
            >
              {dossiers.map((dossier, index) => (
                <SwiperSlide
                  key={index}
                  style={{
                    width: "340px",
                    height: "auto",
                    display: "flex",
                    alignItems: "stretch",
                  }}
                >
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
