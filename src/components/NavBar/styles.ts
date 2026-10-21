import { Link } from "react-router-dom";
import styled from "styled-components";

export const Container = styled.nav`
  width: 100%;
  height: var(--portal-header-height, 70px);
  position: fixed;
  top: 0;
  left: 0;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 clamp(16px, 4vw, 64px);
  background: ${({ theme }) => theme.colors.surface};

  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  z-index: 1000;
`;

export const LogoButtonWrapper = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;

  gap: 0.5rem;

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

export const TitleColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  p {
    margin: 0;
    padding: 0;
    font-size: 0.9rem;
    font-family: ${({ theme }) => theme.fonts.title};
    font-weight: 800;
    line-height: 0.9;
  }
`;

export const Logo = styled.img`
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

export const Menu = styled.ul`
  display: flex;
  gap: clamp(12px, 1.6vw, 28px);
  list-style: none;
`;

export const MenuItem = styled.a<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  min-height: 44px;
  font-size: 14px;
  cursor: pointer;
  text-decoration: none;

  color: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.text};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};

  transition: 0.3s;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const ActionsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2rem;
`;

export const ThemeSwitch = styled.button`
  width: 52px;
  height: 26px;

  background: ${({ theme }) => theme.colors.border};

  border-radius: 20px;
  border: none;

  position: relative;
  cursor: pointer;

  display: flex;
  align-items: center;

  transition: 0.3s;
`;

export const SwitchCircle = styled.span<{ themeMode: string }>`
  width: 22px;
  height: 22px;

  background: ${({ theme }) => theme.colors.primary};

  border-radius: 50%;

  position: absolute;
  top: 2px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 12px;

  left: ${({ themeMode }) => (themeMode === "dark" ? "2px" : "28px")};

  transition: all 0.3s ease;
`;

export const LanguageButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;

  font-size: 1rem;
  font-weight: 600;

  color: ${({ theme }) => theme.colors.textSoft};

  transition: 0.3s;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const DesktopOnly = styled.div`
  @media (max-width: 1200px) {
    display: none;
  }
`;

export const MobileOnly = styled.div`
  display: none;

  @media (max-width: 1200px) {
    display: block;
  }
`;

export const MobileMenu = styled.div<{ $open: boolean }>`
  display: none;
  position: fixed;
  top: var(--portal-header-height, 70px);
  right: 0;
  width: 100%;
  height: calc(100dvh - var(--portal-header-height, 70px));
  overflow-y: auto;
  overscroll-behavior: contain;

  background: ${({ theme }) => theme.colors.background};

  padding: 24px clamp(20px, 6vw, 64px);
  visibility: ${({ $open }) => ($open ? "visible" : "hidden")};
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transition: opacity 0.2s ease, visibility 0.2s ease;

  z-index: 999;

  ${MenuItem} {
    font-size: 17px;
    font-weight: 600;
  }

  @media (max-width: 1200px) {
    display: block;
  }
`;

export const MenuToggle = styled.button`
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 1px solid ${({ theme }) => theme.colors.primary}55;
  border-radius: 10px;
  color: ${({ theme }) => theme.colors.secondary};

  svg {
    width: 24px;
    height: 24px;
  }
`;

export const MenuWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: start;
  gap: 24px;
  max-width: 900px;
  margin-inline: auto;

  @media (max-width: 640px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 16px;
  }
`;

export const FooterMenuMobile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;
`;

export const Copy = styled.p`
  text-align: center;
  margin-top: 3rem;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSoft};
`;

export const Dropdown = styled.li`
  position: relative;
  display: flex;
  align-items: center;
`;

export const DropdownArrow = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  min-height: 44px;

  cursor: pointer;
`;

export const DropdownContent = styled.div`
  position: absolute;
  top: 130%;
  left: 0;

  min-width: 220px;

  display: flex;
  flex-direction: column;

  padding: 12px;

  border-radius: 10px;

  background: ${({ theme }) => theme.colors.secondary};

  border: 1px solid ${({ theme }) => theme.colors.border};

  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);

  z-index: 100;
`;

export const SubmenuItem = styled(Link)`
  display: block;
  padding: 12px;

  border-radius: 8px;

  text-decoration: none;

  color: ${({ theme }) => theme.colors.textSoft};

  transition: 0.3s;

  &:hover {
    background: ${({ theme }) => theme.colors.backgroundCard};

    color: ${({ theme }) => theme.colors.accent};
  }

  ${MobileMenu} & {
    min-height: 44px;
    padding: 12px 14px;
    border-left: 1px solid ${({ theme }) => theme.colors.primary}55;
    border-radius: 0;
    color: ${({ theme }) => theme.colors.text};
    font-size: 14px;
    line-height: 1.5;
  }
`;
