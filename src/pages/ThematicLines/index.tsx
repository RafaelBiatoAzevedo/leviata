import { LinkCard } from "../../components/LinkCard";
import {
  Container,
  Content,
  Header,
  LinesLInksWrapper,
  Subtitle,
  Title,
} from "./styles";

export function ThematicLines() {
  return (
    <Container>
      <Content>
        <Header>
          <Title>Linhas Temáticas</Title>

          <Subtitle>
            Conheça as principais linhas de investigação que orientam as
            pesquisas do grupo, abrangendo diferentes abordagens da história,
            memória e construção do conhecimento histórico.
          </Subtitle>
        </Header>
        <LinesLInksWrapper>
          <LinkCard
            to="/grupo/pesquisadores"
            acronym="CSA"
            description="Cativeiro, saúde e alimentação: séculos XVII e XVIII"
          ></LinkCard>
          <LinkCard
            to="/grupo/pesquisadores"
            acronym="MCE"
            description="Monarquia, Cristianismo e Escravidão no Mundo Luso-brasileiro (séculos XVII e XVIII)"
          ></LinkCard>
          <LinkCard
            to="/grupo/pesquisadores"
            acronym="EIE"
            description="Estado, Imprensa e Escravidão no Brasil do Século XIX"
          ></LinkCard>
        </LinesLInksWrapper>
      </Content>
    </Container>
  );
}
