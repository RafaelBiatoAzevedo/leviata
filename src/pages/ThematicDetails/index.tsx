import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, ContainerLoading, Content, Description } from "./styles";
import { Loading } from "../../components/Loading";
import { SectionHeader } from "../../components/SectionHeader";
import { HistoryDivider } from "../../components/HistotyDivider";
import {
  VideoCarousel,
  VideoPresentation,
} from "../../components/VideoPresentation";
import { thematicsService } from "../../admin/services/thematics";
import type { ThematicResponseDto } from "../../admin/dtos/thematics/ThematicResponseDto";

export function ThematicDetails() {
  const { id } = useParams();
  return <ThematicContent key={id} identifier={id} />;
}

function ThematicContent({ identifier }: { identifier?: string }) {
  const [thematic, setThematic] = useState<ThematicResponseDto | null>(null);
  const [loading, setLoading] = useState(Boolean(identifier));
  const [error, setError] = useState("");
  useEffect(() => {
    if (!identifier) return;
    const controller = new AbortController();
    thematicsService
      .getDetails(identifier, controller.signal)
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
  }, [identifier]);

  if (loading)
    return (
      <ContainerLoading>
        <Loading />
        <p>Carregando temática...</p>
      </ContainerLoading>
    );
  if (!thematic)
    return (
      <ContainerLoading>
        <p role="alert">{error || "Temática não encontrada."}</p>
      </ContainerLoading>
    );

  const mainVideo = thematic.mainVideo
    ? {
        ...thematic.mainVideo,
        people: thematic.coordinator
          ? [thematic.coordinator]
          : thematic.mainVideo.people,
      }
    : null;
  const additionalVideos = thematic.additionalVideos.map((link) => ({
    ...link.video,
    id: link.id,
    title: link.title,
    description: link.description,
    people: link.person ? [link.person] : [],
  }));

  return (
    <Container>
      <Content>
        <SectionHeader center title={thematic.title} />
        {thematic.description && (
          <Description>{thematic.description}</Description>
        )}
        {mainVideo && (
          <VideoPresentation
            video={mainVideo}
            showTitle={false}
            uppercasePresenter
          />
        )}
        {mainVideo && additionalVideos.length > 0 && <HistoryDivider />}
        <VideoCarousel
          videos={additionalVideos}
          title="Pesquisas vinculadas"
          subtitle="Acompanhe as pesquisas vinculadas à temática."
        />
      </Content>
    </Container>
  );
}
