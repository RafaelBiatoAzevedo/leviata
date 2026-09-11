import { FiArrowLeft, FiEdit2 } from "react-icons/fi";
import { AdminButton } from "../../../components/AdminButton";
import { Container, Header, HeaderActions, Title } from "./styles";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "../../../../hooks/useToast";
import type { VideoResponseDto } from "../../../dtos/videos/VideoResponseDto";
import { AdminFormCard } from "../../../components/AdminFormCard";
import { AdminSection } from "../../../components/AdminSection";
import { AdminDescriptionList } from "../../../components/AdminDescriptionList";
import { AdminDescriptionItem } from "../../../components/AdminDescriptionItem";
import { AdminLoading } from "../../../components/AdminLoading";
import { videosService } from "../../../services/videos";

export function VideoView() {
  const navigate = useNavigate();

  const { showToast } = useToast();

  const { slug } = useParams();

  const [video, setVideo] = useState<VideoResponseDto | null>(null);

  const loadVideo = useCallback(async () => {
    try {
      const response = await videosService.getBySlug(slug!);
      setVideo(response.data);
    } catch (error) {
      showToast({
        title: "Ops! Não foi possível carregar a video",
        description: `Ocorreu um erro ao buscar os dados. Tente novamente. \n ${error}`,
        type: "danger",
      });
    }
  }, [showToast, slug]);

  useEffect(() => {
    if (!video) {
      (async () => {
        await loadVideo();
      })();
    }
  }, [video, loadVideo]);

  if (!video) {
    return <AdminLoading text="Carregando video..." />;
  }

  return (
    <Container>
      <Header>
        <HeaderActions>
          <AdminButton variant="outline" onClick={() => navigate(-1)}>
            <FiArrowLeft />
            Voltar
          </AdminButton>

          <AdminButton onClick={() => navigate(`/admin/videos/${slug}/editar`)}>
            <FiEdit2 />
            Editar
          </AdminButton>
        </HeaderActions>

        <Title>Banca</Title>
      </Header>

      <AdminFormCard>
        <AdminSection title="Dados Gerais">
          <AdminDescriptionList>
            <AdminDescriptionItem label="Título" value={video.title} />

            <AdminDescriptionItem label="Slug" value={video.slug} />
          </AdminDescriptionList>
        </AdminSection>
      </AdminFormCard>

      <AdminFormCard>
        <AdminSection
          title={`${video.people.length > 1 ? "Participantes" : "Participante"}`}
        >
          {video.people.map((person, index) => (
            <AdminDescriptionItem
              key={index}
              value={`${person.academicTitle!.abbreviation} ${person.name} - ${person.institution!.acronym}`}
            />
          ))}
        </AdminSection>
      </AdminFormCard>
    </Container>
  );
}
