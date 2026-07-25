import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import {
  FiMenu,
  FiHome,
  FiUsers,
  FiBook,
  FiFileText,
  FiFolder,
  FiDatabase,
  FiCalendar,
  FiVideo,
  FiMail,
  FiLogOut,
} from "react-icons/fi";

import {
  Container,
  Sidebar,
  Logo,
  Navigation,
  NavItem,
  Main,
  Header,
  ToggleButton,
  Content,
  UserArea,
  UserName,
  LogoutButton,
  LogoWrapper,
  LogoImage,
  UserInfo,
  Avatar,
  UserData,
  UserRole,
} from "./styles";

import leviataLogo from "../../assets/images/leviataLogo.png";
import { useAuth } from "../../hooks/useAuth";

export function AdminLayout() {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);

  const { user, signOut } = useAuth();

  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`;

  function handleLogout() {
    signOut();

    navigate("/admin/login", {
      replace: true,
    });
  }

  function formatRole(role: string) {
    switch (role) {
      case "SUPER_ADMIN":
        return "Super Administrador";

      case "ADMIN":
        return "Administrador";

      default:
        return role;
    }
  }

  return (
    <Container>
      <Sidebar $collapsed={collapsed}>
        <Logo $collapsed={collapsed}>
          <LogoWrapper>
            <LogoImage src={leviataLogo} alt="Leviata e o cativeiro" />
          </LogoWrapper>

          {!collapsed && (
            <div>
              <strong>Leviatã</strong>

              <span>Admin</span>
            </div>
          )}
        </Logo>

        <Navigation>
          <NavItem to="/admin" end title="Dashboard">
            <FiHome />

            {!collapsed && <span>Dashboard</span>}
          </NavItem>

          <NavItem to="/admin/pessoas" title="Pessoas">
            <FiUsers />

            {!collapsed && <span>Pessoas</span>}
          </NavItem>

          <NavItem to="/admin/books" title="Livros">
            <FiBook />

            {!collapsed && <span>Livros</span>}
          </NavItem>

          <NavItem to="/admin/news" title="Notícias">
            <FiFileText />

            {!collapsed && <span>Notícias</span>}
          </NavItem>

          <NavItem to="/admin/dossiers" title="Dossiês">
            <FiFolder />

            {!collapsed && <span>Dossiês</span>}
          </NavItem>

          <NavItem to="/admin/database" title="Banco de Dados">
            <FiDatabase />

            {!collapsed && <span>Banco de Dados</span>}
          </NavItem>

          <NavItem to="/admin/meetings" title="Reuniões">
            <FiCalendar />

            {!collapsed && <span>Reuniões</span>}
          </NavItem>

          <NavItem to="/admin/seminars" title="Seminários">
            <FiVideo />

            {!collapsed && <span>Seminários</span>}
          </NavItem>

          <NavItem to="/admin/newsletter" title="Newsletter">
            <FiMail />

            {!collapsed && <span>Newsletter</span>}
          </NavItem>
        </Navigation>
      </Sidebar>

      <Main>
        <Header>
          <ToggleButton onClick={() => setCollapsed(!collapsed)}>
            <FiMenu />
          </ToggleButton>

          <UserArea>
            <UserInfo>
              <Avatar>{initials}</Avatar>

              <UserData>
                <UserName>
                  {user!.firstName} {user!.lastName}
                </UserName>

                <UserRole>{formatRole(user!.role)}</UserRole>
              </UserData>
            </UserInfo>

            <LogoutButton onClick={handleLogout}>
              <FiLogOut />
              Sair
            </LogoutButton>
          </UserArea>
        </Header>

        <Content>
          <Outlet />
        </Content>
      </Main>
    </Container>
  );
}
