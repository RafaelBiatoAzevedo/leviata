import { FiArrowLeft, FiEdit2 } from "react-icons/fi";
import { AdminButton } from "../../../components/AdminButton";
import {
  Container,
  ContentWrapper,
  Header,
  HeaderActions,
  Title,
} from "./styles";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { researchInstrumentsService } from "../../../services/researchInstruments";
import { useToast } from "../../../../hooks/useToast";
import type { ResearchInstrumentResponseDto } from "../../../dtos/researchInstruments/ResearchInstrumentResponseDto";
import { AdminFormCard } from "../../../components/AdminFormCard";
import { AdminSection } from "../../../components/AdminSection";
import { AdminDescriptionList } from "../../../components/AdminDescriptionList";
import { AdminDescriptionItem } from "../../../components/AdminDescriptionItem";
import { AdminLoading } from "../../../components/AdminLoading";

export function ResearchInstrumentView() {
  const navigate = useNavigate();

  const { showToast } = useToast();

  const { slug } = useParams();

  const [researchInstrument, setResearchInstrument] =
    useState<ResearchInstrumentResponseDto | null>(null);

  const loadResearchInstrument = useCallback(async () => {
    try {
      const response = await researchInstrumentsService.getBySlug(slug!);
      setResearchInstrument(response.data);
    } catch (error) {
      showToast({
        title: "Ops! Não foi possível carregar o livro",
        description: `Ocorreu um erro ao buscar os dados. Tente novamente. \n ${error}`,
        type: "danger",
      });
    }
  }, [showToast, slug]);

  useEffect(() => {
    if (!researchInstrument) {
      (async () => {
        await loadResearchInstrument();
      })();
    }
  }, [researchInstrument, loadResearchInstrument]);

  if (!researchInstrument) {
    return <AdminLoading text="Carregando livro..." />;
  }

  return (
    <Container>
      <Header>
        <HeaderActions>
          <AdminButton variant="outline" onClick={() => navigate(-1)}>
            <FiArrowLeft />
            Voltar
          </AdminButton>

          <AdminButton onClick={() => navigate(`/admin/livros/${slug}/editar`)}>
            <FiEdit2 />
            Editar
          </AdminButton>
        </HeaderActions>

        <Title>Livro</Title>
      </Header>

      <ContentWrapper>
        {/* <CoverWrapper to={researchInstrument.externalUrl} target={"_blank"}>
          <Cover src={researchInstrument.coverUrl} />

          <ResearchInstrumentTitle>
            {researchInstrument.title}
          </ResearchInstrumentTitle>

          <Subtitle>{researchInstrument.year}</Subtitle>
        </CoverWrapper> */}

        <AdminFormCard>
          <AdminSection title="Dados Gerais">
            <AdminDescriptionList>
              <AdminDescriptionItem
                label="Título"
                value={researchInstrument.title}
              />

              <AdminDescriptionItem
                label="Slug"
                value={researchInstrument.slug}
              />

              {/* <AdminDescriptionItem
                label="Subtítulo"
                value={researchInstrument.subtitle}
              />

              <AdminDescriptionItem
                label="Isbn"
                value={researchInstrument.isbn}
              />

              <AdminDescriptionItem
                label="Ano"
                value={researchInstrument.year}
              />

              <AdminDescriptionItem
                label="Editora"
                value={researchInstrument.publisher}
              /> */}
            </AdminDescriptionList>

            <AdminDescriptionItem
              label="Link"
              value={researchInstrument.externalUrl}
            />
          </AdminSection>
        </AdminFormCard>
      </ContentWrapper>
      <AdminFormCard>
        <AdminSection title="Descrição">
          <AdminDescriptionItem
            label="Descrição"
            value={researchInstrument.content}
          />
        </AdminSection>
      </AdminFormCard>
      <AdminFormCard>
        <AdminSection
          title={`${researchInstrument.people.length > 1 ? "Participantes" : "Participante"}`}
        >
          {researchInstrument.people.map((author, index) => (
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
