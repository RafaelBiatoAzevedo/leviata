import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Carousel } from "../Carousel";
import { ImageCard } from "../ImageCard";

interface GalleryImage {
  id: string;
  imageUrl: string;
  title?: string | null;
  description?: string | null;
}

export function ImageGallery({ images = [] }: { images?: GalleryImage[] }) {
  if (images.length === 0) return null;

  return (
    <Carousel>
      <Swiper
        modules={[Pagination, Navigation]}
        slidesPerView="auto"
        spaceBetween={30}
        navigation={images.length > 1}
        pagination={{ clickable: true }}
        watchOverflow
        style={{ alignItems: "stretch" }}
      >
        {images.map((image) => (
          <SwiperSlide
            key={image.id}
            style={{
              width: "min(400px, 100%)",
              height: "auto",
              display: "flex",
            }}
          >
            <ImageCard {...image} />
          </SwiperSlide>
        ))}
      </Swiper>
    </Carousel>
  );
}
