import { Link, useParams } from "react-router-dom";
import type { NewsResponseDto } from "../../admin/dtos/news/NewsResponseDto";
import { newsCategoryLabels } from "../../admin/types/TNewsCategory";
import { newsRelatedTypeLabels } from "../../admin/types/TNewsRelatedType";
import { formatDateLong } from "../../admin/utils/formatDate";
import { usePublicRecord } from "../../hooks/usePublicData";
import { SectionHeader } from "../../components/SectionHeader";
import { ParagraphText } from "../../components/ParagraphText";
import { PublicDataState } from "../../components/PublicDataState";
import {
  Container,
  Content,
  Cover,
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
  const date = Number.isFinite(new Date(data.date).getTime())
    ? formatDateLong(data.date)
    : "";
  return (
    <Container>
      <Content>
        <SectionHeader
          center
          title={data.title}
          subtitle={[newsCategoryLabels[data.category], date]
            .filter(Boolean)
            .join(" · ")}
        />
        {data.coverUrl && (
          <Cover
            src={data.coverUrl}
            alt={data.title}
            onError={(event) => {
              event.currentTarget.hidden = true;
            }}
          />
        )}
        {data.description?.trim() && <ParagraphText text={data.description} />}
        <Links>
          {external && (
            <a href={external} target="_blank" rel="noopener noreferrer">
              Acessar fonte original
            </a>
          )}
          {related && (
            <Link to={related}>
              {data.relatedType === "PUBLICATION"
                ? "Ver publicação"
                : `Ver conteúdo relacionado: ${data.relatedType ? newsRelatedTypeLabels[data.relatedType] : ""}`}
            </Link>
          )}
          <Link to="/noticias">Voltar às notícias</Link>
        </Links>
      </Content>
    </Container>
  );
}
