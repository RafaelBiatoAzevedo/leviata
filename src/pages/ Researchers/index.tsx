import { HistoryDivider } from "../../components/HistotyDivider";
import { PersonCard } from "../../components/PersonCard";
import { SectionHeader } from "../../components/SectionHeader";
import { Container, Content, Grid } from "./styles";

const researchers = [
  {
    image: "/images/pessoas/ricardo.jpg",
    name: "Prof. Dr. Ricardo Alexandre Ferreira",
    description:
      "Pesquisador e professor dedicado aos estudos históricos, memória social e construção documental.",
  },
  {
    image: "/images/pessoas/maria.jpg",
    name: "Dra. Maria Silva",
    description: "Especialista em história contemporânea e estudos culturais.",
  },
  {
    image: "/images/pessoas/joao.jpg",
    name: "Dr. João Pereira",
    description:
      "Atua em pesquisa sobre arquivos históricos e preservação documental.",
  },
  {
    image: "/images/pessoas/ricardo.jpg",
    name: "Prof. Dr. Ricardo Alexandre Ferreira",
    description:
      "Pesquisador e professor dedicado aos estudos históricos, memória social e construção documental.",
  },
  {
    image: "/images/pessoas/maria.jpg",
    name: "Dra. Maria Silva",
    description: "Especialista em história contemporânea e estudos culturais.",
  },
  {
    image: "/images/pessoas/joao.jpg",
    name: "Dr. João Pereira",
    description:
      "Atua em pesquisa sobre arquivos históricos e preservação documental.",
  },
  {
    image: "/images/pessoas/ricardo.jpg",
    name: "Prof. Dr. Ricardo Alexandre Ferreira",
    description:
      "Pesquisador e professor dedicado aos estudos históricos, memória social e construção documental.",
  },
  {
    image: "/images/pessoas/maria.jpg",
    name: "Dra. Maria Silva",
    description: "Especialista em história contemporânea e estudos culturais.",
  },
];

export function Researchers() {
  return (
    <Container>
      <Content>
        <SectionHeader
          title="Pesquisadores"
          subtitle="Conheça os pesquisadores que compõem o grupo e contribuem para a
            construção do acervo histórico e acadêmico."
        />

        <Grid>
          {researchers.map((person, index) => (
            <PersonCard
              key={index}
              image={person.image}
              name={person.name}
              description={person.description}
            />
          ))}
        </Grid>

        <HistoryDivider />

        <SectionHeader
          title="Colaboradores Internacionais"
          subtitle="Conheça os pesquisadores e instituições parceiras internacionais que
            colaboram com o grupo na construção e intercâmbio de conhecimentos
            históricos e acadêmicos."
        />

        <Grid>
          {researchers.map((person, index) => (
            <PersonCard
              key={index}
              image={person.image}
              name={person.name}
              description={person.description}
            />
          ))}
        </Grid>
      </Content>
    </Container>
  );
}
