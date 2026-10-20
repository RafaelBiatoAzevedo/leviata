import { useState } from "react";
import { FiArrowUpRight, FiFileText, FiLayers } from "react-icons/fi";
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
  Author,
  Citation,
  Footer,
  Year,
  ReadMore,
  LinkArrow,
} from "./styles";

interface IArticleCardProps {
  title: string;
  author?: string | null;
  journal?: string | null;
  volume?: string | null;
  year?: string | number | null;
  coverUrl?: string | null;
  to?: string | null;
  type?: TArticleType;
  doi?: string | null;
}

export function ArticleCard({
  title,
  author,
  journal,
  volume,
  year,
  coverUrl,
  to,
  type = ArticleType.ARTICLE,
  doi,
}: IArticleCardProps) {
  const [failedCoverUrl, setFailedCoverUrl] = useState<string | null>(null);
  const hasCover = !!coverUrl && coverUrl !== failedCoverUrl;
  const isDossier = type === ArticleType.DOSSIER;
  const label = isDossier ? "Dossiê" : "Artigo";
  const hasYear = year !== null && year !== undefined && String(year).trim() !== "";
  const CoverIcon = isDossier ? FiLayers : FiFileText;

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

        {!!author && <Author title={author}>{author}</Author>}

        {!!doi && (
          <Citation title={`DOI: ${doi}`}>
            <span>DOI</span>
            {doi}
          </Citation>
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
