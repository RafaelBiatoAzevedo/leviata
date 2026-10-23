import { Link, useParams } from "react-router-dom";
import { usePublicRecord } from "../../hooks/usePublicData";
import type { GalleryResource } from "../../admin/services/gallery";
import type { ImageResponseDto } from "../../admin/dtos/ImageResponseDto";
import type { PersonResponseDto } from "../../admin/dtos/people/PersonResponseDto";
import { Loading } from "../Loading";
import { ParagraphText } from "../ParagraphText";
import { SectionHeader } from "../SectionHeader";
import { ImageGallery } from "../ImageGallery";
import { PublicPeople } from "../PublicPeople";
import { timelineExternalUrl } from "../../utils/timeline";
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
  people?: Partial<PersonResponseDto>[];
  speakers?: Partial<PersonResponseDto>[];
  judges?: Partial<PersonResponseDto>[];
  jurors?: Partial<PersonResponseDto>[];
  prosecutors?: Partial<PersonResponseDto>[];
  defenders?: Partial<PersonResponseDto>[];
  bailiffs?: Partial<PersonResponseDto>[];
  candidate?: Partial<PersonResponseDto>;
  advisor?: Partial<PersonResponseDto>;
  members?: Partial<PersonResponseDto>[];
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
      <Status role="status">
        <Loading />
        <p>Carregando {label}...</p>
      </Status>
    );
  if (error || !data)
    return (
      <Status role="alert">
        <p>Não foi possível carregar {label}.</p>
      </Status>
    );

  const dateOptions: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: ["meetings", "boards", "juries"].includes(resource)
      ? "UTC"
      : "America/Sao_Paulo",
  };
  if (resource === "presented-works") {
    dateOptions.hour = "2-digit";
    dateOptions.minute = "2-digit";
  }

  const links = [
    { label: "Inscrições", url: data.registrationUrl },
    { label: "Gravação", url: data.recordingUrl },
    { label: "Acessar reunião", url: data.meetingUrl },
    { label: "Documento", url: data.documentUrl },
  ].flatMap((link) => {
    const url = timelineExternalUrl(link.url);
    return url ? [{ label: link.label, url }] : [];
  });
  const groups =
    resource === "juries"
      ? [
          { title: "Juízes", people: data.judges },
          { title: "Jurados", people: data.jurors },
          { title: "Acusação", people: data.prosecutors },
          { title: "Defesa", people: data.defenders },
          { title: "Oficiais de justiça", people: data.bailiffs },
        ]
      : resource === "boards"
        ? [
            {
              title: "Candidato",
              people: data.candidate ? [data.candidate] : [],
            },
            { title: "Orientador", people: data.advisor ? [data.advisor] : [] },
            { title: "Integrantes da banca", people: data.members },
          ]
        : resource === "meetings"
          ? [{ title: "Palestrantes", people: data.speakers }]
          : [{ title: "Pesquisadores", people: data.people }];

  return (
    <Container>
      <Content>
        <SectionHeader
          center
          title={data.title}
          subtitle={
            data.date
              ? new Intl.DateTimeFormat("pt-BR", dateOptions).format(
                  new Date(data.date),
                )
              : undefined
          }
        />
        {data.coverUrl && <Cover src={data.coverUrl} alt={data.title} />}
        {data.location && <p>{data.location}</p>}
        {(data.description || data.content) && (
          <ParagraphText text={data.description || data.content || ""} />
        )}
        {groups.map((group) => (
          <PublicPeople
            key={group.title}
            title={group.title}
            people={group.people}
          />
        ))}
        {links.length > 0 && (
          <Links>
            {links.map((link) => (
              <a
                key={link.label}
                href={link.url}
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
            <SectionHeader as="h2" small title="Fotos" />
            <ImageGallery images={data.images} />
          </>
        )}
        {!!data.supports?.length && (
          <>
            <SectionHeader as="h2" small title="Apoiadores" />
            <ImageGallery images={data.supports} />
          </>
        )}
        {!!data.presentedWorks?.length && (
          <>
            <SectionHeader as="h2" small title="Trabalhos apresentados" />
            <Links>
              {data.presentedWorks.map((work) => (
                <Link
                  key={work.id}
                  to={`/atividades/apresentacoes-trabalhos/${encodeURIComponent(work.slug || work.id)}`}
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
