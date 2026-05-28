import { LinkCard } from "../../components/LinkCard";
import { SectionHeader } from "../../components/SectionHeader";
import { Container, Content, Grid } from "./styles";
import { FiVideo } from "react-icons/fi";
import { FiMic } from "react-icons/fi";

const meetAndSeminarsMocks = [
  {
    to: "/atividades/nucleo-de-pesquisa-em-costas-negras",
    icon: <FiMic />,
    title: "I Seminário Ampliado",
    description: "2025",
  },
  {
    to: "/atividades/nucleo-de-pesquisa-em-costas-negras",
    icon: <FiVideo />,
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
              to={meet.to}
              icon={meet.icon}
              title={meet.title}
              description={meet.description}
            />
          ))}
        </Grid>
      </Content>
    </Container>
  );
}
