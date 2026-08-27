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
  // Subtitle,
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
import { formatDate } from "../../../utils/formatDate";
import { meetingTypeLabels } from "../../../types/TMeetingType";

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
        title: "Ops! Não foi possível carregar o encontro",
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
    return <AdminLoading text="Carregando encontro..." />;
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
            onClick={() => navigate(`/admin/reunioes/${slug}/editar`)}
          >
            <FiEdit2 />
            Editar
          </AdminButton>
        </HeaderActions>

        <Title>Encontro</Title>
      </Header>

      <ContentWrapper>
        <CoverWrapper to={meeting.registrationUrl!} target={"_blank"}>
          {!!meeting.coverUrl && <Cover src={meeting.coverUrl} />}

          <MeetingTitle>{meeting.title}</MeetingTitle>
        </CoverWrapper>

        <AdminFormCard>
          <AdminSection title="Dados Gerais">
            <AdminDescriptionList>
              <AdminDescriptionItem label="Título" value={meeting.title} />

              <AdminDescriptionItem label="Slug" value={meeting.slug} />

              <AdminDescriptionItem
                label="Data"
                value={formatDate(meeting.date)}
              />

              <AdminDescriptionItem
                label="Tipo"
                value={meetingTypeLabels[meeting.type]}
              />
            </AdminDescriptionList>
            <AdminDescriptionItem label="Local" value={meeting.location} />
          </AdminSection>
        </AdminFormCard>
      </ContentWrapper>

      <AdminFormCard>
        <AdminSection title="Links">
          <AdminDescriptionList>
            <AdminDescriptionItem
              label="Link do conteúdo"
              value={meeting.registrationUrl}
            />
            <AdminDescriptionItem
              label="Link da transmissão"
              value={meeting.meetingUrl}
            />
          </AdminDescriptionList>
        </AdminSection>
      </AdminFormCard>

      <AdminFormCard>
        <AdminSection title="Descrição">
          <AdminDescriptionItem label="Descrição" value={meeting.description} />
        </AdminSection>
      </AdminFormCard>
      <AdminFormCard>
        <AdminSection
          title={`${meeting.speakers.length > 1 ? "Participantes" : "Participante"}`}
        >
          {meeting.speakers.map((author, index) => (
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
