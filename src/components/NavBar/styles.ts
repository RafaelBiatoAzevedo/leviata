import styled from "styled-components";

export const Container = styled.nav`
  width: 100%;
  height: 70px;
  position: fixed;
  top: 0;
  left: 0;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 8%;
  background: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.3s ease;

  z-index: 1000;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    padding: 0 4%;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0 3%;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    height: 50px;
  }
`;

export const LogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
`;

export const Logo = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 100%;
  padding: 1px;
  border: solid ${({ theme }) => theme.colors.border} 1px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 36px;
    height: 36px;
  }
`;

export const Menu = styled.ul`
  display: flex;
  gap: 2.4rem;
  list-style: none;
`;

export const MenuItem = styled.a<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.1rem;
  cursor: pointer;
  text-decoration: none;

  color: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.text};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};

  transition: 0.3s;

  &:hover {
    color: ${({ theme }) => theme.colors.primary}3;
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
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

export const MobileOnly = styled.div`
  display: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: block;
  }
`;

export const MobileMenu = styled.div<{ $open: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: fixed;
  top: 70px;
  right: 0;

  width: 50%;
  height: 100dvh;

  background: ${({ theme }) => theme.colors.surface};

  display: flex;
  flex-direction: column;

  padding: 2rem;

  transform: ${({ $open }) => ($open ? "translateX(0)" : "translateX(100%)")};

  transition: 0.3s;

  z-index: 999;

  ${MenuItem} {
    font-size: 1.2rem;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    top: 50px;
    width: 60%;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.smallMobile}) {
    width: 100%;
  }
`;

export const MenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const FooterMenuMobile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6.5rem 0px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 5.5rem 0px;
  }
`;

export const Copy = styled.p`
  text-align: center;
  margin-top: 3rem;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSoft};
`;
