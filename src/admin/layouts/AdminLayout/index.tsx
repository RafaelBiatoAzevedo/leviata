import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import {
  FiMenu,
  FiHome,
  FiUsers,
  FiBook,
  FiFolder,
  FiCalendar,
  FiVideo,
  FiMail,
  FiUserCheck,
  FiAward,
  FiMic,
  FiLayers,
  FiFileText,
  FiMonitor,
  FiClipboard,
} from "react-icons/fi";

import { TbDoorEnter, TbFolderSearch } from "react-icons/tb";

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
import { GiInjustice } from "react-icons/gi";
import { AdminUserMenu } from "../../components/AdminUserMenu";
import { formatUserRole } from "../../utils/users";

export function AdminLayout() {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(
    () => window.matchMedia("(max-width: 768px)").matches,
  );

  const { user, signOut } = useAuth();

  const initials = (
    `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}` ||
    user?.email.slice(0, 2) ||
    "U"
  ).toUpperCase();

  function handleLogout() {
    signOut();

    navigate("/admin/login", {
      replace: true,
    });
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
          <NavItem to="/admin/videos" title="Videos">
            <FiVideo />

            {!collapsed && <span>Videos</span>}
          </NavItem>

          <NavItem to="/admin/newsletter" title="Newsletter">
            <FiMail />

            {!collapsed && <span>Newsletter</span>}
          </NavItem>

          <NavItem to="/admin/artigos" title="Artigos / Dossiês">
            <FiFolder />

            {!collapsed && <span>Artigos / Dossiês</span>}
          </NavItem>

          <NavItem
            to="/admin/apresentacoes-trabalhos"
            title="Apresentações de Trabalhos"
          >
            <FiMonitor />

            {!collapsed && <span>Apres. de Trabalhos</span>}
          </NavItem>

          <NavItem
            to="/admin/instrumentos-pesquisa"
            title="Instrumentos de pesquisa"
          >
            <FiClipboard />

            {!collapsed && <span>Instr. de Pesquisas</span>}
          </NavItem>

          <NavItem to="/admin/pesquisas" title="Pesquisas">
            <TbFolderSearch />

            {!collapsed && <span>Pesquisas</span>}
          </NavItem>

          <NavItem to="/admin/juris" title="Juris">
            <GiInjustice />

            {!collapsed && <span>Juris</span>}
          </NavItem>

          <NavItem to="/admin/encontros" title="Encontros">
            <FiMic />

            {!collapsed && <span>Encontros</span>}
          </NavItem>

          <NavItem to="/admin/bancas" title="Bancas">
            <FiAward />

            {!collapsed && <span>Bancas</span>}
          </NavItem>

          <NavItem to="/admin/tematicas" title="Temáicas">
            <FiLayers />

            {!collapsed && <span>Temáicas</span>}
          </NavItem>

          <NavItem to="/admin/noticias" title="Notícias">
            <FiFileText />
            {!collapsed && <span>Notícias</span>}
          </NavItem>

          <NavItem to="/admin/agenda" title="Agenda">
            <FiCalendar />

            {!collapsed && <span>Agenda</span>}
          </NavItem>
          {user?.role === "SUPER_ADMIN" && (
            <NavItem to="/admin/usuarios" title="Usuários">
              <FiUserCheck />
              {!collapsed && <span>Usuários</span>}
            </NavItem>
          )}
        </Navigation>

        <BackWebSiteWrapper>
          <AdminButton
            size="small"
            variant="outline"
            onClick={() => navigate("/")}
          >
            <TbDoorEnter size={"1.2rem"} />

            {!collapsed && <span>Voltar ao site</span>}
          </AdminButton>
        </BackWebSiteWrapper>
      </Sidebar>

      <Main>
        <Header>
          <ToggleButton
            aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
            aria-expanded={!collapsed}
            onClick={() => setCollapsed(!collapsed)}
          >
            <FiMenu />
          </ToggleButton>

          <UserArea>
            <UserInfo>
              <Avatar>{initials}</Avatar>

              <UserData>
                <UserName>
                  {[user?.firstName, user?.lastName]
                    .filter(Boolean)
                    .join(" ") || user?.email}
                </UserName>

                <UserRole>{formatUserRole(user?.role ?? "")}</UserRole>
              </UserData>
            </UserInfo>

            <AdminUserMenu onLogout={handleLogout} />
          </UserArea>
        </Header>

        <Content>
          <Outlet />
        </Content>
      </Main>
    </Container>
  );
}
