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
  TimelineSubTitle,
} from "./styles";
import { ArticleCard } from "../../components/ArticlesCard";
import type { BookResponseDto } from "../../admin/dtos/books/BookResponseDto";
import { booksService } from "../../admin/services/books";
import type { ArticleResponseDto } from "../../admin/dtos/articles/ArticleResponseDto";
import { articlesService } from "../../admin/services/articles";
import { ArticleType } from "../../admin/types/TArticleType";
import type { PresentedWorkResponseDto } from "../../admin/dtos/presentedWorks/PresentedWorkResponseDto";
import { presentedWorksService } from "../../admin/services/presentedWorks";
import { formatDate } from "../../admin/utils/formatDate";

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

  const [presentedWorks, setPresentedWorks] = useState<
    PresentedWorkResponseDto[]
  >([] as PresentedWorkResponseDto[]);

  const load = useCallback(async () => {
    try {
      const responseBooks = await booksService.getAll();
      const responseArticles = await articlesService.getAll();
      const responsePresentedWorks = await presentedWorksService.getAll();

      setBooks(responseBooks.data);
      setPresentedWorks(responsePresentedWorks.data);

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
              {presentedWorks.map((work, index) => (
                <TimelineItem key={index}>
                  <TimelineDot />

                  <TimelineContent>
                    <TimelineYear>{formatDate(work.date)}</TimelineYear>

                    <TimelineTitle>{work.title}</TimelineTitle>

                    <TimeLineEvent>{work.meetingUrl}</TimeLineEvent>

                    <TimelineSubTitle>Apresentado por:</TimelineSubTitle>
                    {work.authors.map((author, index) => (
                      <TimeLineAuthor
                        key={index}
                      >{`${author.academicTitle.abbreviation}  ${author.name}`}</TimeLineAuthor>
                    ))}
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
