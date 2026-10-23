import { Link, useParams } from "react-router-dom";
import {
  FiArrowUpRight,
  FiEdit3,
  FiFileText,
  FiPlayCircle,
  FiVideo,
} from "react-icons/fi";
import { usePublicRecord } from "../../hooks/usePublicData";
import type { GalleryResource } from "../../admin/services/gallery";
import type { ImageResponseDto } from "../../admin/dtos/ImageResponseDto";
import type { PersonResponseDto } from "../../admin/dtos/people/PersonResponseDto";
import type { TMeetingType } from "../../admin/types/TMeetingType";
import { PersonCategory } from "../../admin/types/TPersonCategory";
import { Loading } from "../Loading";
import { ParagraphText } from "../ParagraphText";
import { SectionHeader } from "../SectionHeader";
import { ImageGallery } from "../ImageGallery";
import { ImageFrame } from "../ImageFrame";
import { HistoryDivider } from "../HistotyDivider";
import { PublicPeople } from "../PublicPeople";
import { YearBadge } from "../YearBadge";
import { timelineExternalUrl } from "../../utils/timeline";
import {
  AccessLinks,
  AccessSection,
  Container,
  Content,
  Cover,
  Header,
  Links,
  Status,
} from "./styles";

interface GalleryRecord {
  title: string;
  type?: TMeetingType;
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
  const parsedDate = data.date ? new Date(data.date) : null;
  const formattedDate =
    parsedDate &&
    Number.isFinite(parsedDate.getTime()) &&
    resource !== "meetings"
      ? new Intl.DateTimeFormat("pt-BR", dateOptions).format(parsedDate)
      : undefined;

  const links = [
    { label: "Inscrições", url: data.registrationUrl, Icon: FiEdit3 },
    {
      label: resource === "meetings" ? "Acessar conteúdo" : "Gravação",
      url: data.recordingUrl,
      Icon: FiPlayCircle,
    },
    {
      label:
        resource === "meetings" ? "Acessar transmissão" : "Acessar reunião",
      url: data.meetingUrl,
      Icon: FiVideo,
    },
    { label: "Documento", url: data.documentUrl, Icon: FiFileText },
  ].flatMap((link) => {
    const url = timelineExternalUrl(link.url);
    return url ? [{ ...link, url }] : [];
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
          ? [
              {
                title:
                  data.type === "DOCUMENTARY"
                    ? "Participantes"
                    : "Palestrantes",
                people: data.speakers,
              },
            ]
          : resource === "research"
            ? [
                {
                  title: "Pesquisadores",
                  people: data.people?.filter(
                    (person) => person.category !== PersonCategory.DISCENTE,
                  ),
                },
                {
                  title: "Discentes",
                  people: data.people?.filter(
                    (person) => person.category === PersonCategory.DISCENTE,
                  ),
                },
              ]
            : [{ title: "Pesquisadores", people: data.people }];

  return (
    <Container>
      <Content>
        <Header>
          <SectionHeader center title={data.title} subtitle={formattedDate} />
          {resource === "meetings" && <YearBadge date={data.date} />}
        </Header>
        {data.coverUrl &&
          (resource === "meetings" ? (
            <ImageFrame src={data.coverUrl} alt={data.title} />
          ) : (
            <Cover src={data.coverUrl} alt={data.title} />
          ))}
        {data.location && <p>{data.location}</p>}
        {(data.description || data.content) && (
          <ParagraphText text={data.description || data.content || ""} />
        )}
        {resource === "meetings" && links.length > 0 && (
          <>
            <HistoryDivider />
            <AccessSection>
              <SectionHeader as="h2" small title="Acessos e materiais" />
              <AccessLinks>
                {links.map(({ label, url, Icon }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon aria-hidden="true" />
                    <span>{label}</span>
                    <FiArrowUpRight aria-hidden="true" />
                  </a>
                ))}
              </AccessLinks>
            </AccessSection>
            {(data.speakers?.some((person) => person?.name?.trim()) ||
              !!data.images?.length ||
              !!data.supports?.length ||
              !!data.presentedWorks?.length) && <HistoryDivider />}
          </>
        )}
        {groups.map((group) => (
          <PublicPeople
            key={group.title}
            title={group.title}
            people={group.people}
            compact={resource === "meetings" || resource === "research"}
            showAcademicAbbreviation={resource !== "research"}
          />
        ))}
        {resource !== "meetings" && links.length > 0 && (
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
