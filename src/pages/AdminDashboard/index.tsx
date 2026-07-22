import {
  Container,
  Content,
  Title,
  Subtitle,
  WelcomeCard,
  WelcomeTitle,
  WelcomeText,
} from "./styles";

export function AdminDashboard() {
  return (
    <Container>
      <Content>
        <Title>Painel Administrativo</Title>

        <Subtitle>
          Gerencie os conteúdos do portal Leviatã e o Cativeiro.
        </Subtitle>

        <WelcomeCard>
          <WelcomeTitle>Bem-vindo!</WelcomeTitle>

          <WelcomeText>
            Utilize o menu lateral para acessar os módulos administrativos do
            sistema.
          </WelcomeText>

          <WelcomeText>
            A partir deste painel é possível cadastrar e editar pesquisadores,
            publicações, livros, artigos, dossiês, notícias, eventos,
            instrumentos de pesquisa e demais conteúdos do portal.
          </WelcomeText>
        </WelcomeCard>
      </Content>
    </Container>
  );
}
