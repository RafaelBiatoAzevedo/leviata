import { Link, useParams } from "react-router-dom";
import { usePublicRecord } from "../../hooks/usePublicData";
import type { GalleryResource } from "../../admin/services/gallery";
import type { ImageResponseDto } from "../../admin/dtos/ImageResponseDto";
import { Loading } from "../Loading";
import { ParagraphText } from "../ParagraphText";
import { SectionHeader } from "../SectionHeader";
import { ImageGallery } from "../ImageGallery";
import { Container, Content, Cover, Links, Status } from "./styles";

interface GalleryRecord {
  title: string;
  date?: string;
  coverUrl?: string | null;
  description?: string | null;
  content?: string | null;
  location?: string | null;
  images: ImageResponseDto[];
  supports?: ImageResponseDto[];
  registrationUrl?: string | null;
  recordingUrl?: string | null;
  meetingUrl?: string | null;
  documentUrl?: string | null;
  presentedWorks?: { id: string; slug: string; title: string }[];
}

export function GalleryDetails({
  resource,
  label,
}: {
  resource: GalleryResource;
  label: string;
}) {
  const { id } = useParams();
  const { data, loading, error } = usePublicRecord<GalleryRecord>(resource, id);
  if (loading)
    return (
      <Status>
        <Loading />
        <p>Carregando {label}...</p>
      </Status>
    );
  if (error || !data)
    return (
      <Status>
        <p>Não foi possível carregar {label}.</p>
      </Status>
    );

  const links = [
    { label: "Inscrições", url: data.registrationUrl },
    { label: "Gravação", url: data.recordingUrl },
    { label: "Acessar reunião", url: data.meetingUrl },
    { label: "Documento", url: data.documentUrl },
  ].filter((link) => link.url);

  return (
    <Container>
      <Content>
        <SectionHeader
          center
          title={data.title}
          subtitle={
            data.date
              ? new Date(data.date).toLocaleDateString("pt-BR", {
                  timeZone: "America/Sao_Paulo",
                })
              : undefined
          }
        />
        {data.coverUrl && <Cover src={data.coverUrl} alt={data.title} />}
        {data.location && <p>{data.location}</p>}
        {(data.description || data.content) && (
          <ParagraphText text={data.description || data.content || ""} />
        )}
        {links.length > 0 && (
          <Links>
            {links.map((link) => (
              <a
                key={link.label}
                href={link.url!}
                target="_blank"
                rel="noreferrer"
              >
                {link.label}
              </a>
            ))}
          </Links>
        )}
        {!!data.images?.length && (
          <>
            <SectionHeader title="Fotos" />
            <ImageGallery images={data.images} />
          </>
        )}
        {!!data.supports?.length && (
          <>
            <SectionHeader title="Apoiadores" />
            <ImageGallery images={data.supports} />
          </>
        )}
        {!!data.presentedWorks?.length && (
          <>
            <SectionHeader title="Trabalhos apresentados" />
            <Links>
              {data.presentedWorks.map((work) => (
                <Link
                  key={work.id}
                  to={`/atividades/apresentacoes-trabalhos/${work.slug}`}
                >
                  {work.title}
                </Link>
              ))}
            </Links>
          </>
        )}
      </Content>
    </Container>
  );
}
