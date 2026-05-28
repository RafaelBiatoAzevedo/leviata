import { FiUsers, FiBookOpen, FiMic } from "react-icons/fi";

import { SectionHeader } from "../../components/SectionHeader";

import {
  Container,
  Content,
  Grid,
  ActivityCard,
  IconWrapper,
  CardTitle,
  CardDescription,
} from "./styles";

const activities = [
  {
    to: "/atividades/nucleo-de-pesquisa-em-costas-negras",
    icon: <FiUsers />,
    title: "Núcleo de pesquisa “Em costas negras”",
    description:
      "Espaço dedicado ao desenvolvimento de pesquisas, debates e investigações relacionadas à escravidão, experiências africanas e diásporas no mundo luso-brasileiro.",
  },

  {
    to: "/atividades/nucleo-de-pesquisa-em-costas-negras",
    icon: <FiBookOpen />,
    title: "Júris Históricos",
    description:
      "Atividades voltadas à análise crítica, avaliação acadêmica e discussão de pesquisas, dissertações e produções historiográficas.",
  },

  {
    to: "/atividades/nucleo-de-pesquisa-em-costas-negras",
    icon: <FiMic />,
    title: "Encontros e Seminários",
    description:
      "Eventos, mesas de debate e seminários organizados pelo grupo para promover intercâmbio intelectual e difusão do conhecimento histórico.",
  },
];

export function Activities() {
  return (
    <Container>
      <Content>
        <SectionHeader
          title="Atividades"
          subtitle="Confira pelo menu nossas atividades e projetos regulares, desenvolvidos no âmbito das pesquisas e ações acadêmicas do grupo."
        />

        <Grid>
          {activities.map((activity, index) => (
            <ActivityCard to={activity.to} key={index}>
              <IconWrapper>{activity.icon}</IconWrapper>

              <CardTitle>{activity.title}</CardTitle>

              <CardDescription>{activity.description}</CardDescription>
            </ActivityCard>
          ))}
        </Grid>
      </Content>
    </Container>
  );
}
