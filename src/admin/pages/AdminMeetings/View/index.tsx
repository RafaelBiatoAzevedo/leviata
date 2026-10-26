import { formatPersonLabel } from "../../../utils/formatPersonLabel";
import { ImageGallery } from "../../../../components/ImageGallery";
import { FiArrowLeft, FiArrowUpRight, FiEdit2 } from "react-icons/fi";
import { AdminButton } from "../../../components/AdminButton";
import {
  MeetingTitle,
  Container,
  ContentWrapper,
  Cover,
  CoverWrapper,
  Header,
  HeaderActions,
  ExternalLink,
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
import { timelineExternalUrl } from "../../../../utils/timeline";

function renderLink(value: string | null) {
  const url = timelineExternalUrl(value);
  if (!url) return value?.trim() || undefined;
  return (
    <ExternalLink href={url} target="_blank" rel="noopener noreferrer">
      <span>{url}</span>
      <FiArrowUpRight aria-hidden="true" />
    </ExternalLink>
  );
}

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
  const coverHref =
    timelineExternalUrl(meeting.registrationUrl) ||
    timelineExternalUrl(meeting.recordingUrl) ||
    timelineExternalUrl(meeting.meetingUrl);

  return (
    <Container>
      <Header>
        <HeaderActions>
          <AdminButton variant="outline" onClick={() => navigate(-1)}>
            <FiArrowLeft />
            Voltar
          </AdminButton>

          <AdminButton
            onClick={() => navigate(`/admin/encontros/${slug}/editar`)}
          >
            <FiEdit2 />
            Editar
          </AdminButton>
        </HeaderActions>

        <Title>Encontro</Title>
      </Header>

      <ContentWrapper>
        <CoverWrapper
          href={coverHref || undefined}
          target={coverHref ? "_blank" : undefined}
          rel={coverHref ? "noopener noreferrer" : undefined}
        >
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
              <AdminDescriptionItem
                label="Exibição no portal"
                value={
                  meeting.isInternal
                    ? "Interno — exibido nas listas"
                    : "Externo — acesso pelas notícias"
                }
              />
            </AdminDescriptionList>
            <AdminDescriptionItem label="Local" value={meeting.location} />
          </AdminSection>
        </AdminFormCard>
      </ContentWrapper>

      <AdminFormCard>
        <AdminSection title="Links">
          <AdminDescriptionList columns={1}>
            <AdminDescriptionItem
              label="Link de inscrições"
              value={renderLink(meeting.registrationUrl)}
            />
            <AdminDescriptionItem
              label="Link do conteúdo"
              value={renderLink(meeting.recordingUrl)}
            />
            <AdminDescriptionItem
              label="Link da transmissão"
              value={renderLink(meeting.meetingUrl)}
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
              value={formatPersonLabel(author)}
            />
          ))}
        </AdminSection>
      </AdminFormCard>
      <AdminFormCard>
        <AdminSection title="Fotos">
          <ImageGallery images={meeting.images} />
          {!meeting.images?.length && <p>Nenhuma imagem adicionada.</p>}
        </AdminSection>
      </AdminFormCard>
    </Container>
  );
}
