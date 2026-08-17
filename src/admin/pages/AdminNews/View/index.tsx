import { FiArrowLeft, FiEdit2 } from "react-icons/fi";
import { AdminButton } from "../../../components/AdminButton";
import {
  NewsTitle,
  Container,
  ContentWrapper,
  Cover,
  CoverWrapper,
  Header,
  HeaderActions,
  Subtitle,
  Title,
} from "./styles";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "../../../../hooks/useToast";
import { AdminFormCard } from "../../../components/AdminFormCard";
import { AdminSection } from "../../../components/AdminSection";
import { AdminDescriptionList } from "../../../components/AdminDescriptionList";
import { AdminDescriptionItem } from "../../../components/AdminDescriptionItem";
import type { NewsResponseDto } from "../../../dto/news/NewsResponseDto";
import { newsService } from "../../../services/news";
import { newsCategoryLabels } from "../../../enums/NewsCategory";
import { formatDate } from "../../../utils/formatDate";

export function NewsView() {
  const navigate = useNavigate();

  const { showToast } = useToast();

  const { slug } = useParams();

  const [news, setNews] = useState<NewsResponseDto | null>(null);

  const loadNews = useCallback(async () => {
    try {
      const response = await newsService.getBySlug(slug!);
      setNews(response.data);
    } catch (error) {
      showToast({
        title: "Ops! Não foi possível carregar a notícia",
        description: `Ocorreu um erro ao buscar os dados. Tente novamente. \n ${error}`,
        type: "danger",
      });
    }
  }, [showToast, slug]);

  useEffect(() => {
    if (!news) {
      (async () => {
        await loadNews();
      })();
    }
  }, [news, loadNews]);

  if (!news) {
    return <div>Carregando...</div>;
  }

  return (
    <Container>
      <Header>
        <HeaderActions>
          <AdminButton variant="outline" onClick={() => navigate(-1)}>
            <FiArrowLeft />
            Voltar
          </AdminButton>

          <AdminButton
            onClick={() => navigate(`/admin/noticias/${slug}/editar`)}
          >
            <FiEdit2 />
            Editar
          </AdminButton>
        </HeaderActions>

        <Title>Notícia</Title>
      </Header>

      <ContentWrapper>
        <CoverWrapper to={news.externalUrl} target={"_blank"}>
          {!!news.coverUrl && <Cover src={news.coverUrl} />}

          <NewsTitle>{news.title}</NewsTitle>

          <Subtitle>{formatDate(news.date)}</Subtitle>
        </CoverWrapper>

        <AdminFormCard>
          <AdminSection title="Dados Gerais">
            <AdminDescriptionList>
              <AdminDescriptionItem label="Título" value={news.title} />

              <AdminDescriptionItem label="Slug" value={news.slug} />

              <AdminDescriptionItem
                label="Categoria"
                value={newsCategoryLabels[news.category]}
              />

              <AdminDescriptionItem
                label="Externa"
                value={news.isInternal ? "Sim" : "Não"}
              />

              <AdminDescriptionItem
                label="Relacionada"
                value={news.relatedId}
              />

              <AdminDescriptionItem label="Link" value={news.externalUrl} />
            </AdminDescriptionList>
          </AdminSection>
        </AdminFormCard>
      </ContentWrapper>
      <AdminFormCard>
        <AdminSection title="Descrição">
          <AdminDescriptionItem label="Descrição" value={news.description} />
        </AdminSection>
      </AdminFormCard>
      {/* <AdminFormCard>
        <AdminSection
          title={`${news.authors.length > 1 ? "Autores" : "Autor"}`}
        >
          {news.authors.map((author, index) => (
            <AdminDescriptionItem
              key={index}
              value={`${author.academicTitle!.abbreviation} ${author.name} - ${author.institution!.acronym}`}
            />
          ))}
        </AdminSection>
      </AdminFormCard> */}
    </Container>
  );
}
