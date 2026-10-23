import type { BoardResponseDto } from "../../admin/dtos/boards/BoardResponseDto";
import { EventTimeline } from "../../components/EventTimeline";
import { SectionHeader } from "../../components/SectionHeader";
import { usePublicList } from "../../hooks/usePublicData";
import { Container, Content } from "./styles";

export default function Painels() {
  const {
    data: boards,
    loading,
    error,
  } = usePublicList<BoardResponseDto>("boards");

  return (
    <Container>
      <Content>
        <SectionHeader
          title="Bancas"
          subtitle="Acompanhe as próximas bancas de qualificação e defesas vinculadas às pesquisas do grupo e revisite as já realizadas."
        />
        <EventTimeline
          kind="boards"
          loading={loading}
          error={error}
          entries={boards.map((board) => ({
            id: board.id,
            title: board.title,
            date: board.date,
            dateOnly: true,
            participantGroups: [
              { label: "Candidato", people: [board.candidate] },
              { label: "Orientador", people: [board.advisor] },
              { label: "Integrantes da banca", people: board.members },
            ].map((group) => ({
              label: group.label,
              people: group.people.flatMap((person) =>
                person?.id && person.name?.trim()
                  ? [
                      {
                        id: person.id,
                        name: person.name.trim(),
                        abbreviation: person.academicTitle?.abbreviation,
                        institution:
                          person.institution?.acronym ||
                          person.institution?.name,
                      },
                    ]
                  : [],
              ),
            })),
            actions: [
              {
                kind: "meeting",
                label: "Acessar reunião",
                url: board.meetingUrl,
              },
            ],
            images: board.images,
            detailsTo: `/agenda/bancas/${encodeURIComponent(board.slug || board.id)}`,
          }))}
        />
      </Content>
    </Container>
  );
}
