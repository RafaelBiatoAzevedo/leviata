import { useState } from "react";
import { FiArrowUpRight, FiFileText, FiLayers } from "react-icons/fi";
import type { Author as ArticleAuthor } from "../../admin/dtos/articles/ArticleResponseDto";
import { ArticleType, type TArticleType } from "../../admin/types/TArticleType";
import {
  Container,
  Cover,
  CoverLabel,
  Volume,
  Issue,
  FallbackCover,
  Content,
  Journal,
  Title,
  Authors,
  Author,
  Footer,
  Year,
  ReadMore,
  LinkArrow,
} from "./styles";

interface IArticleCardProps {
  title: string;
  authors?: ArticleAuthor[];
  journal?: string | null;
  volume?: string | null;
  year?: string | number | null;
  coverUrl?: string | null;
  to?: string | null;
  type?: TArticleType;
}

export function ArticleCard({
  title,
  authors = [],
  journal,
  volume,
  year,
  coverUrl,
  to,
  type = ArticleType.ARTICLE,
}: IArticleCardProps) {
  const [failedCoverUrl, setFailedCoverUrl] = useState<string | null>(null);
  const hasCover = !!coverUrl && coverUrl !== failedCoverUrl;
  const isDossier = type === ArticleType.DOSSIER;
  const label = isDossier ? "Dossiê" : "Artigo";
  const hasYear = year !== null && year !== undefined && String(year).trim() !== "";
  const CoverIcon = isDossier ? FiLayers : FiFileText;
  const authorNames = authors
    .map((author) => author.name?.trim())
    .filter((name): name is string => !!name);

  return (
    <Container
      as={to ? "a" : "article"}
      href={to || undefined}
      target={to ? "_blank" : undefined}
      rel={to ? "noopener noreferrer" : undefined}
    >
      <Cover $dossier={isDossier}>
        <CoverLabel>
          <CoverIcon aria-hidden="true" />
          {label}
        </CoverLabel>

        {!!volume && <Volume title={`Volume ${volume}`}>Vol. {volume}</Volume>}

        <Issue>
          {hasCover ? (
            <img
              src={coverUrl ?? undefined}
              alt={`Capa: ${title}`}
              loading="lazy"
              decoding="async"
              onError={() => setFailedCoverUrl(coverUrl ?? null)}
            />
          ) : (
            <FallbackCover role="img" aria-label={`${label} ${title}, sem capa`}>
              <CoverIcon aria-hidden="true" />
              <span>{title}</span>
            </FallbackCover>
          )}
        </Issue>
      </Cover>

      <Content>
        {!!journal && <Journal title={journal}>{journal}</Journal>}

        <Title title={title}>{title}</Title>

        {authorNames.length > 0 && (
          <Authors role="list" aria-label="Autores">
            {authorNames.map((name, index) => (
              <Author key={`${name}-${index}`}>{name}</Author>
            ))}
          </Authors>
        )}

        {(hasYear || !!to) && (
          <Footer>
            {hasYear && (
              <Year>
                <span>Publicação</span>
                {year}
              </Year>
            )}

            {!!to && (
              <ReadMore>
                {isDossier ? "Acessar dossiê" : "Acessar artigo"}
                <LinkArrow aria-hidden="true">
                  <FiArrowUpRight />
                </LinkArrow>
              </ReadMore>
            )}
          </Footer>
        )}
      </Content>
    </Container>
  );
}
