import {
  Carousel,
  Container,
  Content,
  Hero,
  ImageHero,
  ThematicLinesGrid,
} from "./styles";
import leviataHero from "../../assets/images/leviataHero.webp";
import leviataMobile from "../../assets/images/leviataMobile.jpeg";

import { ButtonLink } from "../../components/ButtonLink";
import { ThematicLinkCard } from "../../components/ThematicLinkCard";
import { BookCard } from "../../components/BookCard";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { NewsCard } from "../../components/NewsCard";
import { HistoryDivider } from "../../components/HistotyDivider";
import { SectionHeader } from "../../components/SectionHeader";
import type { BookResponseDto } from "../../admin/dtos/books/BookResponseDto";
import type { NewsResponseDto } from "../../admin/dtos/news/NewsResponseDto";
import { useThematics } from "../../hooks/useThematics";
import { thematicAcronym } from "../../utils/thematics";
import { usePublicList } from "../../hooks/usePublicData";
import { PublicDataState } from "../../components/PublicDataState";

export function Home() {
  const {
    thematics,
    loading: loadingThematics,
    error: thematicError,
  } = useThematics();
  const {
    data: books,
    loading: loadingBooks,
    error: booksError,
  } = usePublicList<BookResponseDto>("books", {
    sortBy: "year",
    sortOrder: "desc",
  });
  const {
    data: news,
    loading: loadingNews,
    error: newsError,
  } = usePublicList<NewsResponseDto>("news", {
    sortBy: "date",
    sortOrder: "desc",
  });

  return (
    <Container>
      <Hero>
        <source media="(aspect-ratio < 1/1)" srcSet={leviataMobile} />
        <ImageHero src={leviataHero} alt="Leviatã e o Cativeiro" />
      </Hero>
      <Content>
        <h1>
          Criado em 2019, o grupo de pesquisa “Leviatã e o Cativeiro” reúne
          pesquisadores em torno do binômio temático Estado Moderno e
          escravidão. Ao considerar um largo arco temporal, que vai do século
          XVI ao XIX, nossas pesquisas procuram analisar a relação entre as
          diversas instituições luso-brasileiras – Inquisição, família, polícia,
          Imprensa – e a escravidão de africanos e descendentes.
        </h1>
        <ButtonLink to="/grupo/" title="Saiba mais"></ButtonLink>
        <HistoryDivider />
        <SectionHeader
          center
          as="h2"
          title="Linhas Temáticas"
          subtitle="Conheça as principais linhas de investigação que orientam as
            pesquisas do grupo, abrangendo diferentes abordagens da história,
            memória e construção do conhecimento histórico."
        />
        <ThematicLinesGrid>
          {loadingThematics && <p>Carregando linhas temáticas...</p>}
          {thematicError && <p role="alert">{thematicError}</p>}
          {!loadingThematics && !thematicError && !thematics.length && (
            <p>Nenhuma linha temática cadastrada.</p>
          )}
          {thematics.map((thematic) => (
            <ThematicLinkCard
              key={thematic.id}
              to={`/grupo/linhas-tematicas/tematica/${thematic.slug}`}
              acronym={thematicAcronym(thematic.title)}
              description={thematic.title}
            />
          ))}
        </ThematicLinesGrid>
        <HistoryDivider />
        <SectionHeader
          center
          as="h2"
          title="Publicações recentes"
          subtitle="As publicações recentes reúnem os trabalhos mais atuais desenvolvidos pelo grupo “Leviatã e o Cativeiro”, destacando pesquisas, artigos e produções acadêmicas."
        />

        <PublicDataState
          loading={loadingBooks}
          error={booksError}
          empty={!books.length}
          label="os livros"
        />
        {books.length > 0 && (
          <Carousel>
            <Swiper
              modules={[Autoplay, Pagination, Navigation]}
              slidesPerView={"auto"}
              spaceBetween={30}
              rewind
              watchOverflow
              navigation
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              style={{ alignItems: "stretch" }}
            >
              {books.map((book) => (
                <SwiperSlide
                  key={book.id}
                  style={{
                    width: "var(--book-card-width, 290px)",
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
        <ButtonLink to="/publicacoes" title="Ver mais"></ButtonLink>
        <HistoryDivider />
        <SectionHeader
          center
          as="h2"
          title="Notícias"
          subtitle="As notícias reúnem atualizações sobre as atividades, pesquisas, eventos e produções do grupo “Leviatã e o Cativeiro”."
        />

        <PublicDataState
          loading={loadingNews}
          error={newsError}
          empty={!news.length}
          label="as notícias"
        />
        {news.length > 0 && (
          <Carousel>
            <Swiper
              modules={[Autoplay, Pagination, Navigation]}
              slidesPerView={"auto"}
              spaceBetween={50}
              rewind
              watchOverflow
              navigation
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              style={{ alignItems: "stretch" }}
            >
              {news.map((item) => (
                <SwiperSlide
                  key={item.id}
                  style={{
                    width: "350px",
                    height: "auto",
                    display: "flex",
                    alignItems: "stretch",
                  }}
                >
                  <NewsCard {...item} />
                </SwiperSlide>
              ))}
            </Swiper>
          </Carousel>
        )}
      </Content>
    </Container>
  );
}
