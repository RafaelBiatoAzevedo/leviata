import styled, { css } from "styled-components";
import { NavLink } from "react-router-dom";

const visuallyHidden = css`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
`;

export const Menu = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  padding-top: 16px;
`;

export const Search = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 9px;
  min-height: 40px;
  margin: 0 16px 12px;
  padding: 0 10px;
  border: 1px solid ${({ theme }) => theme.colors.border}60;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textSoft};
  transition:
    border-color 0.2s,
    box-shadow 0.2s;

  > svg {
    flex-shrink: 0;
    font-size: 16px;
  }

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accentSoft};
  }

  input {
    width: 100%;
    min-width: 0;
    padding: 10px 0;
    border: 0;
    outline: 0;
    background: transparent;
    color: ${({ theme }) => theme.colors.text};
    font: inherit;
    font-size: 12px;
    &::placeholder {
      color: ${({ theme }) => theme.colors.textSoft};
      opacity: 1;
    }
    &::-webkit-search-cancel-button {
      display: none;
    }
  }
`;

export const ClearSearch = styled.button`
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  margin-right: -5px;
  border-radius: 7px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  &:hover {
    background: ${({ theme }) => theme.colors.accentSoft};
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
  }
`;

export const SearchSummary = styled.span`
  ${visuallyHidden}
`;

export const Navigation = styled.nav<{ $compact: boolean }>`
  flex: 1;
  min-height: 0;
  padding: ${({ $compact }) => ($compact ? "0 10px 16px" : "0 12px 16px")};
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.colors.primary}60 transparent;
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.primary}60;
    border-radius: 8px;
  }
`;

export const Group = styled.section`
  display: flex;
  flex-direction: column;
  gap: 2px;
  & + & {
    margin-top: 12px;
  }
`;

export const GroupTitle = styled.h2<{ $compact: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: ${({ $compact }) => ($compact ? "10px" : "22px")};
  margin: 0 0 2px;
  padding: 0 12px;
  color: ${({ theme }) => theme.colors.heading};
  font: 600 10px/1.5 ${({ theme }) => theme.fonts.body};
  letter-spacing: 1.4px;
  text-transform: uppercase;

  > span {
    opacity: 0.7;
  }

  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors.border}40;
  }
  ${({ $compact }) =>
    $compact &&
    css`
      span {
        ${visuallyHidden}
      }
    `}
`;

export const ItemIcon = styled.span`
  display: grid;
  place-items: center;
  flex: 0 0 30px;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  transition:
    color 0.2s,
    background 0.2s;
  svg {
    width: 18px;
    height: 18px;
  }
`;

export const ItemLabel = styled.span<{ $compact: boolean }>`
  flex: 1;
  min-width: 0;
  font-size: 13px;
  line-height: 1.45;
  ${({ $compact }) => $compact && visuallyHidden}
`;

export const NavItem = styled(NavLink)<{ $compact: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: ${({ $compact }) => ($compact ? "center" : "flex-start")};
  gap: 9px;
  min-height: 40px;
  padding: ${({ $compact }) => ($compact ? "5px" : "5px 10px")};
  border: 1px solid transparent;
  border-radius: 10px;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  transition:
    background 0.2s,
    border-color 0.2s,
    color 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.accentSoft};
    ${ItemIcon} {
      color: ${({ theme }) => theme.colors.primary};
    }
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: -2px;
  }

  &.active {
    background: ${({ theme }) => theme.colors.accentSoft};
    border-color: ${({ theme }) => theme.colors.primary}45;
    color: ${({ theme }) => theme.colors.heading};
    font-weight: 600;
    ${ItemIcon} {
      background: ${({ theme }) => theme.colors.primary};
      color: ${({ theme }) => theme.colors.onPrimary};
    }
    &::before {
      content: "";
      position: absolute;
      left: -1px;
      width: 3px;
      height: 18px;
      border-radius: 0 3px 3px 0;
      background: ${({ theme }) => theme.colors.primary};
    }
  }

  @media (pointer: coarse) {
    min-height: 44px;
  }
`;

export const NotificationCount = styled.span<{ $compact: boolean }>`
  flex-shrink: 0;
  min-width: 22px;
  padding: 3px 5px;
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  text-align: center;
  font-size: 10px;
  font-weight: 700;
  line-height: 1.2;
  font-variant-numeric: tabular-nums;
  ${({ $compact, theme }) =>
    $compact &&
    css`
      position: absolute;
      top: 6px;
      right: 7px;
      width: 8px;
      min-width: 0;
      height: 8px;
      padding: 0;
      border: 2px solid ${theme.colors.surface};
      border-radius: 50%;
      font-size: 0;
    `}
`;

export const EmptySearch = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 32px 12px;
  color: ${({ theme }) => theme.colors.textSoft};
  text-align: center;
  > svg {
    font-size: 26px;
    color: ${({ theme }) => theme.colors.primary};
  }
  strong {
    color: ${({ theme }) => theme.colors.heading};
    font-size: 12px;
    font-weight: 500;
  }
  > span {
    max-width: 180px;
    font-size: 12px;
    line-height: 1.7;
  }
`;
