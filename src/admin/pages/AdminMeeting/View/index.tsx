import { FiArrowLeft, FiEdit2 } from "react-icons/fi";
import { AdminButton } from "../../../components/AdminButton";
import {
  MeetingTitle,
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
import { meetingsService } from "../../../services/meetings";
import { useToast } from "../../../../hooks/useToast";
import type { MeetingResponseDto } from "../../../dtos/meetings/MeetingResponseDto";
import { AdminFormCard } from "../../../components/AdminFormCard";
import { AdminSection } from "../../../components/AdminSection";
import { AdminDescriptionList } from "../../../components/AdminDescriptionList";
import { AdminDescriptionItem } from "../../../components/AdminDescriptionItem";
import { AdminLoading } from "../../../components/AdminLoading";

export function MeetingView() {
  const navigate = useNavigate();

  const { showToast } = useToast();

  const { slug } = useParams();

  const [meeting, setMeeting] = useState<MeetingResponseDto | null>(null);

  const loadMeeting = useCallback(async () => {
    try {
      const response = await meetingsService.getBySlug(slug!);
      setMeeting(response.data);
    } catch (error) {
      showToast({
        title: "Ops! Não foi possível carregar o livro",
        description: `Ocorreu um erro ao buscar os dados. Tente novamente. \n ${error}`,
        type: "danger",
      });
    }
  }, [showToast, slug]);

  useEffect(() => {
    if (!meeting) {
      (async () => {
        await loadMeeting();
      })();
    }
  }, [meeting, loadMeeting]);

  if (!meeting) {
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
        <CoverWrapper to={meeting.registrationUrl} target={"_blank"}>
          <Cover src={meeting.coverUrl} />

          <MeetingTitle>{meeting.title}</MeetingTitle>

          <Subtitle>{meeting.year}</Subtitle>
        </CoverWrapper>

        <AdminFormCard>
          <AdminSection title="Dados Gerais">
            <AdminDescriptionList>
              <AdminDescriptionItem label="Título" value={meeting.title} />

              <AdminDescriptionItem label="Slug" value={meeting.slug} />

              <AdminDescriptionItem
                label="Subtítulo"
                value={meeting.subtitle}
              />

              <AdminDescriptionItem label="Isbn" value={meeting.isbn} />

              <AdminDescriptionItem label="Ano" value={meeting.year} />

              <AdminDescriptionItem label="Editora" value={meeting.publisher} />

              <AdminDescriptionItem label="Link" value={meeting.externalUrl} />
            </AdminDescriptionList>
          </AdminSection>
        </AdminFormCard>
      </ContentWrapper>
      <AdminFormCard>
        <AdminSection title="Descrição">
          <AdminDescriptionItem label="Descrição" value={meeting.description} />
        </AdminSection>
      </AdminFormCard>
      <AdminFormCard>
        <AdminSection
          title={`${meeting.authors.length > 1 ? "Autores" : "Autor"}`}
        >
          {meeting.authors.map((author, index) => (
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
