import { NavLink } from "react-router-dom";
import styled from "styled-components";

export const Container = styled.div`
  display: flex;

  min-height: 100vh;

  background: ${({ theme }) => theme.colors.background};
`;

export const Sidebar = styled.aside`
  width: 280px;

  display: flex;
  flex-direction: column;

  background: ${({ theme }) => theme.colors.surface};

  border-right: 1px solid ${({ theme }) => theme.colors.border};

  padding: 2rem 1.5rem;
`;

export const Logo = styled.div`
  margin-bottom: 3rem;

  h2 {
    color: ${({ theme }) => theme.colors.primary};

    margin-bottom: 0.3rem;

    font-size: 1.7rem;
  }

  span {
    font-size: 0.9rem;

    color: ${({ theme }) => theme.colors.text};
  }
`;

export const Navigation = styled.nav`
  display: flex;

  flex-direction: column;

  gap: 0.5rem;

  flex: 1;
`;

export const NavItem = styled(NavLink)`
  display: flex;

  align-items: center;

  padding: 0.9rem 1rem;

  border-radius: 0.8rem;

  color: ${({ theme }) => theme.colors.text};

  text-decoration: none;

  transition: 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.primary}15;

    color: ${({ theme }) => theme.colors.primary};
  }

  &.active {
    background: ${({ theme }) => theme.colors.primary};

    color: white;

    font-weight: 600;
  }
`;

export const Main = styled.main`
  flex: 1;

  display: flex;

  flex-direction: column;
`;

export const Header = styled.header`
  height: 72px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  padding: 0 2rem;

  background: ${({ theme }) => theme.colors.surface};

  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const User = styled.span`
  font-weight: 600;

  color: ${({ theme }) => theme.colors.text};
`;

export const LogoutButton = styled.button`
  padding: 0.7rem 1.2rem;

  border: none;

  border-radius: 0.7rem;

  cursor: pointer;

  background: ${({ theme }) => theme.colors.primary};

  color: white;

  font-weight: 600;

  transition: 0.2s;

  &:hover {
    filter: brightness(1.05);
  }
`;

export const Content = styled.main`
  flex: 1;

  padding: 2rem;

  overflow-y: auto;
`;
