import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import {
  FiMenu,
  FiHome,
  FiUsers,
  FiBook,
  FiFolder,
  FiDatabase,
  FiCalendar,
  FiVideo,
  FiMail,
  FiLogOut,
} from "react-icons/fi";

import { BiNews } from "react-icons/bi";
import { LuArrowLeftFromLine } from "react-icons/lu";

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
  BackWebSiteWrapper,
} from "./styles";

import leviataLogo from "../../../assets/images/leviataLogo.png";
import { useAuth } from "../../hooks/useAuth";
import { AdminButton } from "../../components/AdminButton";

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

          <NavItem to="/admin/livros" title="Livros">
            <FiBook />

            {!collapsed && <span>Livros</span>}
          </NavItem>

          <NavItem to="/admin/artigos" title="Artigos / Dossiês">
            <FiFolder />

            {!collapsed && <span>Artigos / Dossiês</span>}
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

          <NavItem to="/admin/news" title="Notícias">
            <BiNews />
            {!collapsed && <span>Notícias</span>}
          </NavItem>

          <NavItem to="/admin/newsletter" title="Newsletter">
            <FiMail />

            {!collapsed && <span>Newsletter</span>}
          </NavItem>
        </Navigation>

        <BackWebSiteWrapper>
          <AdminButton variant="outline" onClick={() => navigate("/")}>
            <LuArrowLeftFromLine size={"1.2rem"} />

            {!collapsed && <span>Voltar ao site</span>}
          </AdminButton>
        </BackWebSiteWrapper>
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
              Logout
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
