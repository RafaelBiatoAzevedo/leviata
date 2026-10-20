import { useState } from "react";
import { FiArrowUpRight, FiBookOpen } from "react-icons/fi";
import type { Author } from "../../admin/dtos/books/BookResponseDto";
import {
  Container,
  Cover,
  CoverLabel,
  Book,
  FallbackCover,
  Content,
  Publisher,
  Title,
  Subtitle,
  AuthorName,
  Footer,
  Year,
  ReadMore,
  LinkArrow,
} from "./styles";

interface BookCardProps {
  externalUrl?: string | null;
  coverUrl?: string | null;
  title: string;
  subtitle?: string | null;
  publisher?: string | null;
  authors?: Author[];
  year?: number | null;
}

export function BookCard({
  externalUrl,
  coverUrl,
  title,
  subtitle,
  publisher,
  authors = [],
  year,
}: BookCardProps) {
  const [failedCoverUrl, setFailedCoverUrl] = useState<string | null>(null);
  const hasCover = !!coverUrl && coverUrl !== failedCoverUrl;
  const authorNames = authors
    .map((author) => author.name?.trim())
    .filter(Boolean)
    .join(" · ");

  return (
    <Container
      as={externalUrl ? "a" : "article"}
      href={externalUrl || undefined}
      target={externalUrl ? "_blank" : undefined}
      rel={externalUrl ? "noopener noreferrer" : undefined}
    >
      <Cover>
        <CoverLabel>
          <span aria-hidden="true" />
          Livro
        </CoverLabel>

        <Book>
          {hasCover ? (
            <img
              src={coverUrl ?? undefined}
              alt={`Capa de ${title}`}
              loading="lazy"
              decoding="async"
              onError={() => setFailedCoverUrl(coverUrl ?? null)}
            />
          ) : (
            <FallbackCover role="img" aria-label={`Livro ${title}, sem capa`}>
              <FiBookOpen aria-hidden="true" />
              <span>{title}</span>
            </FallbackCover>
          )}
        </Book>
      </Cover>

      <Content>
        {!!publisher && <Publisher title={publisher}>{publisher}</Publisher>}

        <Title title={title}>{title}</Title>

        {!!subtitle && <Subtitle title={subtitle}>{subtitle}</Subtitle>}

        {!!authorNames && <AuthorName title={authorNames}>{authorNames}</AuthorName>}

        <Footer>
          {!!year && (
            <Year>
              <span>Publicação</span>
              {year}
            </Year>
          )}

          {!!externalUrl && (
            <ReadMore>
              Acessar livro
              <LinkArrow aria-hidden="true">
                <FiArrowUpRight />
              </LinkArrow>
            </ReadMore>
          )}
        </Footer>
      </Content>
    </Container>
  );
}
