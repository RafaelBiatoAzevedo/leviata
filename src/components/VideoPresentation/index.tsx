import { useLayoutEffect, useRef } from "react";
import { A11y, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { VideoResponseDto } from "../../admin/dtos/videos/VideoResponseDto";
import { timelineExternalUrl } from "../../utils/timeline";
import { Carousel } from "../Carousel";
import { ParagraphText } from "../ParagraphText";
import { SectionHeader } from "../SectionHeader";
import {
  PresentationHeading,
  PresentationLabel,
  PresentationSection,
  PresentationTitle,
  VideoCard,
  VideoCardBody,
  VideoCardHeader,
  VideosSection,
  VideoWrapper,
} from "./styles";

function VideoPlayer({ video }: { video: VideoResponseDto }) {
  const embed = timelineExternalUrl(video.embedLink);
  if (!embed) return null;
  return (
    <VideoWrapper>
      <iframe
        src={embed}
        title={video.title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </VideoWrapper>
  );
}

function VideoHeading({
  video,
  featured = false,
  showTitle = true,
  uppercasePresenter = false,
}: {
  video: VideoResponseDto;
  featured?: boolean;
  showTitle?: boolean;
  uppercasePresenter?: boolean;
}) {
  const people = (video.people ?? [])
    .map((person) => person.name)
    .filter(Boolean)
    .join(" · ");
  if (!showTitle && !people) return null;
  return (
    <PresentationHeading
      data-carousel-video-heading={featured ? undefined : ""}
    >
      {showTitle && (
        <PresentationTitle as={featured ? "h2" : "h3"}>
          {video.title}
        </PresentationTitle>
      )}
      {people && (
        <PresentationLabel $uppercase={uppercasePresenter}>
          Apresentado por {people}
        </PresentationLabel>
      )}
    </PresentationHeading>
  );
}

export function VideoPresentation({
  video,
  showTitle = true,
  uppercasePresenter = false,
}: {
  video: VideoResponseDto;
  showTitle?: boolean;
  uppercasePresenter?: boolean;
}) {
  return (
    <PresentationSection aria-label={video.title}>
      <VideoHeading
        video={video}
        featured
        showTitle={showTitle}
        uppercasePresenter={uppercasePresenter}
      />
      <VideoPlayer video={video} />
      {video.description?.trim() && <ParagraphText text={video.description} />}
    </PresentationSection>
  );
}

export function VideoCarousel({
  videos,
  title = "Vídeos do grupo",
  subtitle,
  label = title,
}: {
  videos: VideoResponseDto[];
  title?: string;
  subtitle?: string;
  label?: string;
}) {
  const carouselRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const headings = Array.from(
      carousel.querySelectorAll<HTMLElement>("[data-carousel-video-heading]"),
    );
    if (!headings.length) return;

    const alignHeadings = () => {
      const height = Math.ceil(
        Math.max(
          ...headings.map((heading) => heading.getBoundingClientRect().height),
        ),
      );
      carousel.style.setProperty("--video-heading-height", `${height}px`);
    };
    const observer = new ResizeObserver(alignHeadings);
    headings.forEach((heading) => observer.observe(heading));
    alignHeadings();

    return () => {
      observer.disconnect();
      carousel.style.removeProperty("--video-heading-height");
    };
  }, [videos]);

  if (!videos.length) return null;
  return (
    <VideosSection ref={carouselRef} aria-label={label}>
      <SectionHeader center as="h2" small title={title} subtitle={subtitle} />
      <Carousel>
        <Swiper
          modules={[A11y, Navigation, Pagination]}
          slidesPerView="auto"
          spaceBetween={30}
          navigation={videos.length > 1}
          pagination={{ clickable: true, dynamicBullets: true }}
          a11y={{
            prevSlideMessage: "Vídeo anterior",
            nextSlideMessage: "Próximo vídeo",
            paginationBulletMessage: "Ir para o vídeo {{index}}",
          }}
          rewind
          watchOverflow
          style={{ alignItems: "stretch" }}
        >
          {videos.map((video) => (
            <SwiperSlide
              key={video.id}
              style={{
                width: "min(520px, 100%)",
                height: "auto",
                display: "flex",
              }}
            >
              <VideoCard>
                <VideoCardHeader>
                  <VideoHeading video={video} />
                </VideoCardHeader>
                <VideoPlayer video={video} />
                {video.description?.trim() && (
                  <VideoCardBody>
                    <ParagraphText text={video.description} />
                  </VideoCardBody>
                )}
              </VideoCard>
            </SwiperSlide>
          ))}
        </Swiper>
      </Carousel>
    </VideosSection>
  );
}
