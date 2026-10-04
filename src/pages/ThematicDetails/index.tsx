import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  AssociatedPresentationLabel,
  AssociatedPresentationSection,
  AssociatedPresentationTitle,
  AssociatedWrapper,
  Container,
  ContainerLoading,
  Content,
  Description,
  PresentationLabel,
  PresentationSection,
  PresentationTitle,
  VideoWrapper,
} from "./styles";
import { Loading } from "../../components/Loading";
import { SectionHeader } from "../../components/SectionHeader";
import { HistoryDivider } from "../../components/HistotyDivider";
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

  return (
    <Container>
      <Content>
        <SectionHeader center title={thematic.title} />
        {thematic.description && (
          <Description>{thematic.description}</Description>
        )}
        {thematic.mainVideo && (
          <PresentationSection>
            <PresentationLabel>
              Apresentação da linha temática
            </PresentationLabel>
            <PresentationTitle>
              {thematic.coordinator?.name ?? thematic.mainVideo.title}
            </PresentationTitle>
            <VideoWrapper>
              <iframe
                src={thematic.mainVideo.embedLink}
                title={thematic.mainVideo.title}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </VideoWrapper>
            {thematic.mainVideo.description && (
              <Description>{thematic.mainVideo.description}</Description>
            )}
          </PresentationSection>
        )}
        {!!thematic.additionalVideos.length && (
          <>
            <HistoryDivider />
            <SectionHeader
              small
              title="Pesquisas vinculadas"
              subtitle="Acompanhe as pesquisas vinculadas à temática."
            />
            <AssociatedWrapper>
              {thematic.additionalVideos.map((link) => (
                <AssociatedPresentationSection key={link.id}>
                  {link.person && (
                    <AssociatedPresentationLabel>
                      {link.person.name}
                    </AssociatedPresentationLabel>
                  )}
                  <AssociatedPresentationTitle>
                    {link.title}
                  </AssociatedPresentationTitle>
                  <VideoWrapper>
                    <iframe
                      src={link.video.embedLink}
                      title={link.title}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </VideoWrapper>
                  {link.description && (
                    <Description>{link.description}</Description>
                  )}
                </AssociatedPresentationSection>
              ))}
            </AssociatedWrapper>
          </>
        )}
      </Content>
    </Container>
  );
}
