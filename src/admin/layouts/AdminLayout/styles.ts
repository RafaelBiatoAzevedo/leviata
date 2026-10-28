import styled, { createGlobalStyle } from "styled-components";
import { Link } from "react-router-dom";

interface SidebarProps {
  $collapsed: boolean;
  $mobileOpen?: boolean;
}

export const AdminTypography = createGlobalStyle`
  html:has(#admin-navigation) { font-size: 14px; }

  @media (max-width: 768px) {
    html:has(#admin-navigation) input,
    html:has(#admin-navigation) textarea,
    html:has(#admin-navigation) select { font-size: 16px; }
  }
`;

export const Container = styled.div`
  display: flex;

  background: ${({ theme }) => theme.colors.background};

  height: 100vh;
  height: 100dvh;
  width: 100%;
  min-width: 0;
  overflow: hidden;

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      transition: none;
      scroll-behavior: auto;
    }
  }
`;

export const Sidebar = styled.aside<SidebarProps>`
  flex-shrink: 0;
  width: ${({ $collapsed }) => ($collapsed ? "80px" : "280px")};

  transition:
    width 0.25s ease,
    transform 0.25s ease,
    visibility 0.25s;

  background: ${({ theme }) => theme.colors.surface};

  border-right: 1px solid ${({ theme }) => theme.colors.border}65;

  display: flex;

  flex-direction: column;

  box-shadow: 4px 0 24px rgb(0 0 0 / 3%);

  position: relative;

  z-index: 10;

  height: 100%;
  overflow: hidden;

  @media (max-width: 900px) {
    position: fixed;
    inset: 0 auto 0 0;
    width: min(300px, calc(100vw - 40px));
    height: 100dvh;
    z-index: 50;
    transform: ${({ $mobileOpen }) =>
      $mobileOpen ? "translateX(0)" : "translateX(-100%)"};
    visibility: ${({ $mobileOpen }) => ($mobileOpen ? "visible" : "hidden")};
  }
`;

export const Backdrop = styled.button`
  position: fixed;
  inset: 0;
  z-index: 40;
  border: 0;
  background: rgb(15 23 42 / 45%);
  backdrop-filter: blur(3px);
`;

export const Logo = styled.div<SidebarProps>`
  height: 70px;
  flex-shrink: 0;
  position: relative;

  display: flex;

  align-items: center;

  justify-content: ${({ $collapsed }) =>
    $collapsed ? "center" : "flex-start"};

  gap: 8px;

  padding: ${({ $collapsed }) => ($collapsed ? "0" : "0 20px")};

  border-bottom: 1px solid ${({ theme }) => theme.colors.border}45;

  strong {
    display: block;

    color: ${({ theme }) => theme.colors.heading};
    font-family: ${({ theme }) => theme.fonts.title};
    font-size: 27px;
    font-weight: 600;
    line-height: 1;
  }

  span {
    display: block;
    margin-top: 5px;
    color: ${({ theme }) => theme.colors.textSoft};
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }
`;

export const DrawerClose = styled.button`
  display: none;
  @media (max-width: 900px) {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    margin-left: auto;
    flex-shrink: 0;
    border-radius: 10px;
    font-size: 22px;
    &:hover {
      background: ${({ theme }) => theme.colors.primary}15;
    }
    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.colors.primary};
    }
  }
`;

export const LogoWrapper = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  border-radius: 8px;
  text-decoration: none;
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 5px;
  }
`;

export const LogoImage = styled.img`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 100%;
  padding: 1px;
  border: solid ${({ theme }) => theme.colors.primary} 1px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 36px;
    height: 36px;
  }
`;

export const Main = styled.main`
  flex: 1;
  min-width: 0;
  min-height: 0;

  display: flex;

  flex-direction: column;
`;

export const Header = styled.header`
  height: 70px;
  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: space-between;
  gap: 12px;

  padding: 0 24px;

  background: ${({ theme }) => theme.colors.surface};

  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);

  position: relative;

  z-index: 20;

  @media (max-width: 600px) {
    padding: 0 12px;
  }
`;

export const ToggleButton = styled.button`
  width: 44px;
  flex-shrink: 0;

  height: 44px;

  border: none;

  border-radius: 10px;

  cursor: pointer;

  background: transparent;

  color: ${({ theme }) => theme.colors.text};

  font-size: 24px;

  transition: 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.primary}15;

    color: ${({ theme }) => theme.colors.primary};
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

export const UserArea = styled.div`
  display: flex;
  min-width: 0;

  align-items: center;

  justify-content: space-between;

  gap: 1rem;

  padding: 0;

  @media (max-width: 600px) {
    padding: 0;
    border: 0;
    gap: 10px;
  }
`;

export const UserInfo = styled.div`
  display: flex;
  min-width: 0;

  align-items: center;

  gap: 0.75rem;
`;

export const Avatar = styled.div`
  width: 46px;

  height: 46px;

  border-radius: 50%;

  display: flex;

  align-items: center;

  justify-content: center;

  background: ${({ theme }) => theme.colors.primary};

  color: ${({ theme }) => theme.colors.onPrimary};

  font-weight: 700;

  font-size: 1rem;

  flex-shrink: 0;
`;

export const UserData = styled.div`
  display: flex;
  min-width: 0;
  max-width: 260px;

  flex-direction: column;

  @media (max-width: 600px) {
    display: none;
  }
`;

export const UserName = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.95rem;

  font-weight: 600;

  color: ${({ theme }) => theme.colors.text};
`;

export const UserRole = styled.span`
  font-size: 0.8rem;

  color: ${({ theme }) => theme.colors.text};

  text-transform: capitalize;
`;

export const Content = styled.div`
  flex: 1;
  min-width: 0;
  min-height: 0;
  container-type: inline-size;
  container-name: admin-content;

  overflow-y: auto;

  padding: clamp(20px, 2.5vw, 32px);

  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

export const SidebarFooter = styled.div<{ $collapsed: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-shrink: 0;
  padding: ${({ $collapsed }) => ($collapsed ? "12px" : "14px 16px")};
  padding-bottom: max(14px, env(safe-area-inset-bottom));
  border-top: 1px solid ${({ theme }) => theme.colors.border}45;
  background: ${({ theme }) => theme.colors.surface};
`;

export const PortalLink = styled(Link)<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${({ $collapsed }) =>
    $collapsed ? "center" : "flex-start"};
  gap: 10px;
  min-height: 42px;
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border}60;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: 12px;
  text-decoration: none;
  transition:
    background 0.2s,
    border-color 0.2s;
  span {
    flex: 1;
  }
  svg {
    flex-shrink: 0;
    width: 17px;
    height: 17px;
  }
  &:hover {
    background: ${({ theme }) => theme.colors.accentSoft};
    border-color: ${({ theme }) => theme.colors.primary};
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 3px;
  }
`;
