import { SectionHeader } from "../../components/SectionHeader";
import { Container, Content } from "./styles";

import { NewsCard } from "../../components/NewsCard";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Carousel } from "../../components/Carousel";
import type { NewsResponseDto } from "../../admin/dtos/news/NewsResponseDto";
import { useCallback, useEffect, useState } from "react";
import { newsService } from "../../admin/services/news";

export function News() {
  const [news, setNews] = useState<NewsResponseDto[]>([] as NewsResponseDto[]);

  const load = useCallback(async () => {
    try {
      const responseNews = await newsService.getAll();

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
      <Content>
        <SectionHeader
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
            style={{ alignItems: "stretch" }}
          >
            {news.map((_news, index) => (
              <SwiperSlide
                key={index}
                style={{
                  width: "350px",
                  height: "auto",
                  display: "flex",
                  alignItems: "stretch",
                }}
              >
                <NewsCard {..._news} />
              </SwiperSlide>
            ))}
          </Swiper>
        </Carousel>
      </Content>
    </Container>
  );
}
