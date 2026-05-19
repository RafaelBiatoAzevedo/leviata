import {
  Container,
  Content,
  HrDivisor,
  ImageHero,
  LinesLInksWrapper,
} from "./styles";
import leviataHero from "../../assets/images/leviataHero.png";
import { Button } from "../../components/Button";
import { CardLink } from "../../components/CardLink";

export function Home() {
  return (
    <Container>
      <ImageHero src={leviataHero}></ImageHero>
      <Content>
        <h1>
          Criado em 2019, o grupo de pesquisa “Leviatã e o Cativeiro” reúne
          pesquisadores em torno do binômio temático Estado Moderno e
          escravidão. Ao considerar um largo arco temporal, que vai do século
          XVI ao XIX, nossas pesquisas procuram analisar a relação entre as
          diversas instituições luso-brasileiras – Inquisição, família, polícia,
          Imprensa – e a escravidão de africanos e descendentes.
        </h1>
        <Button title="Saiba mais"></Button>
        <HrDivisor />
        <h1>Linhas Temáticas</h1>
        <LinesLInksWrapper>
          <CardLink
            to="/grupo/pesquisadores"
            acronym="CSA"
            description="Cativeiro, saúde e alimentação: séculos XVII e XVIII"
          ></CardLink>
          <CardLink
            to="/grupo/pesquisadores"
            acronym="MCE"
            description="Monarquia, Cristianismo e Escravidão no Mundo Luso-brasileiro (séculos XVII e XVIII)"
          ></CardLink>
          <CardLink
            to="/grupo/pesquisadores"
            acronym="EIE"
            description="Estado, Imprensa e Escravidão no Brasil do Século XIX"
          ></CardLink>
        </LinesLInksWrapper>
        <HrDivisor />
        <h1>Publicações recentes</h1>
        <Button title="Mais"></Button>
        <HrDivisor />
        <h1>Notícias</h1>
      </Content>
    </Container>
  );
}
