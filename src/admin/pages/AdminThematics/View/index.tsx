import { FiArrowLeft, FiEdit2 } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { AdminButton } from "../../../components/AdminButton";
import { AdminFormCard } from "../../../components/AdminFormCard";
import { AdminSection } from "../../../components/AdminSection";
import { AdminDescriptionList } from "../../../components/AdminDescriptionList";
import { AdminDescriptionItem } from "../../../components/AdminDescriptionItem";
import { AdminLoading } from "../../../components/AdminLoading";
import { AdminError } from "../../../components/AdminError";
import { thematicsService } from "../../../services/thematics";
import type { ThematicResponseDto } from "../../../dtos/thematics/ThematicResponseDto";
import {
  Container,
  Header,
  HeaderActions,
  Title,
  VideoList,
  VideoItem,
  VideoPreview,
} from "./styles";

export function ThematicView() {
  const { slug } = useParams();
  return <ThematicDetails key={slug} slug={slug} />;
}

function ThematicDetails({ slug }: { slug?: string }) {
  const navigate = useNavigate();
  const [thematic, setThematic] = useState<ThematicResponseDto | null>(null);
  const [loading, setLoading] = useState(Boolean(slug));
  const [error, setError] = useState("");
  useEffect(() => {
    if (!slug) return;
    const controller = new AbortController();
    thematicsService
      .getDetails(slug, controller.signal)
      .then(({ data }) => {
        if (!controller.signal.aborted) setThematic(data);
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setError("Não foi possível carregar a temática.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [slug]);

  if (loading) return <AdminLoading text="Carregando temática..." />;
  if (!thematic)
    return (
      <Container>
        <AdminError>{error || "Temática não encontrada."}</AdminError>
        <AdminButton
          variant="outline"
          onClick={() => navigate("/admin/tematicas")}
        >
          Voltar
        </AdminButton>
      </Container>
    );

  return (
    <Container>
      <Header>
        <HeaderActions>
          <AdminButton
            variant="outline"
            onClick={() => navigate("/admin/tematicas")}
          >
            <FiArrowLeft /> Voltar
          </AdminButton>
          <AdminButton
            onClick={() => navigate(`/admin/tematicas/${thematic.slug}/editar`)}
          >
            <FiEdit2 /> Editar
          </AdminButton>
        </HeaderActions>
        <Title>Temática</Title>
      </Header>
      <AdminFormCard>
        <AdminSection title="Dados gerais">
          <AdminDescriptionList>
            <AdminDescriptionItem label="Título" value={thematic.title} />
            <AdminDescriptionItem label="Slug" value={thematic.slug} />
            <AdminDescriptionItem
              label="Coordenador"
              value={thematic.coordinator?.name}
            />
            <AdminDescriptionItem
              label="Descrição"
              value={thematic.description}
            />
          </AdminDescriptionList>
        </AdminSection>
      </AdminFormCard>
      <AdminFormCard>
        <AdminSection title="Vídeo principal">
          {thematic.mainVideo ? (
            <>
              <AdminDescriptionItem
                label="Título"
                value={thematic.mainVideo.title}
              />
              <VideoPreview>
                <iframe
                  src={thematic.mainVideo.embedLink}
                  title={thematic.mainVideo.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </VideoPreview>
            </>
          ) : (
            <p>Nenhum vídeo principal vinculado.</p>
          )}
        </AdminSection>
      </AdminFormCard>
      <AdminFormCard>
        <AdminSection title="Vídeos adicionais">
          <VideoList>
            {thematic.additionalVideos.map((link) => (
              <VideoItem key={link.id}>
                <AdminDescriptionList>
                  <AdminDescriptionItem
                    label="Título na temática"
                    value={link.title}
                  />
                  <AdminDescriptionItem
                    label="Vídeo cadastrado"
                    value={link.video.title}
                  />
                  <AdminDescriptionItem
                    label="Pessoa vinculada"
                    value={link.person?.name}
                  />
                  <AdminDescriptionItem
                    label="Descrição"
                    value={link.description}
                  />
                </AdminDescriptionList>
                <VideoPreview>
                  <iframe
                    src={link.video.embedLink}
                    title={link.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </VideoPreview>
              </VideoItem>
            ))}
            {!thematic.additionalVideos.length && (
              <p>Nenhum vídeo adicional vinculado.</p>
            )}
          </VideoList>
        </AdminSection>
      </AdminFormCard>
    </Container>
  );
}
