import { FiMic } from "react-icons/fi";
import { TbFolderSearch } from "react-icons/tb";

import { SectionHeader } from "../../components/SectionHeader";

import { Container, Content, Grid } from "./styles";
import { LinkCard } from "../../components/LinkCard";
import { GiInjustice } from "react-icons/gi";

const activities = [
  {
    to: "/atividades/nucleo-de-pesquisa-em-costas-negras",
    icon: <TbFolderSearch />,
    title: "Núcleo de pesquisa “Em costas negras”",
    description:
      "Espaço dedicado ao desenvolvimento de pesquisas, debates e investigações relacionadas à escravidão, experiências africanas e diásporas no mundo luso-brasileiro.",
  },

  {
    to: "/atividades/juris-historicos",
    icon: <GiInjustice />,
    title: "Júris Históricos",
    description:
      "Atividades voltadas à análise crítica, avaliação acadêmica e discussão de pesquisas, dissertações e produções historiográficas.",
  },

  {
    to: "/atividades/encontros-e-seminarios",
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
            <LinkCard
              key={index}
              to={activity.to}
              icon={activity.icon}
              title={activity.title}
              description={activity.description}
            ></LinkCard>
          ))}
        </Grid>
      </Content>
    </Container>
  );
}
