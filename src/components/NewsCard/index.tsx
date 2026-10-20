import { useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiArrowUpRight, FiFileText } from "react-icons/fi";
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
  externalUrl?: string | null;
  coverUrl?: string | null;
  category?: TNewsCategory;
  date: string;
  title: string;
  slug: string;
  description: string;
  isInternal: boolean;
}

export function NewsCard({
  slug,
  isInternal,
  externalUrl,
  coverUrl,
  category,
  date,
  title,
  description,
}: NewsCardProps) {
  const [failedCoverUrl, setFailedCoverUrl] = useState<string | null>(null);
  const hasCover = !!coverUrl && coverUrl !== failedCoverUrl;
  const hasDestination = isInternal || !!externalUrl;
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
    <Container
      as={isInternal ? Link : externalUrl ? "a" : "article"}
      to={isInternal ? `/noticias/${slug}` : undefined}
      href={!isInternal ? (externalUrl ?? undefined) : undefined}
      target={!isInternal && externalUrl ? "_blank" : undefined}
      rel={!isInternal && externalUrl ? "noopener noreferrer" : undefined}
    >
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

        <Category>{category ? newsCategoryLabels[category] : "Notícia"}</Category>

        {hasDate && (
          <DateBadge aria-hidden="true">
            <strong>{day}</strong>
            <span>{month}</span>
          </DateBadge>
        )}
      </Cover>

      <Content>
        {hasDate && (
          <DateText dateTime={parsedDate.toISOString()}>{formattedDate}</DateText>
        )}

        <Title title={title}>{title}</Title>

        <Description>{description}</Description>

        {hasDestination && (
          <Footer>
            <Source>{isInternal ? "No portal" : "Link externo"}</Source>
            <ReadMore>
              {isInternal ? "Ler notícia" : "Acessar notícia"}
              <LinkArrow aria-hidden="true">
                {isInternal ? <FiArrowRight /> : <FiArrowUpRight />}
              </LinkArrow>
            </ReadMore>
          </Footer>
        )}
      </Content>
    </Container>
  );
}
