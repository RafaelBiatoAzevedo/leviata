import {
  Carousel,
  Container,
  Content,
  ImageHero,
  ThematicLinesGrid,
} from "./styles";
import leviataHero from "../../assets/images/leviataHero.webp";

import { ButtonLink } from "../../components/ButtonLink";
import { ThematicLinkCard } from "../../components/ThematicLinkCard";
import { BookCard } from "../../components/BookCard";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { NewsCard } from "../../components/NewsCard";
import { HistoryDivider } from "../../components/HistotyDivider";
import { SectionHeader } from "../../components/SectionHeader";
import { useCallback, useEffect, useState } from "react";
import type { BookResponseDto } from "../../admin/dtos/books/BookResponseDto";
import { booksService } from "../../admin/services/books";
import { newsService } from "../../admin/services/news";
import type { NewsResponseDto } from "../../admin/dtos/news/NewsResponseDto";

const thematicLinesMock = [
  {
    id: 1,
    acronym: "CSA",
    description: "Cativeiro, saúde e alimentação: séculos XVII e XVIII",
  },
  {
    id: 2,
    acronym: "MCE",
    description:
      "Monarquia, Cristianismo e Escravidão no Mundo Luso-brasileiro (séculos XVII e XVIII)",
  },
  {
    id: 3,
    acronym: "EIE",
    description: "Estado, Imprensa e Escravidão no Brasil do Século XIX",
  },
];

export function Home() {
  const [books, setBooks] = useState<BookResponseDto[]>(
    [] as BookResponseDto[],
  );

  const [news, setNews] = useState<NewsResponseDto[]>([] as NewsResponseDto[]);

  const load = useCallback(async () => {
    try {
      const responseBooks = await booksService.getAll();
      const responseNews = await newsService.getAll();

      setBooks(responseBooks.data);
      setNews(responseNews.data);
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
        <ButtonLink to="/grupo/" title="Saiba mais"></ButtonLink>
        <HistoryDivider />
        <SectionHeader
          center
          title="Linhas Temáticas"
          subtitle="Conheça as principais linhas de investigação que orientam as
            pesquisas do grupo, abrangendo diferentes abordagens da história,
            memória e construção do conhecimento histórico."
        />
        <ThematicLinesGrid>
          {thematicLinesMock.map((thematic) => (
            <ThematicLinkCard
              to={`/grupo/linhas-tematicas/tematica/${thematic.id}`}
              acronym={thematic.acronym}
              description={thematic.description}
            />
          ))}
        </ThematicLinesGrid>
        <HistoryDivider />
        <SectionHeader
          center
          title="Publicações recentes"
          subtitle="As publicações recentes reúnem os trabalhos mais atuais desenvolvidos pelo grupo “Leviatã e o Cativeiro”, destacando pesquisas, artigos e produções acadêmicas."
        />

        <Carousel>
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            slidesPerView={"auto"}
            spaceBetween={30}
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
        <ButtonLink to="/publicacoes" title="Ver mais"></ButtonLink>
        <HistoryDivider />
        <SectionHeader
          center
          title="Notícias"
          subtitle="As notícias reúnem atualizações sobre as atividades, pesquisas, eventos e produções do grupo “Leviatã e o Cativeiro”."
        />

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
            {news.map((newMock, index) => (
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
