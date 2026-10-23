import { SectionHeader } from "../../components/SectionHeader";
import { Container, Content } from "./styles";

import { NewsCard } from "../../components/NewsCard";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Carousel } from "../../components/Carousel";
import type { NewsResponseDto } from "../../admin/dtos/news/NewsResponseDto";
import { usePublicList } from "../../hooks/usePublicData";
import { PublicDataState } from "../../components/PublicDataState";

export function News() {
  const {
    data: news,
    loading,
    error,
  } = usePublicList<NewsResponseDto>("news", {
    sortBy: "date",
    sortOrder: "desc",
  });

  return (
    <Container>
      <Content>
        <SectionHeader
          title="Notícias"
          subtitle="As notícias reúnem atualizações sobre as atividades, pesquisas, eventos e produções do grupo “Leviatã e o Cativeiro”, que desde 2019 investiga o Estado Moderno e a escravidão entre os séculos XVI e XIX, com foco nas instituições luso-brasileiras e suas relações com a experiência da escravização de africanos e seus descendentes."
        />
        <PublicDataState
          loading={loading}
          error={error}
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
              speed={700}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              style={{ alignItems: "stretch" }}
            >
              {news.map((_news) => (
                <SwiperSlide
                  key={_news.id}
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
        )}
      </Content>
    </Container>
  );
}
