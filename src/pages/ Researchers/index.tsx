import { HistoryDivider } from "../../components/HistotyDivider";
import { PersonCard } from "../../components/PersonCard";
import { SectionHeader } from "../../components/SectionHeader";
import { Container, Content, Grid } from "./styles";

import larrissaImage from "../../assets/images/Larissa.webp";
import ricardoImage from "../../assets/images/Ricardo.webp";
import ana from "../../assets/images/ana-paula-avelar.webp";
import antonio from "../../assets/images/ALMEIDA-MENDES.webp";
import erik from "../../assets/images/Erik.webp";

const researchers = [
  {
    image: ricardoImage,
    name: "Ricardo Alexandre Ferreira",
    title: "Prof. Dr.",
    category: "Coordenador",
    institution: "UNESP/Franca",
    bio: "Pesquisador e professor dedicado aos estudos históricos, memória social e construção documental.",
    link: "http://buscatextual.cnpq.br/buscatextual/visualizacv.do?metodo=apresentar&id=K4706356D7",
  },
  {
    image: "/images/pessoas/maria.jpg",
    name: "Dra. Maria Silva",
    bio: "Especialista em história contemporânea e estudos culturais.",
  },
  {
    image: larrissaImage,
    name: "Larissa Biato de Azevedo",
    title: "Dra.",
    institution: "UNESP/Franca",
    bio: "Atua em pesquisa sobre arquivos históricos e preservação documental.",
    link: "http://buscatextual.cnpq.br/buscatextual/visualizacv.do?metodo=apresentar&id=K4330475T3",
  },
  {
    image: "/images/pessoas/ricardo.jpg",
    name: "Prof. Dr. Ricardo Alexandre Ferreira",
    bio: "Pesquisador e professor dedicado aos estudos históricos, memória social e construção documental.",
  },
  {
    image: "/images/pessoas/maria.jpg",
    name: "Dra. Maria Silva",
    bio: "Especialista em história contemporânea e estudos culturais.",
  },
  {
    image: "/images/pessoas/joao.jpg",
    name: "Dr. João Pereira",
    bio: "Atua em pesquisa sobre arquivos históricos e preservação documental.",
  },
  {
    image: "/images/pessoas/ricardo.jpg",
    name: "Prof. Dr. Ricardo Alexandre Ferreira",
    bio: "Pesquisador e professor dedicado aos estudos históricos, memória social e construção documental.",
  },
  {
    image: "/images/pessoas/maria.jpg",
    name: "Dra. Maria Silva",
    bio: "Especialista em história contemporânea e estudos culturais.",
  },
];

const internatinalResearchers = [
  {
    image: ana,
    name: "Ana Paula Menino Avelar",
    institution: "Universidade aberta - UAb (Portugal)",
  },
  {
    image: antonio,
    name: "Antõnio de Almeida Mendes",
    institution: "Université de nantes (França)",
  },
  {
    image: erik,
    name: "Erik Lars Myrup",
    institution: "University of Kentucky (EUA)",
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
            <PersonCard key={index} {...person} />
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
          {internatinalResearchers.map((person, index) => (
            <PersonCard key={index} {...person} />
          ))}
        </Grid>
      </Content>
    </Container>
  );
}
