import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";

export const Container = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  display: grid;
  grid-template-columns: minmax(0, 1fr) max-content minmax(0, 1fr);
  align-items: center;
  width: 100%;
  height: var(--portal-header-height, 70px);
  padding: 0 clamp(16px, 4vw, 64px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.primary}35;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: 0 5px 22px rgba(17, 24, 39, 0.045);

  &::before {
    content: "";
    position: absolute;
    inset: 0 0 auto;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      ${({ theme }) => theme.colors.primary}75,
      transparent
    );
    pointer-events: none;
  }

  @media (max-width: 1200px) {
    grid-template-columns: minmax(0, 1fr) auto;
  }
`;

export const LogoButtonWrapper = styled.button`
  grid-column: 1;
  justify-self: start;
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  text-decoration: none;
  transition: filter 0.2s ease;

  &:hover,
  &:focus-visible {
    filter: drop-shadow(0 3px 8px ${({ theme }) => theme.colors.primary}35);
  }
`;

export const TitleColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${({ theme }) => theme.colors.heading};

  p {
    margin: 0;
    font-family: ${({ theme }) => theme.fonts.title};
    font-size: 16px;
    font-weight: 600;
    line-height: 0.95;
    letter-spacing: 0.3px;
  }

  p:nth-child(2) {
    margin-block: 2px;
    color: var(--theme-muted, #6a7079);
    font-size: 10px;
    font-weight: 400;
    font-style: italic;
  }
`;

export const Logo = styled.img`
  width: 44px;
  height: 44px;
  padding: 2px;
  border: 1px solid ${({ theme }) => theme.colors.primary}80;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.background};

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
  }
`;

export const DesktopOnly = styled.div<{ $actions?: boolean }>`
  grid-column: ${({ $actions }) => ($actions ? 3 : 2)};
  justify-self: ${({ $actions }) => ($actions ? "end" : "center")};
  min-width: 0;

  @media (max-width: 1200px) {
    display: none;
  }
`;

export const Menu = styled.ul`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(2px, 0.35vw, 8px);
  margin: 0;
  padding: 5px;
  border: 1px solid ${({ theme }) => theme.colors.primary}25;
  border-radius: 14px;
  background: var(--theme-elevated, rgba(255, 255, 255, 0.55));
  list-style: none;
`;

export const Dropdown = styled.li<{ $active: boolean; $open: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  border-radius: 9px;
  background: ${({ theme, $active, $open }) =>
    $active || $open ? theme.colors.accentSoft : "transparent"};
  transition: background 0.2s ease;

  &:hover,
  &:focus-within {
    background: ${({ theme }) => theme.colors.accentSoft};
  }
`;

export const MenuItem = styled(Link)<{ $active?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  min-width: 0;
  min-height: 46px;
  padding: 0 10px;
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.heading};
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: 0;
  text-decoration: none;
  white-space: nowrap;

  &::after {
    content: "";
    position: absolute;
    right: 9px;
    bottom: 4px;
    left: 9px;
    height: 2px;
    border-radius: 2px;
    background: ${({ theme }) => theme.colors.primary};
    transform: scaleX(${({ $active }) => ($active ? 1 : 0)});
    transition: transform 0.2s ease;
  }

  &:hover::after,
  &:focus-visible::after {
    transform: scaleX(1);
  }
`;

export const DropdownArrow = styled.button<{ $expanded: boolean }>`
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 28px;
  min-height: 46px;
  margin-right: 3px;
  border-radius: 7px;
  color: ${({ theme }) => theme.colors.heading};

  svg {
    width: 15px;
    height: 15px;
    transform: rotate(${({ $expanded }) => ($expanded ? "180deg" : "0deg")});
    transition: transform 0.2s ease;
  }

  &:hover,
  &:focus-visible {
    background: ${({ theme }) => theme.colors.accentSoft};
  }
`;

const dropdownReveal = keyframes`
  from { opacity: 0; translate: 0 -4px; }
  to { opacity: 1; translate: 0 0; }
`;

export const DropdownContent = styled.div`
  position: absolute;
  top: 100%;
  left: 50%;
  z-index: 20;
  width: 360px;
  max-width: calc(100vw - 32px);
  padding-top: 12px;
  transform: translateX(-50%);
  animation: ${dropdownReveal} 0.18s ease;

  &[hidden] {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const DropdownPanel = styled.div`
  display: flex;
  flex-direction: column;
  max-height: calc(100dvh - var(--portal-header-height, 70px) - 28px);
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.colors.primary}50;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: 0 18px 42px rgba(17, 24, 39, 0.14);
`;

export const DropdownHeading = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0 6px 8px;
  padding: 10px 5px 14px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.primary}30;

  strong {
    color: ${({ theme }) => theme.colors.heading};
    font-family: ${({ theme }) => theme.fonts.title};
    font-size: 23px;
    font-weight: 600;
    line-height: 1.15;
    letter-spacing: 0;
  }

  span {
    color: var(--theme-muted, #626973);
    font-size: 11px;
    line-height: 1.7;
    letter-spacing: 0;
  }
`;

export const SubmenuList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const SubmenuItem = styled(Link)<{ $active: boolean }>`
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr) 14px;
  align-items: center;
  gap: 11px;
  min-width: 0;
  min-height: 44px;
  padding: 11px;
  border: 1px solid
    ${({ theme, $active }) =>
      $active ? `${theme.colors.primary}45` : "transparent"};
  border-radius: 10px;
  background: ${({ theme, $active }) =>
    $active ? theme.colors.accentSoft : "transparent"};
  color: ${({ theme }) => theme.colors.heading};
  text-decoration: none;
  transition:
    background 0.2s ease,
    border-color 0.2s ease;

  > svg:last-child {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 14px;
    opacity: 0.8;
  }

  &:hover,
  &:focus-visible {
    border-color: ${({ theme }) => theme.colors.primary}45;
    background: ${({ theme }) => theme.colors.accentSoft};
  }
`;

export const SubmenuIcon = styled.span`
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 1px solid ${({ theme }) => theme.colors.primary}35;
  border-radius: 9px;
  background: rgba(17, 24, 39, 0.025);
  color: ${({ theme }) => theme.colors.primary};
  font-size: 17px;
`;

export const SubmenuCopy = styled.span`
  min-width: 0;
  letter-spacing: 0;

  strong {
    display: block;
    font-size: 12px;
    font-weight: 500;
    line-height: 1.5;
    letter-spacing: 0;
    overflow-wrap: anywhere;
  }

  > span {
    display: block;
    margin-top: 3px;
    color: var(--theme-muted, #626973);
    font-size: 11px;
    line-height: 1.6;
    letter-spacing: 0;
    overflow-wrap: anywhere;
  }
`;

export const ActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 28px;
`;

export const MobileOnly = styled.div`
  grid-column: 2;
  justify-self: end;
  display: none;
  align-items: center;
  gap: 8px;

  @media (max-width: 1200px) {
    display: flex;
  }
`;

export const MenuToggle = styled.button<{ $open: boolean }>`
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 1px solid ${({ theme }) => theme.colors.primary}55;
  border-radius: 11px;
  color: ${({ theme, $open }) =>
    $open ? theme.colors.primary : theme.colors.heading};
  background: ${({ theme, $open }) =>
    $open ? theme.colors.secondary : theme.colors.accentSoft};
  transition:
    background 0.2s ease,
    color 0.2s ease;

  svg {
    width: 22px;
    height: 22px;
  }
`;

export const MobileMenu = styled.div<{ $open: boolean }>`
  position: fixed;
  top: var(--portal-header-height, 70px);
  right: 0;
  z-index: 10;
  display: none;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  height: calc(100dvh - var(--portal-header-height, 70px));
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 24px clamp(16px, 5vw, 64px) max(16px, env(safe-area-inset-bottom));
  border-top: 1px solid ${({ theme }) => theme.colors.primary}25;
  background: ${({ theme }) => theme.colors.background};
  visibility: ${({ $open }) => ($open ? "visible" : "hidden")};
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transition:
    opacity 0.2s ease,
    visibility 0.2s ease;

  ${MenuItem} {
    flex: 1;
    gap: 12px;
    min-height: 62px;
    padding: 8px;
    white-space: normal;

    &::after {
      display: none;
    }
  }

  ${DropdownArrow} {
    width: 44px;
    height: 44px;
    margin-right: 4px;
    border: 1px solid ${({ theme }) => theme.colors.primary}35;
    background: ${({ theme }) => theme.colors.accentSoft};

    svg {
      width: 16px;
      height: 16px;
    }
  }

  @media (max-width: 1200px) {
    display: flex;
  }
`;

export const MobileIntro = styled.div`
  width: 100%;
  max-width: 900px;
  margin-inline: auto;

  > span {
    color: var(--theme-accent-text, #7b622f);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }

  h2 {
    margin-top: 7px;
    color: ${({ theme }) => theme.colors.heading};
    font-size: 29px;
    font-weight: 600;
    line-height: 1.1;
    letter-spacing: -0.3px;
  }

  p {
    margin-top: 7px;
    color: var(--theme-muted, #626973);
    font-size: 12px;
    line-height: 1.7;
    letter-spacing: 0;
  }
`;

export const MenuWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: start;
  gap: 14px;
  width: 100%;
  max-width: 900px;
  margin-inline: auto;

  @media (max-width: 640px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 10px;
  }
`;

export const MobileGroup = styled.div<{ $active: boolean }>`
  min-width: 0;
  padding: 5px;
  border: 1px solid
    ${({ theme, $active }) =>
      $active ? theme.colors.primary : `${theme.colors.primary}35`};
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme, $active }) =>
    $active ? `inset 3px 0 0 ${theme.colors.primary}` : "none"};
`;

export const MobileGroupHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
`;

export const MobileCategoryIcon = styled.span`
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 38px;
  height: 38px;
  border: 1px solid ${({ theme }) => theme.colors.primary}45;
  border-radius: 11px;
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 18px;
`;

export const MobileCategoryCopy = styled.span`
  min-width: 0;
  letter-spacing: 0;

  strong {
    display: block;
    color: ${({ theme }) => theme.colors.heading};
    font-family: ${({ theme }) => theme.fonts.title};
    font-size: 22px;
    font-weight: 600;
    line-height: 1.1;
    letter-spacing: 0;
  }

  > span {
    display: block;
    margin-top: 5px;
    color: var(--theme-muted, #626973);
    font-size: 11px;
    font-weight: 400;
    line-height: 1.5;
    letter-spacing: 0;
  }
`;

export const MobileSubmenu = styled.ul`
  display: grid;
  gap: 4px;
  margin: 6px 4px 0;
  padding: 8px 0 0;
  border-top: 1px solid ${({ theme }) => theme.colors.primary}30;
  list-style: none;

  &[hidden] {
    display: none;
  }
`;

export const FooterMenuMobile = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
  max-width: 900px;
  margin: auto auto 0;
  padding-top: 22px;
  border-top: 1px solid ${({ theme }) => theme.colors.primary}30;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 16px;
  }
`;

export const Copy = styled.p`
  color: var(--theme-muted, #626973);
  font-size: 10px;
  line-height: 1.6;
  letter-spacing: 0;
  text-align: center;
`;

// The theme controls reuse the original switch structure.
export const ThemeSwitch = styled.button`
  position: relative;
  display: block;
  flex-shrink: 0;
  align-items: center;
  width: 60px;
  height: 44px;
  border: 1px solid ${({ theme }) => theme.colors.primary}55;
  border-radius: 11px;
  background: ${({ theme }) => theme.colors.accentSoft};
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background 0.2s ease;
  &::before {
    content: "";
    position: absolute;
    inset: 9px 5px;
    border-radius: 20px;
    background: ${({ theme }) => theme.colors.background};
  }
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 3px;
  }
  @media (prefers-reduced-motion: reduce) {
    &,
    * {
      transition: none;
    }
  }
`;

export const SwitchCircle = styled.span<{ $themeMode: "light" | "dark" }>`
  position: absolute;
  top: 10px;
  left: 6px;
  transform: translateX(
    ${({ $themeMode }) => ($themeMode === "dark" ? "24px" : "0px")}
  );
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  font-size: 12px;
  transition: transform 0.25s ease;
  svg {
    width: 14px;
    height: 14px;
  }
`;

export const LanguageButton = styled.button`
  color: ${({ theme }) => theme.colors.textSoft};
  font-size: 1rem;
  font-weight: 600;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;
