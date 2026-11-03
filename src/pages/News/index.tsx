import { useId } from "react";
import { FiFileText } from "react-icons/fi";
import { SectionHeader } from "../../components/SectionHeader";
import {
  Archive,
  Container,
  Content,
  Timeline,
  YearHeading,
  YearLink,
  YearNavigation,
  YearSection,
} from "./styles";

import { NewsCard } from "../../components/NewsCard";
import { A11y, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Carousel } from "../../components/Carousel";
import {
  Overview,
  OverviewCopy,
  OverviewIcon,
} from "../../components/EventTimeline/styles";
import type { NewsResponseDto } from "../../admin/dtos/news/NewsResponseDto";
import { usePublicList } from "../../hooks/usePublicData";
import { PublicDataState } from "../../components/PublicDataState";
import { groupNewsByYear } from "../../utils/news";

export function News() {
  const id = useId();
  const {
    data: news,
    loading,
    error,
  } = usePublicList<NewsResponseDto>("news", {
    sortBy: "date",
    sortOrder: "desc",
  });
  const groups = groupNewsByYear(news);

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
        {!loading && !error && groups.length > 0 && (
          <Archive>
            <Overview>
              <OverviewCopy>
                <OverviewIcon aria-hidden="true">
                  <FiFileText />
                </OverviewIcon>
                <div>
                  <span>Notícias do grupo</span>
                  <p>A memória do grupo, ano a ano.</p>
                </div>
              </OverviewCopy>
            </Overview>
            <YearNavigation aria-label="Anos das notícias">
              {groups.map(({ year, items }) => (
                <YearLink
                  key={year ?? "undated"}
                  href={`#${id}-${year ?? "undated"}`}
                >
                  {year ?? "Sem data"}
                  <span>
                    {items.length}{" "}
                    {items.length === 1 ? "notícia" : "notícias"}
                  </span>
                </YearLink>
              ))}
            </YearNavigation>
            <Timeline>
              {groups.map(({ year, items }) => (
                <YearSection
                  key={year ?? "undated"}
                  id={`${id}-${year ?? "undated"}`}
                  aria-labelledby={`${id}-${year ?? "undated"}-title`}
                >
                  <YearHeading>
                    <h2 id={`${id}-${year ?? "undated"}-title`}>
                      {year ?? "Sem data"}
                    </h2>
                    <span>
                      {items.length}{" "}
                      {items.length === 1 ? "notícia" : "notícias"}
                    </span>
                  </YearHeading>
                  <Carousel>
                    <Swiper
                      modules={[A11y, Pagination, Navigation]}
                      slidesPerView="auto"
                      spaceBetween={24}
                      rewind
                      watchOverflow
                      navigation
                      speed={700}
                      pagination={{ clickable: true, dynamicBullets: true }}
                      a11y={{
                        containerMessage: `Notícias de ${year ?? "data não informada"}`,
                        containerRole: "region",
                        prevSlideMessage: "Notícia anterior",
                        nextSlideMessage: "Próxima notícia",
                        paginationBulletMessage: "Ir para a notícia {{index}}",
                        slideLabelMessage: "{{index}} de {{slidesLength}}",
                      }}
                    >
                      {items.map((item) => (
                        <SwiperSlide key={item.id}>
                          <NewsCard {...item} />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </Carousel>
                </YearSection>
              ))}
            </Timeline>
          </Archive>
        )}
      </Content>
    </Container>
  );
}
