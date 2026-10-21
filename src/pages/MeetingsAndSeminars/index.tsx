import { usePublicList } from "../../hooks/usePublicData";
import type { MeetingResponseDto } from "../../admin/dtos/meetings/MeetingResponseDto";
import { Loading } from "../../components/Loading";
import { SectionHeader } from "../../components/SectionHeader";
import { Container, Content, Grid, MeetingCard } from "./styles";
import { FiMic, FiVideo } from "react-icons/fi";

export function MeetingsAndSeminars() {
  const {
    data: meetings,
    loading,
    error,
  } = usePublicList<MeetingResponseDto>("meetings");
  return (
    <Container>
      <Content>
        <SectionHeader
          title="Encontros e Seminários"
          subtitle="Nossos encontros e seminários ampliados acontecem regularmente. Navegue pelos eventos abaixo e acompanhe nossa agenda."
        />

        {loading && <Loading />}
        {error && <p>Não foi possível carregar os encontros.</p>}
        {!loading && !error && meetings.length === 0 && (
          <p>Nenhum encontro disponível.</p>
        )}
        <Grid>
          {meetings.map((meet) => (
            <MeetingCard
              key={meet.id}
              to={`/atividades/encontros-e-seminarios/${meet.type === "MEETING" ? "encontro" : "seminario"}/${meet.slug}`}
              icon={meet.type === "MEETING" ? <FiVideo /> : <FiMic />}
              title={meet.title}
              description={new Date(meet.date).toLocaleDateString("pt-BR", {
                timeZone: "UTC",
              })}
            />
          ))}
        </Grid>
      </Content>
    </Container>
  );
}
