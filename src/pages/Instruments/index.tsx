import { FiDatabase, FiBookOpen, FiClipboard } from "react-icons/fi";

import { SectionHeader } from "../../components/SectionHeader";

import { Container, Content, Grid } from "./styles";
import { LinkCard } from "../../components/LinkCard";

const instruments = [
  {
    icon: <FiClipboard />,
    to: "/instrumentos/planilhas-biblio-tematicas",
    title: "Levantamentos de Dossiês",
    description:
      "Coleções organizadas de documentos, registros e materiais históricos utilizados nas pesquisas do grupo.",
  },

  {
    icon: <FiBookOpen />,
    to: "/instrumentos/catalogos",
    title: "Catálogos",
    description:
      "Catálogos temáticos produzidos para auxiliar consultas, análises documentais e investigações historiográficas.",
  },

  {
    icon: <FiDatabase />,
    to: "/instrumentos/banco-de-dados",
    title: "Bancos de Dados",
    description:
      "Bases estruturadas de informações históricas reunindo fontes, registros e dados relevantes para pesquisa acadêmica.",
  },
];

export function Instruments() {
  return (
    <Container>
      <Content>
        <SectionHeader
          title="Instrumentos de Pesquisa"
          subtitle="Conheça as ferramentas de estudo e pesquisa produzidas pelo grupo. Navegue por nossos levantamentos de dossiês, catálogos e bancos de dados desenvolvidos para apoiar investigações históricas e acadêmicas."
        />

        <Grid>
          {instruments.map((instrument, index) => (
            <LinkCard
              key={index}
              to={instrument.to}
              icon={instrument.icon}
              title={instrument.title}
              description={instrument.description}
            />
          ))}
        </Grid>
      </Content>
    </Container>
  );
}
