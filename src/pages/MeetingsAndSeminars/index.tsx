import { usePublicList } from "../../hooks/usePublicData";
import type { MeetingResponseDto } from "../../admin/dtos/meetings/MeetingResponseDto";
import { Loading } from "../../components/Loading";
import { LinkCard } from "../../components/LinkCard";
import { SectionHeader } from "../../components/SectionHeader";
import { Container, Content, Grid } from "./styles";
import { FiVideo } from "react-icons/fi";
import { FiMic } from "react-icons/fi";

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
            <LinkCard
              key={meet.id}
              to={`/atividades/encontros-e-seminarios/${meet.type === "MEETING" ? "encontro" : "seminario"}/${meet.slug}`}
              icon={meet.type === "MEETING" ? <FiVideo /> : <FiMic />}
              title={meet.title}
              description={new Date(meet.date).toLocaleDateString("pt-BR", {
                timeZone: "America/Sao_Paulo",
              })}
            />
          ))}
        </Grid>
      </Content>
    </Container>
  );
}
