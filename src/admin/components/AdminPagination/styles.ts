import styled from "styled-components";

export const Container = styled.nav`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
  min-height: 52px;
  padding: 4px 8px;
  color: ${({ theme }) => theme.colors.secondary};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;

  @media (max-width: 600px) {
    gap: 12px 20px;
    padding: 4px 0;
  }
`;

export const RowsField = styled.div`
  display: flex;
  align-items: center;
  gap: 22px;
  label {
    white-space: nowrap;
  }
`;

export const SelectWrapper = styled.div`
  position: relative;
  select {
    appearance: none;
    width: 60px;
    min-height: 40px;
    padding: 8px 24px 8px 8px;
    border: 0;
    border-bottom: 1px solid ${({ theme }) => theme.colors.textSoft};
    border-radius: 0;
    color: inherit;
    background: ${({ theme }) => theme.colors.background};
    font: inherit;
    cursor: pointer;
    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.colors.primary};
      outline-offset: 3px;
    }
    &:disabled {
      cursor: default;
      opacity: 0.5;
    }
  }
  svg {
    position: absolute;
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 20px;
    color: ${({ theme }) => theme.colors.textSoft};
    pointer-events: none;
  }
`;

export const Range = styled.span`
  min-width: 94px;
  white-space: nowrap;
  text-align: center;
  font-variant-numeric: tabular-nums;
`;

export const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const PageButton = styled.button`
  display: grid;
  place-items: center;
  width: 36px;
  height: 40px;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: ${({ theme }) => theme.colors.textSoft};
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s;
  svg {
    font-size: 23px;
  }
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.accentSoft};
    color: ${({ theme }) => theme.colors.primary};
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
  &:disabled {
    opacity: 0.35;
    cursor: default;
  }
`;
