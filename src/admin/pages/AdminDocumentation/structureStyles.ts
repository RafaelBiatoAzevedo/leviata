import styled from "styled-components";

export const Dialog = styled.dialog`
  position: fixed;
  inset: 0;
  width: min(1600px, calc(100vw - 32px));
  height: min(1100px, calc(100dvh - 32px));
  max-width: none;
  max-height: none;
  padding: 0;
  margin: auto;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.heading};
  overflow: hidden;
  box-shadow: 0 24px 90px #00000055;
  &:not([open]) {
    display: none;
  }
  &[open] {
    display: flex;
    flex-direction: column;
  }
  &::backdrop {
    background: #0b1220c9;
    backdrop-filter: blur(5px);
  }
  @media (max-width: 600px) {
    width: calc(100vw - 16px);
    height: calc(100dvh - 16px);
    border-radius: 10px;
  }
`;

export const DialogHeader = styled.header`
  flex-shrink: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
  gap: 12px 20px;
  padding: 18px 22px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border}55;
  h2 {
    margin: 0;
    font-family: ${({ theme }) => theme.fonts.title};
    font-size: clamp(24px, 3vw, 32px);
    line-height: 1.15;
    letter-spacing: 0;
  }
  p {
    margin: 6px 0 0;
    font-size: 12px;
    line-height: 1.6;
  }
  @media (max-width: 600px) {
    padding: 15px;
    gap: 12px;
  }
`;

export const DialogActions = styled.div`
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  @media (max-width: 600px) {
    > a,
    > button {
      flex: 1 1 auto;
      font-size: 11px;
      padding: 9px;
    }
  }
`;

export const Close = styled.button`
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  border: 1px solid ${({ theme }) => theme.colors.border}70;
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.heading};
  background: ${({ theme }) => theme.colors.surface};
  cursor: pointer;
  svg {
    width: 21px;
    height: 21px;
  }
  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

export const ImageViewport = styled.div<{ $expanded: boolean }>`
  position: relative;
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow: auto;
  overscroll-behavior: contain;
  background: #0d1420;
  img {
    display: block;
    width: ${({ $expanded }) => ($expanded ? "max(1600px, 100%)" : "100%")};
    height: ${({ $expanded }) => ($expanded ? "auto" : "100%")};
    max-width: none;
    object-fit: contain;
  }
  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.primary};
    outline-offset: -3px;
  }
`;

export const Feedback = styled.p`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 24px;
  margin: 0;
  color: #f3eee4;
  text-align: center;
  font-size: 14px;
  line-height: 1.8;
`;

export const Description = styled.details`
  flex-shrink: 0;
  max-height: 150px;
  overflow: auto;
  padding: 12px 22px;
  font-size: 12px;
  line-height: 1.8;
  border-top: 1px solid ${({ theme }) => theme.colors.border}55;
  summary {
    cursor: pointer;
    font-weight: 600;
  }
  summary:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 3px;
  }
  p {
    margin: 8px 0 0;
  }
  @media (max-width: 600px) {
    padding: 12px 15px;
  }
`;
