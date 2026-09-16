import { FiArrowLeft, FiEdit2 } from "react-icons/fi";
import { AdminButton } from "../../../components/AdminButton";
import {
  SearchTitle,
  Container,
  ContentWrapper,
  Cover,
  CoverWrapper,
  Header,
  HeaderActions,
  Title,
} from "./styles";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { researchService } from "../../../services/research";
import { useToast } from "../../../../hooks/useToast";
import type { SearchResponseDto } from "../../../dtos/research/SearchResponseDto";
import { AdminFormCard } from "../../../components/AdminFormCard";
import { AdminSection } from "../../../components/AdminSection";
import { AdminDescriptionList } from "../../../components/AdminDescriptionList";
import { AdminDescriptionItem } from "../../../components/AdminDescriptionItem";
import { AdminLoading } from "../../../components/AdminLoading";

export function SearchView() {
  const navigate = useNavigate();

  const { showToast } = useToast();

  const { slug } = useParams();

  const [search, setSearch] = useState<SearchResponseDto | null>(null);

  const loadSearch = useCallback(async () => {
    try {
      const response = await researchService.getBySlug(slug!);
      setSearch(response.data);
    } catch (error) {
      showToast({
        title: "Ops! Não foi possível carregar o pesquisa",
        description: `Ocorreu um erro ao buscar os dados. Tente novamente. \n ${error}`,
        type: "danger",
      });
    }
  }, [showToast, slug]);

  useEffect(() => {
    if (!search) {
      (async () => {
        await loadSearch();
      })();
    }
  }, [search, loadSearch]);

  if (!search) {
    return <AdminLoading text="Carregando pesquisa..." />;
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
            onClick={() => navigate(`/admin/pesquisas/${slug}/editar`)}
          >
            <FiEdit2 />
            Editar
          </AdminButton>
        </HeaderActions>

        <Title>Pesquisa</Title>
      </Header>

      <ContentWrapper>
        <CoverWrapper to={""} target={"_blank"}>
          <Cover src={search.coverUrl!} />

          <SearchTitle>{search.title}</SearchTitle>
        </CoverWrapper>

        <AdminFormCard>
          <AdminSection title="Dados Gerais">
            <AdminDescriptionList>
              <AdminDescriptionItem label="Título" value={search.title} />

              <AdminDescriptionItem label="Slug" value={search.slug} />
            </AdminDescriptionList>
          </AdminSection>
        </AdminFormCard>
      </ContentWrapper>
      <AdminFormCard>
        <AdminSection title="Descrição">
          <AdminDescriptionItem label="Descrição" value={search.content} />
        </AdminSection>
      </AdminFormCard>
      <AdminFormCard>
        <AdminSection
          title={`${search.people.length > 1 ? "Autores" : "Autor"}`}
        >
          {search.people.map((author, index) => (
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
