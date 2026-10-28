import { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import {
  FiMenu,
  FiArrowUpRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiGlobe,
  FiX,
} from "react-icons/fi";

import {
  Container,
  Sidebar,
  Logo,
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
  SidebarFooter,
  PortalLink,
  AdminTypography,
  Backdrop,
  DrawerClose,
} from "./styles";

import leviataLogo from "../../../assets/images/leviataLogo.png";
import { useAuth } from "../../hooks/useAuth";
import { AdminSidebarMenu } from "../../components/AdminSidebarMenu";
import { AdminUserMenu } from "../../components/AdminUserMenu";
import { formatUserRole } from "../../utils/users";
import { NotificationBell } from "../../components/NotificationBell";
import { ThemeToggle } from "../../../components/ThemeToggle";
import { AppVersion } from "../../../components/AppVersion";

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
      sidebar.current
        ?.querySelector<HTMLElement>("[data-drawer-close]")
        ?.focus();
    });
    function handleKeys(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setMobileOpen(false);
      }
      if (event.key !== "Tab") return;
      const items = Array.from(
        sidebar.current?.querySelectorAll<HTMLElement>(
          "button:not(:disabled), a[href], input:not(:disabled)",
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
          <LogoWrapper
            to="/admin"
            aria-label="Leviatã, início da administração"
            title="Início da administração"
            onClick={() => setMobileOpen(false)}
          >
            <LogoImage src={leviataLogo} alt="Leviata e o cativeiro" />
            {!compact && (
              <div>
                <strong>Leviatã</strong>
                <span>Administração</span>
              </div>
            )}
          </LogoWrapper>
          <DrawerClose
            data-drawer-close
            type="button"
            aria-label="Fechar menu"
            onClick={() => setMobileOpen(false)}
          >
            <FiX aria-hidden="true" />
          </DrawerClose>
        </Logo>

        <AdminSidebarMenu
          compact={compact}
          role={user?.role}
          onNavigate={() => setMobileOpen(false)}
        />

        <SidebarFooter $collapsed={compact}>
          <PortalLink
            to="/"
            $collapsed={compact}
            aria-label="Voltar ao site público"
            title={compact ? "Voltar ao site" : undefined}
          >
            <FiGlobe aria-hidden="true" />
            {!compact && (
              <>
                <span>Voltar ao site</span>
                <FiArrowUpRight aria-hidden="true" />
              </>
            )}
          </PortalLink>
          <AppVersion />
        </SidebarFooter>
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
            {isMobile ? (
              <FiMenu />
            ) : collapsed ? (
              <FiChevronsRight />
            ) : (
              <FiChevronsLeft />
            )}
          </ToggleButton>

          <UserArea>
            <ThemeToggle />
            <NotificationBell />
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
