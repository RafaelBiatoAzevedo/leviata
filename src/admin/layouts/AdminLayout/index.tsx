import { useEffect, useRef, useState } from "react";
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
  FiX,
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
  AdminTypography,
  Backdrop,
  DrawerClose,
} from "./styles";

import leviataLogo from "../../../assets/images/leviataLogo.png";
import { useAuth } from "../../hooks/useAuth";
import { AdminButton } from "../../components/AdminButton";
import { GiInjustice } from "react-icons/gi";
import { AdminUserMenu } from "../../components/AdminUserMenu";
import { formatUserRole } from "../../utils/users";

export function AdminLayout() {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 900px)").matches,
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const sidebar = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const compact = !isMobile && collapsed;

  useEffect(() => {
    const media = window.matchMedia("(max-width: 900px)");
    function resize() {
      setIsMobile(media.matches);
      setMobileOpen(false);
    }
    function close() {
      setMobileOpen(false);
    }
    media.addEventListener("change", resize);
    window.addEventListener("popstate", close);
    return () => {
      media.removeEventListener("change", resize);
      window.removeEventListener("popstate", close);
    };
  }, []);

  useEffect(() => {
    if (!isMobile || !mobileOpen) return;
    const frame = requestAnimationFrame(() => {
      sidebar.current?.querySelector<HTMLElement>("button, a[href]")?.focus();
    });
    function handleKeys(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setMobileOpen(false);
      }
      if (event.key !== "Tab") return;
      const items = Array.from(
        sidebar.current?.querySelectorAll<HTMLElement>(
          "button:not(:disabled), a[href]",
        ) ?? [],
      );
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
    document.addEventListener("keydown", handleKeys);
    const trigger = toggle.current;
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKeys);
      trigger?.focus();
    };
  }, [isMobile, mobileOpen]);

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
      <AdminTypography />
      {isMobile && mobileOpen && (
        <Backdrop
          type="button"
          tabIndex={-1}
          aria-label="Fechar menu"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <Sidebar
        ref={sidebar}
        id="admin-navigation"
        $collapsed={compact}
        $mobileOpen={mobileOpen}
        inert={isMobile && !mobileOpen}
        aria-hidden={isMobile && !mobileOpen ? true : undefined}
        role={isMobile ? "dialog" : undefined}
        aria-modal={isMobile && mobileOpen ? true : undefined}
        aria-label="Menu administrativo"
      >
        <Logo $collapsed={compact}>
          <LogoWrapper>
            <LogoImage src={leviataLogo} alt="Leviata e o cativeiro" />
          </LogoWrapper>

          {!compact && (
            <div>
              <strong>Leviatã</strong>

              <span>Admin</span>
            </div>
          )}
          <DrawerClose
            type="button"
            aria-label="Fechar menu"
            onClick={() => setMobileOpen(false)}
          >
            <FiX aria-hidden="true" />
          </DrawerClose>
        </Logo>

        <Navigation
          aria-label="Navegação administrativa"
          onClick={(event) => {
            if ((event.target as HTMLElement).closest("a"))
              setMobileOpen(false);
          }}
        >
          <NavItem to="/admin" end title="Dashboard">
            <FiHome />

            {!compact && <span>Dashboard</span>}
          </NavItem>

          <NavItem to="/admin/pessoas" title="Pessoas">
            <FiUsers />

            {!compact && <span>Pessoas</span>}
          </NavItem>

          <NavItem to="/admin/livros" title="Livros">
            <FiBook />

            {!compact && <span>Livros</span>}
          </NavItem>
          <NavItem to="/admin/videos" title="Videos">
            <FiVideo />

            {!compact && <span>Videos</span>}
          </NavItem>

          <NavItem to="/admin/newsletter" title="Newsletter">
            <FiMail />

            {!compact && <span>Newsletter</span>}
          </NavItem>

          <NavItem to="/admin/artigos" title="Artigos / Dossiês">
            <FiFolder />

            {!compact && <span>Artigos / Dossiês</span>}
          </NavItem>

          <NavItem
            to="/admin/apresentacoes-trabalhos"
            title="Apresentações de Trabalhos"
          >
            <FiMonitor />

            {!compact && <span>Apres. de Trabalhos</span>}
          </NavItem>

          <NavItem
            to="/admin/instrumentos-pesquisa"
            title="Instrumentos de pesquisa"
          >
            <FiClipboard />

            {!compact && <span>Instr. de Pesquisas</span>}
          </NavItem>

          <NavItem to="/admin/pesquisas" title="Pesquisas">
            <TbFolderSearch />

            {!compact && <span>Pesquisas</span>}
          </NavItem>

          <NavItem to="/admin/juris" title="Juris">
            <GiInjustice />

            {!compact && <span>Juris</span>}
          </NavItem>

          <NavItem to="/admin/encontros" title="Encontros">
            <FiMic />

            {!compact && <span>Encontros</span>}
          </NavItem>

          <NavItem to="/admin/bancas" title="Bancas">
            <FiAward />

            {!compact && <span>Bancas</span>}
          </NavItem>

          <NavItem to="/admin/tematicas" title="Temáicas">
            <FiLayers />

            {!compact && <span>Temáicas</span>}
          </NavItem>

          <NavItem to="/admin/noticias" title="Notícias">
            <FiFileText />
            {!compact && <span>Notícias</span>}
          </NavItem>

          <NavItem to="/admin/agenda" title="Agenda">
            <FiCalendar />

            {!compact && <span>Agenda</span>}
          </NavItem>
          {user?.role === "SUPER_ADMIN" && (
            <NavItem to="/admin/usuarios" title="Usuários">
              <FiUserCheck />
              {!compact && <span>Usuários</span>}
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

            {!compact && <span>Voltar ao site</span>}
          </AdminButton>
        </BackWebSiteWrapper>
      </Sidebar>

      <Main inert={isMobile && mobileOpen}>
        <Header>
          <ToggleButton
            ref={toggle}
            type="button"
            aria-label={
              isMobile
                ? "Abrir menu"
                : collapsed
                  ? "Expandir menu"
                  : "Recolher menu"
            }
            aria-controls="admin-navigation"
            aria-expanded={isMobile ? mobileOpen : !collapsed}
            onClick={() =>
              isMobile
                ? setMobileOpen((open) => !open)
                : setCollapsed((value) => !value)
            }
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
