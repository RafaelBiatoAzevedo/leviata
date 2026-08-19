import { useCallback, useEffect, useState } from "react";
import type { ArticleResponseDto } from "../../../dto/articles/ArticleResponseDto";
import {
  ArticleTitle,
  Container,
  ContentWrapper,
  Cover,
  CoverWrapper,
  Header,
  HeaderActions,
  Subtitle,
  Title,
} from "./styles";
import { articlesService } from "../../../services/articles";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../../../hooks/useToast";
import { AdminButton } from "../../../components/AdminButton";
import { FiArrowLeft, FiEdit2 } from "react-icons/fi";
import { AdminFormCard } from "../../../components/AdminFormCard";
import { AdminSection } from "../../../components/AdminSection";
import { AdminDescriptionList } from "../../../components/AdminDescriptionList";
import { AdminDescriptionItem } from "../../../components/AdminDescriptionItem";
import { articleTypeLabels } from "../../../utils/articleTypes";
import { AdminLoading } from "../../../components/AdminLoading";

export function ArticleView() {
  const navigate = useNavigate();

  const { showToast } = useToast();

  const { slug } = useParams();

  const [article, setArticle] = useState<ArticleResponseDto | null>(null);

  const load = useCallback(async () => {
    try {
      const response = await articlesService.getBySlug(slug!);
      setArticle(response.data);
    } catch (error) {
      showToast({
        title: "Ops! Não foi possível carregar a artigo ou dossiê",
        description: `Ocorreu um erro ao buscar os dados. Tente novamente. \n ${error}`,
        type: "danger",
      });
    }
  }, [showToast, slug]);

  useEffect(() => {
    if (!article) {
      (async () => {
        await load();
      })();
    }
  }, [article, load]);

  if (!article) {
    return <AdminLoading text="Carregando artigo..." />;
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
            onClick={() => navigate(`/admin/artigos/${slug}/editar`)}
          >
            <FiEdit2 />
            Editar
          </AdminButton>
        </HeaderActions>

        <Title>{article.type === "ARTICLE" ? "Artigo" : "Dossiê"}</Title>
      </Header>

      <ContentWrapper>
        <CoverWrapper to={article.externalUrl} target={"_blank"}>
          <Cover src={article.coverUrl} />

          <ArticleTitle>{article.title}</ArticleTitle>

          <Subtitle>{article.year}</Subtitle>
        </CoverWrapper>

        <AdminFormCard>
          <AdminSection title="Dados Gerais">
            <AdminDescriptionList>
              <AdminDescriptionItem label="Título" value={article.title} />

              <AdminDescriptionItem label="Slug" value={article.slug} />

              <AdminDescriptionItem
                label="Tipo"
                value={articleTypeLabels[article.type]}
              />

              <AdminDescriptionItem label="Volume" value={article.volume} />

              <AdminDescriptionItem label="Ano" value={article.year} />

              <AdminDescriptionItem label="Editora" value={article.journal} />

              <AdminDescriptionItem label="Doi" value={article.doi} />

              <AdminDescriptionItem label="Link" value={article.externalUrl} />
            </AdminDescriptionList>
          </AdminSection>
        </AdminFormCard>
      </ContentWrapper>
      <AdminFormCard>
        <AdminSection title="Descrição">
          <AdminDescriptionItem label="Descrição" value={article.summary} />
        </AdminSection>
      </AdminFormCard>
      <AdminFormCard>
        <AdminSection
          title={`${article.authors.length > 1 ? "Autores" : "Autor"}`}
        >
          {article.authors.map((author, index) => (
            <AdminDescriptionItem
              key={index}
              value={`${author.academicTitle!.abbreviation} ${author.name} - ${author.institution!.acronym}`}
            />
          ))}
        </AdminSection>
      </AdminFormCard>
    </Container>
  );
}
