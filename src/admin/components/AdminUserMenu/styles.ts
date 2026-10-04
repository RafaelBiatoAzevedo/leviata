import styled from "styled-components";

export const Container = styled.div`
  position: relative;
`;
export const OptionsButton = styled.button`
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  svg {
    font-size: 22px;
  }
  &:hover,
  &[aria-expanded="true"] {
    background: ${({ theme }) => theme.colors.accentSoft};
    color: ${({ theme }) => theme.colors.primary};
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 3px;
  }
`;
export const Menu = styled.div`
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  width: 250px;
  max-width: calc(100vw - 100px);
  max-height: calc(100vh - 100px);
  overflow-y: auto;
  padding: 7px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.accentGlow};
  background: ${({ theme }) => theme.colors.background};
  box-shadow: 0 12px 32px
    color-mix(
      in srgb,
      ${({ theme }) => theme.colors.secondary} 14%,
      transparent
    );
  z-index: 100;
`;
export const MenuHeading = styled.div`
  padding: 10px 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  span {
    font-size: 11px;
    color: ${({ theme }) => theme.colors.textSoft};
  }
  strong {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.secondary};
    font-weight: 500;
    overflow-wrap: anywhere;
  }
`;
export const MenuItem = styled.button<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 42px;
  padding: 10px 12px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: ${({ theme, $danger }) =>
    $danger ? theme.colors.feedback.danger.main : theme.colors.secondary};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  text-align: left;
  cursor: pointer;
  svg {
    font-size: 17px;
    flex-shrink: 0;
  }
  &:hover {
    background: ${({ theme }) => theme.colors.accentSoft};
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: -2px;
  }
`;
export const Separator = styled.div`
  height: 1px;
  margin: 6px 4px;
  background: ${({ theme }) => theme.colors.accentGlow};
`;
