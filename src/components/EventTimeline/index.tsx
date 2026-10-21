import { useEffect, useId, useState } from "react";
import {
  FiArrowDown,
  FiArrowUpRight,
  FiBookOpen,
  FiCalendar,
  FiClock,
  FiExternalLink,
  FiFileText,
  FiMapPin,
  FiMic,
  FiPlayCircle,
  FiRadio,
  FiUsers,
} from "react-icons/fi";
import {
  groupTimeline,
  timelineDateLabel,
  timelineDateStamp,
  timelineExternalUrl,
  timelineStatus,
  type TimelineEntry,
  type TimelineYearGroup,
} from "../../utils/timeline";
import { Loading } from "../Loading";
import { timelineContent } from "./content";
import {
  Actions,
  AuthorList,
  Authors,
  Card,
  CardDescription,
  CardSubtitle,
  CardTitle,
  Container,
  DateLabel,
  DateStamp,
  DetailLink,
  EmptyState,
  ExternalAction,
  Group,
  GroupHeader,
  Item,
  List,
  Metadata,
  Overview,
  OverviewCopy,
  OverviewIcon,
  OverviewLinks,
  OverviewStat,
  Section,
  SectionHeading,
  StatusBadge,
  YearHeader,
} from "./styles";

interface EventTimelineProps {
  entries: TimelineEntry[];
  kind: keyof typeof timelineContent;
  loading?: boolean;
  error?: boolean;
}

const actionIcons = {
  registration: FiCalendar,
  meeting: FiRadio,
  recording: FiPlayCircle,
  document: FiFileText,
  external: FiExternalLink,
};

export function EventTimeline({
  entries,
  kind,
  loading = false,
  error = false,
}: EventTimelineProps) {
  const id = useId();
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const copy = timelineContent[kind];
  const groups = groupTimeline(entries, now);
  const OverviewSymbol = copy.Icon;

  function renderEntry(entry: TimelineEntry) {
    const status = timelineStatus(entry, now);
    const stamp = timelineDateStamp(entry);
    const isPast = status === "past";
    const label = {
      upcoming: "Em breve",
      today: "Hoje",
      ongoing: "Em andamento",
      past: copy.pastStatus,
      undated: "Data a confirmar",
    }[status];

    return (
      <Item key={entry.id} $past={isPast}>
        <DateStamp aria-hidden="true" $past={isPast}>
          <strong>{stamp.day}</strong>
          <span>{stamp.month}</span>
        </DateStamp>
        <Card $past={isPast}>
          <GroupHeader>
            <DateLabel dateTime={status === "undated" ? undefined : entry.date}>
              <FiCalendar aria-hidden="true" />
              {timelineDateLabel(entry)}
            </DateLabel>
            <StatusBadge $status={status}>{label}</StatusBadge>
          </GroupHeader>
          <CardTitle as={status === "undated" ? "h3" : "h4"}>
            {entry.title}
          </CardTitle>
          {entry.subtitle && <CardSubtitle>{entry.subtitle}</CardSubtitle>}
          {entry.meetingTitle && (
            <Metadata>
              <FiMic aria-hidden="true" />
              <span>{entry.meetingTitle}</span>
            </Metadata>
          )}
          {entry.location && (
            <Metadata>
              <FiMapPin aria-hidden="true" />
              <span>{entry.location}</span>
            </Metadata>
          )}
          {entry.description && (
            <CardDescription>{entry.description}</CardDescription>
          )}
          {!!entry.authors?.length && (
            <Authors>
              <p>
                <FiUsers aria-hidden="true" />
                {isPast ? copy.participantsPast : copy.participantsUpcoming}
              </p>
              <AuthorList>
                {entry.authors.map((author) => (
                  <li key={author.id}>
                    {author.abbreviation && <span>{author.abbreviation}</span>}
                    {author.name}
                  </li>
                ))}
              </AuthorList>
            </Authors>
          )}
          <Actions>
            {entry.actions?.map((action) => {
              const href = timelineExternalUrl(action.url);
              if (!href) return null;
              const Icon = actionIcons[action.kind];
              return (
                <ExternalAction
                  key={action.kind}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon aria-hidden="true" />
                  {action.label}
                  <FiArrowUpRight aria-hidden="true" />
                </ExternalAction>
              );
            })}
            {entry.detailsTo && (
              <DetailLink to={entry.detailsTo}>
                Ver detalhes <FiArrowUpRight aria-hidden="true" />
              </DetailLink>
            )}
          </Actions>
        </Card>
      </Item>
    );
  }

  function renderYears(years: TimelineYearGroup[]) {
    return years.map((group) => (
      <Group key={group.year}>
        <YearHeader>
          <h3>{group.year}</h3>
          <span>
            {group.entries.length}{" "}
            {group.entries.length === 1 ? copy.singular : copy.plural}
          </span>
        </YearHeader>
        <List>{group.entries.map(renderEntry)}</List>
      </Group>
    ));
  }

  if (loading)
    return (
      <EmptyState role="status">
        <Loading />
        <p>Carregando {copy.loading}...</p>
      </EmptyState>
    );

  if (error)
    return (
      <EmptyState role="alert">
        <FiCalendar aria-hidden="true" />
        <h2>Não foi possível carregar {copy.error}.</h2>
        <p>Tente novamente em alguns instantes.</p>
      </EmptyState>
    );

  return (
    <Container>
      <Overview>
        <OverviewCopy>
          <OverviewIcon aria-hidden="true">
            <OverviewSymbol />
          </OverviewIcon>
          <div>
            <span>{copy.overviewLabel}</span>
            <p>{copy.overviewText}</p>
            {copy.showTimes && <small>Horários de Brasília</small>}
          </div>
        </OverviewCopy>
        {!!entries.length && (
          <OverviewLinks aria-label="Seções da linha do tempo">
            <OverviewStat href={`#${id}-upcoming`}>
              <strong>{String(groups.upcomingCount).padStart(2, "0")}</strong>
              <span>
                A seguir <FiArrowDown aria-hidden="true" />
              </span>
            </OverviewStat>
            <OverviewStat href={`#${id}-past`}>
              <strong>{String(groups.pastCount).padStart(2, "0")}</strong>
              <span>
                {copy.pastStat} <FiArrowDown aria-hidden="true" />
              </span>
            </OverviewStat>
          </OverviewLinks>
        )}
      </Overview>

      {!entries.length ? (
        <EmptyState>
          <OverviewSymbol aria-hidden="true" />
          <h2>{copy.emptyTitle}</h2>
          <p>{copy.emptyText}</p>
        </EmptyState>
      ) : (
        <>
          <Section
            id={`${id}-upcoming`}
            aria-labelledby={`${id}-upcoming-title`}
          >
            <SectionHeading>
              <FiCalendar aria-hidden="true" />
              <div>
                <h2 id={`${id}-upcoming-title`}>{copy.upcomingTitle}</h2>
                <p>{copy.upcomingText}</p>
              </div>
              <span>{groups.upcomingCount}</span>
            </SectionHeading>
            {groups.upcoming.length ? (
              renderYears(groups.upcoming)
            ) : (
              <EmptyState $compact>
                <FiCalendar aria-hidden="true" />
                <p>{copy.upcomingEmpty}</p>
              </EmptyState>
            )}
          </Section>

          <Section id={`${id}-past`} aria-labelledby={`${id}-past-title`}>
            <SectionHeading>
              <FiClock aria-hidden="true" />
              <div>
                <h2 id={`${id}-past-title`}>{copy.pastTitle}</h2>
                <p>{copy.pastText}</p>
              </div>
              <span>{groups.pastCount}</span>
            </SectionHeading>
            {groups.past.length ? (
              renderYears(groups.past)
            ) : (
              <EmptyState $compact>
                <FiBookOpen aria-hidden="true" />
                <p>{copy.pastEmpty}</p>
              </EmptyState>
            )}
          </Section>

          {!!groups.undated.length && (
            <Section aria-labelledby={`${id}-undated-title`}>
              <SectionHeading>
                <FiCalendar aria-hidden="true" />
                <div>
                  <h2 id={`${id}-undated-title`}>Data a confirmar</h2>
                  <p>Acompanhe as atualizações destes registros.</p>
                </div>
                <span>{groups.undated.length}</span>
              </SectionHeading>
              <List>{groups.undated.map(renderEntry)}</List>
            </Section>
          )}
        </>
      )}
    </Container>
  );
}
