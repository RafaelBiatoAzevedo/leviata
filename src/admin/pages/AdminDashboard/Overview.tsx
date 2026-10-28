import { useId, useRef, useState } from "react";
import { FiArrowUpRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import type { Swiper as SwiperInstance } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y } from "swiper/modules";
import type { SummaryReportResponseDto } from "../../dtos/reports/SummaryReportResponseDto";
import { dashboardMetrics, metricGroups, type MetricGroup } from "./metrics";
import {
  CarouselButton,
  CarouselControls,
  CarouselRange,
  ErrorState,
  Eyebrow,
  IconTile,
  MetricFilter,
  MetricFilters,
  OverviewCarousel,
  OverviewHeader,
  OverviewSection,
  SectionHeading,
  Skeleton,
  StatCard,
  StatDescription,
  StatTop,
  StatValue,
} from "./styles";

interface Props {
  summary: SummaryReportResponseDto | null;
  loading: boolean;
  error: boolean;
  onRetry(): void;
}

export function DashboardOverview({ summary, loading, error, onRetry }: Props) {
  const [group, setGroup] = useState<MetricGroup>("all");
  const [position, setPosition] = useState({
    index: 0,
    visible: 1,
    first: true,
    last: false,
  });
  const carousel = useRef<SwiperInstance | null>(null);
  const id = useId();
  const metrics = dashboardMetrics.filter(
    (metric) => group === "all" || metric.group === group,
  );
  const end = Math.min(metrics.length, position.index + position.visible);

  function updatePosition(instance: SwiperInstance) {
    setPosition({
      index: instance.activeIndex,
      visible: Math.max(
        1,
        Math.floor(Number(instance.params.slidesPerView) || 1),
      ),
      first: instance.isBeginning,
      last: instance.isEnd || instance.isLocked,
    });
  }

  return (
    <OverviewSection aria-labelledby={`${id}-title`} aria-busy={loading}>
      <OverviewHeader>
        <div>
          <Eyebrow>O portal em números</Eyebrow>
          <SectionHeading id={`${id}-title`}>
            Explore todas as áreas
          </SectionHeading>
          <p>Deslize os cartões ou use as setas para navegar.</p>
        </div>
        <CarouselControls aria-label="Navegar pelos indicadores">
          <CarouselRange role="status" aria-live="polite" aria-atomic="true">
            {position.index + 1}
            {end > position.index + 1 ? `–${end}` : ""}
            <span> de {metrics.length}</span>
          </CarouselRange>
          <CarouselButton
            type="button"
            aria-label="Indicadores anteriores"
            aria-controls={`${id}-carousel`}
            disabled={position.first}
            onClick={() => carousel.current?.slidePrev()}
          >
            <FiChevronLeft aria-hidden="true" />
          </CarouselButton>
          <CarouselButton
            type="button"
            aria-label="Próximos indicadores"
            aria-controls={`${id}-carousel`}
            disabled={position.last}
            onClick={() => carousel.current?.slideNext()}
          >
            <FiChevronRight aria-hidden="true" />
          </CarouselButton>
        </CarouselControls>
      </OverviewHeader>

      <MetricFilters role="group" aria-label="Filtrar indicadores por área">
        {metricGroups.map((option) => (
          <MetricFilter
            key={option.key}
            type="button"
            aria-pressed={group === option.key}
            aria-controls={`${id}-carousel`}
            onClick={() => {
              if (option.key === group) return;
              setGroup(option.key);
              setPosition({ index: 0, visible: 1, first: true, last: false });
            }}
          >
            {option.label}
          </MetricFilter>
        ))}
      </MetricFilters>

      {error && (
        <ErrorState role="alert">
          Não foi possível carregar os indicadores.
          <button type="button" disabled={loading} onClick={onRetry}>
            Tentar novamente
          </button>
        </ErrorState>
      )}

      <OverviewCarousel id={`${id}-carousel`}>
        <Swiper
          key={group}
          modules={[A11y]}
          slidesPerView={1.15}
          spaceBetween={14}
          breakpointsBase="container"
          breakpoints={{
            480: { slidesPerView: 2 },
            760: { slidesPerView: 3 },
            1080: { slidesPerView: 4 },
          }}
          watchOverflow
          a11y={{
            containerRole: "region",
            containerMessage: "Indicadores do portal",
            itemRoleDescriptionMessage: "indicador",
            slideLabelMessage: "{{index}} de {{slidesLength}}",
          }}
          onSwiper={(instance) => {
            carousel.current = instance;
            updatePosition(instance);
          }}
          onSlideChange={updatePosition}
          onBreakpoint={updatePosition}
          onResize={updatePosition}
        >
          {metrics.map(({ key, label, description, to, icon: Icon }) => {
            const total = summary?.items.find(
              (item) => item.key === key,
            )?.total;
            return (
              <SwiperSlide key={key}>
                <StatCard
                  to={to}
                  aria-label={`${label}: ${loading ? "carregando" : total == null ? "indisponível" : total.toLocaleString("pt-BR")}`}
                >
                  <StatTop>
                    <IconTile>
                      <Icon aria-hidden="true" />
                    </IconTile>
                    <FiArrowUpRight aria-hidden="true" />
                  </StatTop>
                  <StatValue>
                    {loading ? (
                      <Skeleton
                        $height="34px"
                        $width="55px"
                        aria-label="Carregando"
                      />
                    ) : (
                      (total?.toLocaleString("pt-BR") ?? "—")
                    )}
                  </StatValue>
                  <span>{label}</span>
                  <StatDescription>{description}</StatDescription>
                </StatCard>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </OverviewCarousel>
    </OverviewSection>
  );
}
