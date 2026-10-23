import type { MeetingResponseDto } from "../../admin/dtos/meetings/MeetingResponseDto";
import { MeetingType } from "../../admin/types/TMeetingType";
import { EventTimeline } from "../../components/EventTimeline";
import { SectionHeader } from "../../components/SectionHeader";
import { usePublicList } from "../../hooks/usePublicData";
import { Container, Content } from "./styles";

export function Seminars() {
  const { data, loading, error } = usePublicList<MeetingResponseDto>(
    "meetings",
    { isInternal: "true" },
  );
  const seminars = data.filter(
    (meeting) => meeting.isInternal && meeting.type === MeetingType.SEMINAR,
  );

  return (
    <Container>
      <Content>
        <SectionHeader
          title="Seminários"
          subtitle="Nossos seminários ocorrem regularmente durante o ano letivo e alguns deles são abertos ao público externo. Conheça os próximos debates e revisite os encontros já realizados."
        />
        <EventTimeline
          kind="seminars"
          loading={loading}
          error={error}
          entries={seminars.map((seminar) => ({
            id: seminar.id,
            title: seminar.title,
            date: seminar.date,
            dateOnly: true,
            description: seminar.description,
            location: seminar.location,
            authors: seminar.speakers.flatMap((speaker) =>
              speaker.id && speaker.name
                ? [
                    {
                      id: speaker.id,
                      name: speaker.name,
                      abbreviation: speaker.academicTitle?.abbreviation,
                    },
                  ]
                : [],
            ),
            actions: [
              {
                kind: "registration",
                label: "Inscrições",
                url: seminar.registrationUrl,
              },
              {
                kind: "meeting",
                label: "Transmissão",
                url: seminar.meetingUrl,
              },
              {
                kind: "recording",
                label: "Gravação",
                url: seminar.recordingUrl,
              },
            ],
            detailsTo: `/atividades/encontros-e-seminarios/seminario/${encodeURIComponent(seminar.slug || seminar.id)}`,
          }))}
        />
      </Content>
    </Container>
  );
}
