import { useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiFileText } from "react-icons/fi";
import { formatDateLong } from "../../admin/utils/formatDate";
import {
  newsCategoryLabels,
  type TNewsCategory,
} from "../../admin/types/TNewsCategory";
import {
  Container,
  Cover,
  ImageFrame,
  CoverBackdrop,
  CoverImage,
  Category,
  DateBadge,
  FallbackCover,
  Content,
  DateText,
  Title,
  Description,
  Footer,
  Source,
  ReadMore,
  LinkArrow,
} from "./styles";

interface NewsCardProps {
  coverUrl?: string | null;
  category?: TNewsCategory;
  date: string;
  title: string;
  slug: string;
  description: string;
}

export function NewsCard({
  slug,
  coverUrl,
  category,
  date,
  title,
  description,
}: NewsCardProps) {
  const [failedCoverUrl, setFailedCoverUrl] = useState<string | null>(null);
  const hasCover = !!coverUrl && coverUrl !== failedCoverUrl;
  const parsedDate = new Date(date);
  const hasDate = !Number.isNaN(parsedDate.getTime());
  const formattedDate = hasDate ? formatDateLong(date) : undefined;
  const day = hasDate
    ? new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        timeZone: "UTC",
      }).format(parsedDate)
    : "";
  const month = hasDate
    ? new Intl.DateTimeFormat("pt-BR", {
        month: "short",
        timeZone: "UTC",
      })
        .format(parsedDate)
        .replace(/\.$/, "")
    : "";

  return (
    <Container as={Link} to={`/noticias/${encodeURIComponent(slug)}`}>
      <Cover>
        <ImageFrame>
          {hasCover ? (
            <>
              <CoverBackdrop
                src={coverUrl ?? undefined}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
              />
              <CoverImage
                src={coverUrl ?? undefined}
                alt={title}
                loading="lazy"
                decoding="async"
                onError={() => setFailedCoverUrl(coverUrl ?? null)}
              />
            </>
          ) : (
            <FallbackCover role="img" aria-label="Notícia sem imagem de capa">
              <FiFileText aria-hidden="true" />
              <span>Leviatã e o Cativeiro</span>
            </FallbackCover>
          )}
        </ImageFrame>

        <Category>
          {category ? newsCategoryLabels[category] : "Notícia"}
        </Category>

        {hasDate && (
          <DateBadge aria-hidden="true">
            <strong>{day}</strong>
            <span>{month}</span>
          </DateBadge>
        )}
      </Cover>

      <Content>
        {hasDate && (
          <DateText dateTime={parsedDate.toISOString()}>
            {formattedDate}
          </DateText>
        )}

        <Title title={title}>{title}</Title>

        <Description>{description}</Description>

        <Footer>
          <Source>No portal</Source>
          <ReadMore>
            Ver detalhes
            <LinkArrow aria-hidden="true">
              <FiArrowRight />
            </LinkArrow>
          </ReadMore>
        </Footer>
      </Content>
    </Container>
  );
}
