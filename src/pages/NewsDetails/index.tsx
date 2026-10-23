import { Link, useParams } from "react-router-dom";
import { FiArrowUpRight, FiExternalLink, FiFileText } from "react-icons/fi";
import type { NewsResponseDto } from "../../admin/dtos/news/NewsResponseDto";
import { newsCategoryLabels } from "../../admin/types/TNewsCategory";
import { newsRelatedTypeLabels } from "../../admin/types/TNewsRelatedType";
import { usePublicRecord } from "../../hooks/usePublicData";
import { SectionHeader } from "../../components/SectionHeader";
import { ParagraphText } from "../../components/ParagraphText";
import { PublicDataState } from "../../components/PublicDataState";
import { ImageFrame } from "../../components/ImageFrame";
import { YearBadge } from "../../components/YearBadge";
import { HistoryDivider } from "../../components/HistotyDivider";
import {
  AccessLinks,
  AccessSection,
  Container,
  Content,
  Header,
  Links,
  Status,
} from "../../components/GalleryDetails/styles";
import { timelineExternalUrl } from "../../utils/timeline";
import { newsRelatedPath } from "../../utils/news";

export function NewsDetails() {
  const { id } = useParams();
  const { data, loading, error } = usePublicRecord<NewsResponseDto>("news", id);
  if (loading || error || !data)
    return (
      <Container>
        <Status>
          <PublicDataState
            loading={loading}
            error={!loading && (error || !data)}
            empty={false}
            label="a notícia"
          />
          {!loading && <Link to="/noticias">Voltar às notícias</Link>}
        </Status>
      </Container>
    );
  const external = timelineExternalUrl(data.externalUrl);
  const related = newsRelatedPath(data.relatedType, data.relatedId);
  return (
    <Container>
      <Content>
        <Header>
          <SectionHeader
            center
            title={data.title}
            subtitle={newsCategoryLabels[data.category]}
          />
          <YearBadge date={data.date} />
        </Header>
        {data.coverUrl && (
          <ImageFrame
            src={data.coverUrl}
            alt={data.title}
            onError={(event) => {
              event.currentTarget.hidden = true;
            }}
          />
        )}
        {data.description?.trim() && <ParagraphText text={data.description} />}
        {(external || related) && (
          <>
            <HistoryDivider />
            <AccessSection>
              <SectionHeader as="h2" small title="Acessos e materiais" />
              <AccessLinks>
                {external && (
                  <a href={external} target="_blank" rel="noopener noreferrer">
                    <FiExternalLink aria-hidden="true" />
                    <span>Acessar fonte original</span>
                    <FiArrowUpRight aria-hidden="true" />
                  </a>
                )}
                {related && (
                  <Link to={related}>
                    <FiFileText aria-hidden="true" />
                    <span>
                      {data.relatedType === "PUBLICATION"
                        ? "Ver publicação"
                        : `Ver conteúdo relacionado: ${data.relatedType ? newsRelatedTypeLabels[data.relatedType] : ""}`}
                    </span>
                    <FiArrowUpRight aria-hidden="true" />
                  </Link>
                )}
              </AccessLinks>
            </AccessSection>
          </>
        )}
        <Links>
          <Link to="/noticias">Voltar às notícias</Link>
        </Links>
      </Content>
    </Container>
  );
}
