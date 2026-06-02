import { LinkCard } from "../../components/LinkCard";
import { SectionHeader } from "../../components/SectionHeader";
import { Container, Content, Grid } from "./styles";
import { FiVideo } from "react-icons/fi";
import { FiMic } from "react-icons/fi";

const meetAndSeminarsMocks = [
  {
    id: 1,
    type: "encontro",
    title: "I Seminário Ampliado",
    description: "2025",
  },
  {
    id: 1,
    type: "seminario",
    title: "I Encontro Internacional",
    description: "2024",
  },
];

export function MeetingsAndSeminars() {
  return (
    <Container>
      <Content>
        <SectionHeader
          title="Encontros e Seminários"
          subtitle="Nossos encontros e seminários ampliados acontecem regularmente. Navegue pelos eventos abaixo e acompanhe nossa agenda."
        />

        <Grid>
          {meetAndSeminarsMocks.map((meet) => (
            <LinkCard
              to={`/atividades/encontros-e-seminarios/${meet.type}/${meet.id}`}
              icon={meet.type === "encontro" ? <FiVideo /> : <FiMic />}
              title={meet.title}
              description={meet.description}
            />
          ))}
        </Grid>
      </Content>
    </Container>
  );
}
