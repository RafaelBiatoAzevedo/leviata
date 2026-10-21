import type { PresentedWorkResponseDto } from "../../admin/dtos/presentedWorks/PresentedWorkResponseDto";
import { usePublicList } from "../../hooks/usePublicData";
import { EventTimeline } from "../EventTimeline";

export function PresentedWorksTimeline() {
  const { data, loading, error } =
    usePublicList<PresentedWorkResponseDto>("presented-works");

  return (
    <EventTimeline
      kind="presentations"
      loading={loading}
      error={error}
      entries={data.map((work) => ({
        id: work.id,
        title: work.title,
        date: work.date,
        dateOnly: true,
        location: work.location || work.meeting?.location,
        meetingTitle: work.meeting?.title,
        authors: work.authors.map((author) => ({
          id: author.id,
          name: author.name,
          abbreviation: author.academicTitle?.abbreviation,
        })),
        actions: [
          {
            kind: "registration",
            label: "Inscrições",
            url: work.registrationUrl,
          },
          { kind: "meeting", label: "Transmissão", url: work.meetingUrl },
          { kind: "recording", label: "Gravação", url: work.recordingUrl },
          { kind: "document", label: "Documento", url: work.documentUrl },
        ],
        detailsTo: `/atividades/apresentacoes-trabalhos/${encodeURIComponent(work.slug || work.id)}`,
      }))}
    />
  );
}
