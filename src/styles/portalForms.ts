import { css } from "styled-components";

export const portalFieldStyles = css`
  width: 100%;
  min-width: 0;
  padding: 13px 14px;
  border: 1px solid var(--theme-field-border, rgba(17, 24, 39, 0.14));
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: 0;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &::placeholder {
    color: var(--theme-muted, #818780);
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accentSoft};
  }
`;

export const portalButtonStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  align-self: flex-end;
  gap: 10px;
  min-height: 46px;
  padding: 13px 20px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 12px;
  font-weight: 600;
  transition:
    background 0.2s ease,
    box-shadow 0.2s ease;

  svg {
    font-size: 17px;
  }

  &:hover,
  &:focus-visible {
    background: ${({ theme }) => theme.colors.accentHover};
    box-shadow: 0 5px 18px ${({ theme }) => theme.colors.accentGlow};
  }
`;
