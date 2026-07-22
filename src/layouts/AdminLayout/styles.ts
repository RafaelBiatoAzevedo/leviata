import styled from "styled-components";
import { NavLink } from "react-router-dom";

interface SidebarProps {
  $collapsed: boolean;
}

export const Container = styled.div`
  display: flex;

  min-height: 100vh;

  background: ${({ theme }) => theme.colors.background};
`;

export const Sidebar = styled.aside<SidebarProps>`
  width: ${({ $collapsed }) => ($collapsed ? "76px" : "240px")};

  transition: 0.4s;

  background: ${({ theme }) => theme.colors.surface};

  border-right: 1px solid ${({ theme }) => theme.colors.border};

  display: flex;

  flex-direction: column;
`;

export const Logo = styled.div<SidebarProps>`
  height: 70px;

  display: flex;

  align-items: center;

  justify-content: ${({ $collapsed }) =>
    $collapsed ? "center" : "flex-start"};

  gap: 15px;

  padding: ${({ $collapsed }) => ($collapsed ? "0" : "0 24px")};

  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  strong {
    display: block;

    font-size: 18px;
  }

  span {
    color: ${({ theme }) => theme.colors.text};

    font-size: 13px;
  }
`;

export const LogoWrapper = styled.div`
  display: flex;
  justify-content: center;

  position: relative;

  text-decoration: none;

  transition:
    transform 0.3s ease,
    filter 0.3s ease;

  filter: drop-shadow(0 0 12px ${({ theme }) => theme.colors.primary}40);

  &:hover {
    transform: scale(1.03);

    filter: drop-shadow(0 0 18px ${({ theme }) => theme.colors.primary}70)
      drop-shadow(0 0 32px ${({ theme }) => theme.colors.primary}30);
  }
`;

export const LogoImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 100%;
  padding: 1px;
  border: solid ${({ theme }) => theme.colors.primary} 1px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 36px;
    height: 36px;
  }
`;

export const Navigation = styled.nav`
  padding: 20px 10px;

  display: flex;

  flex-direction: column;

  gap: 8px;

  flex: 1;
`;

export const NavItem = styled(NavLink)`
  height: 48px;

  border-radius: 12px;

  display: flex;

  align-items: center;

  gap: 16px;

  padding: 0 16px;

  color: ${({ theme }) => theme.colors.text};

  text-decoration: none;

  transition: 0.2s;

  svg {
    min-width: 22px;

    font-size: 22px;
  }

  span {
    white-space: nowrap;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.primary}15;

    color: ${({ theme }) => theme.colors.primary};
  }

  &.active {
    background: ${({ theme }) => theme.colors.primary};

    color: ${({ theme }) => theme.colors.text};
  }
`;

export const Main = styled.main`
  flex: 1;

  display: flex;

  flex-direction: column;
`;

export const Header = styled.header`
  height: 70px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  padding: 0 24px;

  background: ${({ theme }) => theme.colors.surface};

  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const ToggleButton = styled.button`
  width: 42px;

  height: 42px;

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
`;

export const UserArea = styled.div`
  display: flex;

  align-items: center;

  gap: 20px;
`;

export const UserName = styled.span`
  font-weight: 600;
`;

export const LogoutButton = styled.button`
  display: flex;

  align-items: center;

  gap: 10px;

  border: none;

  cursor: pointer;

  background: ${({ theme }) => theme.colors.primary};

  color: ${({ theme }) => theme.colors.text};

  padding: 10px 18px;

  border-radius: 10px;

  font-weight: 600;

  transition: 0.2s;

  svg {
    font-size: 18px;
  }

  &:hover {
    filter: brightness(0.95);
  }
`;

export const Content = styled.main`
  flex: 1;

  overflow-y: auto;

  padding: 32px;
`;
