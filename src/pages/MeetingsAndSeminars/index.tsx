import { usePublicList } from "../../hooks/usePublicData";
import type { MeetingResponseDto } from "../../admin/dtos/meetings/MeetingResponseDto";
import { Loading } from "../../components/Loading";
import { SectionHeader } from "../../components/SectionHeader";
import { Container, Content, Grid, MeetingCard } from "./styles";
import { FiFilm, FiMic, FiVideo } from "react-icons/fi";
import type { TMeetingType } from "../../admin/types/TMeetingType";
import { meetingDetailPath } from "../../utils/meetings";

const sections = {
  MEETING: {
    title: "Encontros",
    subtitle:
      "Conversas, debates e intercâmbios que fazem parte da trajetória do grupo. Conheça nossos encontros e seus registros.",
    empty: "Nenhum encontro disponível.",
    Icon: FiVideo,
  },
  SEMINAR: {
    title: "Seminários",
    subtitle:
      "Espaços de debate e circulação do conhecimento histórico. Explore os seminários e as pesquisas compartilhadas pelo grupo.",
    empty: "Nenhum seminário disponível.",
    Icon: FiMic,
  },
  DOCUMENTARY: {
    title: "Mostra de documentários",
    subtitle:
      "História, imagem e memória em diálogo. Conheça nossas sessões de documentários e os debates que acompanham cada exibição.",
    empty: "Nenhuma mostra de documentários disponível.",
    Icon: FiFilm,
  },
} satisfies Record<TMeetingType, object>;

export function MeetingsAndSeminars({ type }: { type?: TMeetingType }) {
  const section = type
    ? sections[type]
    : {
        title: "Encontros, Seminários e Documentários",
        subtitle:
          "Explore os encontros, seminários e mostras de documentários do grupo.",
        empty: "Nenhum encontro disponível.",
      };
  const { data, loading, error } = usePublicList<MeetingResponseDto>(
    "meetings",
    { type, isInternal: "true", sortBy: "date", sortOrder: "desc" },
  );
  const meetings = data.filter(
    (meeting) => meeting.isInternal && (!type || meeting.type === type),
  );
  return (
    <Container>
      <Content>
        <SectionHeader title={section.title} subtitle={section.subtitle} />

        {loading && <Loading />}
        {error && <p>Não foi possível carregar as atividades.</p>}
        {!loading && !error && meetings.length === 0 && <p>{section.empty}</p>}
        <Grid>
          {meetings.map((meet) => {
            const Icon = sections[meet.type].Icon;
            return (
              <MeetingCard
                key={meet.id}
                to={meetingDetailPath(meet.type, meet.slug || meet.id)}
                icon={<Icon />}
                title={meet.title}
                description={new Date(meet.date).toLocaleDateString("pt-BR", {
                  timeZone: "UTC",
                })}
              />
            );
          })}
        </Grid>
      </Content>
    </Container>
  );
}
