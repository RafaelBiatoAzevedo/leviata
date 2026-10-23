import { FiFilm, FiMic, FiVideo } from "react-icons/fi";
import { TbFolderSearch } from "react-icons/tb";

import { SectionHeader } from "../../components/SectionHeader";

import { ActivityCard, Container, Content, Grid } from "./styles";
import { GiInjustice } from "react-icons/gi";

const activities = [
  {
    to: "/atividades/pesquisas",
    icon: <TbFolderSearch />,
    title: "Pesquisas",
    description: "Conheça os projetos e suas galerias de imagens.",
  },
  {
    to: "/atividades/juris-historicos",
    icon: <GiInjustice />,
    title: "Júris Históricos",
    description:
      "Atividades voltadas à análise crítica, avaliação acadêmica e discussão de pesquisas, dissertações e produções historiográficas.",
  },

  {
    to: "/atividades/encontros",
    icon: <FiVideo />,
    title: "Encontros",
    description:
      "Conversas e intercâmbios organizados pelo grupo para compartilhar experiências e conhecimento histórico.",
  },
  {
    to: "/atividades/seminarios",
    icon: <FiMic />,
    title: "Seminários",
    description:
      "Eventos, mesas de debate e seminários organizados pelo grupo para promover intercâmbio intelectual e difusão do conhecimento histórico.",
  },
  {
    to: "/atividades/mostra-de-documentarios",
    icon: <FiFilm />,
    title: "Mostra de documentários",
    description:
      "Sessões de documentários e debates sobre história, imagem e memória.",
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
          {activities.map((activity) => (
            <ActivityCard
              key={activity.to}
              to={activity.to}
              icon={activity.icon}
              title={activity.title}
              description={activity.description}
            />
          ))}
        </Grid>
      </Content>
    </Container>
  );
}
