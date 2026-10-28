import type { MeetingResponseDto } from "../../admin/dtos/meetings/MeetingResponseDto";
import type { TMeetingType } from "../../admin/types/TMeetingType";
import { EventTimeline } from "../../components/EventTimeline";
import { SectionHeader } from "../../components/SectionHeader";
import { usePublicList } from "../../hooks/usePublicData";
import { meetingDetailPath } from "../../utils/meetings";
import { Container, Content } from "../Seminars/styles";

const sections = {
  MEETING: {
    title: "Encontros",
    subtitle:
      "Acompanhe os próximos encontros e revisite as conversas já realizadas pelo grupo.",
    kind: "meetings",
  },
  SEMINAR: {
    title: "Seminários",
    subtitle:
      "Conheça os próximos debates e revisite os seminários já realizados pelo grupo.",
    kind: "seminars",
  },
  SYMPOSIUM: {
    title: "Simpósios",
    subtitle:
      "Acompanhe os próximos simpósios e revisite os encontros de pesquisa já realizados pelo grupo.",
    kind: "symposia",
  },
  DOCUMENTARY: {
    title: "Mostra de documentários",
    subtitle:
      "Acompanhe as próximas sessões e revisite as mostras de documentários e seus debates.",
    kind: "documentaries",
  },
} as const;

export function MeetingAgenda({ type }: { type: TMeetingType }) {
  const { data, loading, error } = usePublicList<MeetingResponseDto>(
    "meetings",
    {
      type,
      isInternal: "true",
    },
  );
  const section = sections[type];
  const meetings = data.filter(
    (meeting) => meeting.isInternal && meeting.type === type,
  );

  return (
    <Container>
      <Content>
        <SectionHeader title={section.title} subtitle={section.subtitle} />
        <EventTimeline
          kind={section.kind}
          loading={loading}
          error={error}
          entries={meetings.map((meeting) => ({
            id: meeting.id,
            title: meeting.title,
            date: meeting.date,
            dateOnly: true,
            description: meeting.description,
            location: meeting.location,
            authors: (meeting.speakers || []).flatMap((speaker) =>
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
                url: meeting.registrationUrl,
              },
              {
                kind: "meeting",
                label: "Transmissão",
                url: meeting.meetingUrl,
              },
              {
                kind: "recording",
                label: "Gravação",
                url: meeting.recordingUrl,
              },
            ],
            detailsTo: meetingDetailPath(
              meeting.type,
              meeting.slug || meeting.id,
            ),
          }))}
        />
      </Content>
    </Container>
  );
}
