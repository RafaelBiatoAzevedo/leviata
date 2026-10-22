import { Link, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiArrowUpRight,
  FiCalendar,
  FiMapPin,
  FiUser,
} from "react-icons/fi";
import type { PresentedWorkResponseDto } from "../../admin/dtos/presentedWorks/PresentedWorkResponseDto";
import { meetingTypeLabels } from "../../admin/types/TMeetingType";
import { personCategoryLabels } from "../../admin/types/TPersonCategory";
import { ImageGallery } from "../../components/ImageGallery";
import { Loading } from "../../components/Loading";
import { SectionHeader } from "../../components/SectionHeader";
import { usePublicRecord } from "../../hooks/usePublicData";
import { timelineDateLabel, timelineExternalUrl } from "../../utils/timeline";
import {
  Avatar,
  Body,
  Container,
  Content,
  Details,
  Meeting,
  Profile,
  ProfileHeader,
  Profiles,
  RecordDates,
  ResourceLinks,
  Section,
  Status,
} from "./styles";

function recordDate(value?: string) {
  if (!value || !Number.isFinite(new Date(value).getTime())) return null;
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(value));
}

export function PresentedWorkDetails() {
  const { id } = useParams();
  const { data, loading, error } = usePublicRecord<PresentedWorkResponseDto>(
    "presented-works",
    id,
  );

  if (loading)
    return (
      <Status role="status">
        <Loading />
        <p>Carregando a apresentação...</p>
      </Status>
    );
  if (error || !data)
    return (
      <Status role="alert">
        <p>Não foi possível carregar a apresentação.</p>
        <Link to="/atividades/apresentacoes-trabalhos">
          Voltar às apresentações
        </Link>
      </Status>
    );

  const presenters = (data.authors ?? []).filter((person) =>
    person?.name?.trim(),
  );
  const meeting = data.meeting;
  const links = [
    { label: "Inscrições", url: data.registrationUrl },
    { label: "Transmissão", url: data.meetingUrl },
    { label: "Gravação", url: data.recordingUrl },
    { label: "Documento", url: data.documentUrl },
  ].flatMap((link) => {
    const href = timelineExternalUrl(link.url);
    return href ? [{ label: link.label, href }] : [];
  });
  const createdAt = recordDate(data.createdAt);
  const updatedAt = recordDate(data.updatedAt);

  return (
    <Container>
      <Content>
        <SectionHeader center title={data.title} />
        <Body>
          <Details>
            <div>
              <dt>
                <FiCalendar aria-hidden="true" />
                Data e hora
              </dt>
              <dd>
                {timelineDateLabel({
                  id: data.id,
                  title: data.title,
                  date: data.date,
                })}
              </dd>
            </div>
            <div>
              <dt>
                <FiMapPin aria-hidden="true" />
                Local
              </dt>
              <dd>{data.location?.trim() || "Não informado."}</dd>
            </div>
          </Details>

          <Section>
            <SectionHeader
              as="h2"
              small
              title={
                presenters.length === 1 ? "Apresentador" : "Apresentadores"
              }
            />
            {presenters.length === 0 && <p>Apresentadores não informados.</p>}
            <Profiles>
              {presenters.map((person, index) => {
                const orcid = person.orcid?.trim();
                const profileLinks = [
                  { label: "Currículo Lattes", url: person.lattesUrl },
                  { label: "Site", url: person.website },
                  { label: "LinkedIn", url: person.linkedinUrl },
                  {
                    label: "ORCID",
                    url:
                      orcid && /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/i.test(orcid)
                        ? `https://orcid.org/${orcid}`
                        : orcid,
                  },
                ].flatMap((link) => {
                  const href = timelineExternalUrl(link.url);
                  return href ? [{ label: link.label, href }] : [];
                });
                return (
                  <Profile key={person.id || `${person.name}-${index}`}>
                    <ProfileHeader>
                      <Avatar>
                        <FiUser aria-hidden="true" />
                        {person.imageUrl && (
                          <img
                            src={person.imageUrl}
                            alt={`Foto de ${person.name}`}
                            loading="lazy"
                            onError={(event) => {
                              event.currentTarget.hidden = true;
                            }}
                          />
                        )}
                      </Avatar>
                      <div>
                        <h3>
                          {[
                            person.honorificTitle,
                            person.academicTitle?.abbreviation,
                            person.name,
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        </h3>
                        {person.academicTitle?.name && (
                          <p>{person.academicTitle.name}</p>
                        )}
                        {person.institution?.name && (
                          <p>
                            {person.institution.name}
                            {person.institution.acronym &&
                              ` (${person.institution.acronym})`}
                          </p>
                        )}
                        {!person.institution?.name &&
                          person.institution?.acronym && (
                            <p>{person.institution.acronym}</p>
                          )}
                        {person.category && (
                          <small>{personCategoryLabels[person.category]}</small>
                        )}
                      </div>
                    </ProfileHeader>
                    {person.bio?.trim() && <p>{person.bio}</p>}
                    {profileLinks.length > 0 && (
                      <ResourceLinks>
                        {profileLinks.map((link) => (
                          <a
                            key={link.label}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {link.label}
                            <FiArrowUpRight aria-hidden="true" />
                          </a>
                        ))}
                      </ResourceLinks>
                    )}
                  </Profile>
                );
              })}
            </Profiles>
          </Section>

          {meeting && (
            <Section>
              <SectionHeader as="h2" small title="Encontro vinculado" />
              <Meeting>
                {meeting.coverUrl && (
                  <img
                    src={meeting.coverUrl}
                    alt={`Capa de ${meeting.title}`}
                    loading="lazy"
                  />
                )}
                <div>
                  <span>{meetingTypeLabels[meeting.type]}</span>
                  <h3>{meeting.title}</h3>
                  <p>{timelineDateLabel({ ...meeting, dateOnly: true })}</p>
                  {meeting.location && <p>{meeting.location}</p>}
                  {meeting.description && <p>{meeting.description}</p>}
                  <ResourceLinks>
                    <Link
                      to={`/atividades/encontros-e-seminarios/${meeting.type === "MEETING" ? "encontro" : "seminario"}/${encodeURIComponent(meeting.slug || meeting.id)}`}
                    >
                      Ver encontro
                      <FiArrowUpRight aria-hidden="true" />
                    </Link>
                  </ResourceLinks>
                </div>
              </Meeting>
            </Section>
          )}

          {links.length > 0 && (
            <Section>
              <SectionHeader as="h2" small title="Acessos e materiais" />
              <ResourceLinks>
                {links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                    <FiArrowUpRight aria-hidden="true" />
                  </a>
                ))}
              </ResourceLinks>
            </Section>
          )}

          {!!data.images?.length && (
            <Section>
              <SectionHeader as="h2" small title="Fotos e registros" />
              <ImageGallery images={data.images} />
            </Section>
          )}

          {(createdAt || updatedAt) && (
            <RecordDates>
              {createdAt && (
                <span>
                  Cadastrado em{" "}
                  <time dateTime={data.createdAt}>{createdAt}</time>
                </span>
              )}
              {updatedAt && (
                <span>
                  Atualizado em{" "}
                  <time dateTime={data.updatedAt}>{updatedAt}</time>
                </span>
              )}
            </RecordDates>
          )}
          <ResourceLinks>
            <Link to="/atividades/apresentacoes-trabalhos">
              <FiArrowLeft aria-hidden="true" />
              Voltar às apresentações
            </Link>
          </ResourceLinks>
        </Body>
      </Content>
    </Container>
  );
}
