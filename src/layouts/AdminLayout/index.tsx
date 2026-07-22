import { Outlet } from "react-router-dom";
import {
  Container,
  Sidebar,
  Logo,
  Navigation,
  NavItem,
  Main,
  Header,
  Content,
  LogoutButton,
  User,
} from "./styles";

export function AdminLayout() {
  return (
    <Container>
      <Sidebar>
        <Logo>
          <h2>Leviatã</h2>
          <span>Painel Administrativo</span>
        </Logo>

        <Navigation>
          <NavItem to="/admin" end>
            Dashboard
          </NavItem>

          <NavItem to="/admin/people">Pesquisadores</NavItem>

          <NavItem to="/admin/news">Notícias</NavItem>

          <NavItem to="/admin/books">Livros</NavItem>

          <NavItem to="/admin/articles">Artigos</NavItem>

          <NavItem to="/admin/dossiers">Dossiês</NavItem>

          <NavItem to="/admin/meetings">Reuniões</NavItem>

          <NavItem to="/admin/seminars">Seminários</NavItem>

          <NavItem to="/admin/thematics">Temáticas</NavItem>

          <NavItem to="/admin/newsletter">Newsletter</NavItem>
        </Navigation>
      </Sidebar>

      <Main>
        <Header>
          <User>Administrador</User>

          <LogoutButton>Sair</LogoutButton>
        </Header>

        <Content>
          <Outlet />
        </Content>
      </Main>
    </Container>
  );
}
