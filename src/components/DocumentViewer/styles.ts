import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  min-width: 0;
  container: pdf-reader / inline-size;
`;

export const Viewer = styled.div`
  width: 100%;
  min-width: 0;
  height: min(820px, 82dvh);
  min-height: 360px;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.primary}60;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.backgroundCard};
  box-shadow: 0 12px 32px rgb(0 0 0 / 8%);

  &:fullscreen {
    height: 100dvh;
    min-height: 0;
    border: 0;
    border-radius: 0;
  }
`;

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.primary}35;
  background: ${({ theme }) => theme.colors.surface};
  @container pdf-reader (max-width: 480px) {
    padding: 10px 12px;
    gap: 8px;
  }
`;

export const ReaderTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.heading};
  svg {
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.primary};
    font-size: 18px;
  }
  @container pdf-reader (max-width: 480px) {
    span {
      display: none;
    }
  }
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`;

export const ActionButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-width: 44px;
  min-height: 44px;
  padding: 8px 11px;
  border: 1px solid ${({ theme }) => theme.colors.primary}40;
  border-radius: 8px;
  background: transparent;
  color: ${({ theme }) => theme.colors.heading};
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease;
  svg {
    flex-shrink: 0;
    font-size: 17px;
    color: ${({ theme }) => theme.colors.primary};
  }
  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.accentSoft};
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
  @container pdf-reader (max-width: 640px) {
    span {
      display: none;
    }
    padding-inline: 10px;
  }
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const Stage = styled.div`
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  display: grid;
  place-items: center;
  overflow: hidden;
  padding: clamp(10px, 2vw, 20px);

  .react-pdf__Document {
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .react-pdf__Page {
    max-width: 100%;
    max-height: 100%;
    overflow: hidden;
    border-radius: 3px;
    box-shadow: 0 4px 20px rgb(0 0 0 / 20%);
  }
  canvas {
    display: block;
    max-width: 100%;
  }
  .react-pdf__Page .react-pdf__message {
    color: #111827;
  }
`;

export const Pagination = styled.nav`
  display: grid;
  grid-template-columns: minmax(44px, 1fr) auto minmax(44px, 1fr);
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.primary}35;
  background: ${({ theme }) => theme.colors.surface};
  > :first-child {
    justify-self: start;
  }
  > :last-child {
    justify-self: end;
  }
  @container pdf-reader (max-width: 480px) {
    padding: 10px 12px;
    gap: 8px;
  }
`;

export const PageButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 44px;
  min-height: 44px;
  padding: 10px 16px;
  border: 1px solid ${({ theme }) => theme.colors.primary}65;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.accentSoft};
  color: ${({ theme }) => theme.colors.heading};
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease;
  svg {
    flex-shrink: 0;
    font-size: 18px;
  }
  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.accentGlow};
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  @container pdf-reader (max-width: 480px) {
    span {
      display: none;
    }
    padding: 10px;
  }
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const PageInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  min-width: 0;
  color: ${({ theme }) => theme.colors.heading};
  small {
    color: ${({ theme }) => theme.colors.textSoft};
    font-size: 10px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  strong {
    font-size: 14px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
  strong span {
    color: ${({ theme }) => theme.colors.textSoft};
    font-weight: 400;
  }
`;

export const ViewerMessage = styled.p`
  max-width: 100%;
  margin: 0;
  padding: 20px;
  color: ${({ theme }) => theme.colors.onSecondary};
  line-height: 1.8;
  text-align: center;
  overflow-wrap: anywhere;
  a {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const Feedback = styled.p`
  margin: 12px 0 0;
  color: ${({ theme }) => theme.colors.textSoft};
  font-size: 13px;
  line-height: 1.7;
  a {
    color: ${({ theme }) => theme.colors.heading};
    text-underline-offset: 3px;
  }
`;
