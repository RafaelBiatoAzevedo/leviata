import type { ScheduleResponseDto } from "../../admin/dtos/schedule/ScheduleResponseDto";
import { EventTimeline } from "../../components/EventTimeline";
import { SectionHeader } from "../../components/SectionHeader";
import { usePublicList } from "../../hooks/usePublicData";
import { meetingDetailPath } from "../../utils/meetings";
import { Container, Content } from "./styles";

export function Schedule() {
  const { data, loading, error } =
    usePublicList<ScheduleResponseDto>("schedule");

  return (
    <Container>
      <Content>
        <SectionHeader
          title="Agenda"
          subtitle="Encontros, eventos e atividades que movimentam o Leviatã e o Cativeiro. Acompanhe as próximas datas e revisite a memória do grupo."
        />
        <EventTimeline
          kind="events"
          loading={loading}
          error={error}
          entries={data.map((event) => ({
            id: event.id,
            title: event.title,
            subtitle: event.subtitle,
            description: event.description,
            date: event.date,
            endDate: event.endDate,
            location: event.location,
            detailsTo: event.meeting
              ? meetingDetailPath(
                  event.meeting.type,
                  event.meeting.slug || event.meeting.id,
                )
              : undefined,
            detailsLabel: "Ver evento",
            actions: [
              {
                kind: "external",
                label: "Sobre o evento",
                url: event.meetingId ? null : event.externalUrl,
              },
            ],
          }))}
        />
      </Content>
    </Container>
  );
}
