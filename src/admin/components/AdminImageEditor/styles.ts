import styled, { css, keyframes } from "styled-components";

const spin = keyframes`to { transform: rotate(360deg); }`;
const focus = css`
  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 3px;
  }
  &:disabled {
    cursor: default;
    opacity: 0.45;
  }
`;

export const Dialog = styled.dialog`
  position: fixed;
  inset: 0;
  margin: auto;
  width: min(1040px, calc(100vw - 32px));
  max-width: none;
  max-height: calc(100vh - 32px);
  max-height: calc(100dvh - 32px);
  padding: 0;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  box-shadow: 0 28px 100px rgb(0 0 0 / 30%);
  overflow: hidden;
  overscroll-behavior: contain;
  &[open] {
    display: flex;
    flex-direction: column;
  }
  &::backdrop {
    background: rgb(15 23 42 / 65%);
    backdrop-filter: blur(6px);
  }
  [data-spinning] {
    animation: ${spin} 1s linear infinite;
  }
  @media (prefers-reduced-motion: reduce) {
    [data-spinning] {
      animation: none;
    }
  }
  @media (max-width: 540px) {
    width: calc(100vw - 20px);
    max-height: calc(100dvh - 20px);
    border-radius: 16px;
  }
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px 24px;
  flex-shrink: 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.accentGlow};
  @media (max-width: 540px) {
    padding: 14px 16px;
    gap: 10px;
  }
`;
export const HeadingIcon = styled.div`
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  flex-shrink: 0;
  border-radius: 13px;
  background: ${({ theme }) => theme.colors.accentSoft};
  color: ${({ theme }) => theme.colors.primary};
  svg {
    width: 23px;
    height: 23px;
  }
  @media (max-width: 540px) {
    width: 40px;
    height: 40px;
  }
`;
export const Heading = styled.div`
  flex: 1;
  min-width: 0;
  span {
    display: block;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1.4px;
    color: ${({ theme }) => theme.colors.textSoft};
  }
  h2 {
    margin: 4px 0 0;
    font-size: 26px;
    line-height: 1.15;
    overflow-wrap: anywhere;
  }
  @media (max-width: 540px) {
    h2 {
      font-size: 23px;
    }
  }
`;
export const CloseButton = styled.button`
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 10px;
  color: ${({ theme }) => theme.colors.heading};
  svg {
    width: 21px;
    height: 21px;
  }
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.accentSoft};
  }
  ${focus}
`;
export const Workspace = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 220px;
  gap: 24px;
  min-height: 0;
  padding: 24px;
  overflow-y: auto;
  background: ${({ theme }) => theme.colors.background};
  > * {
    min-width: 0;
  }
  @media (max-width: 760px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 20px;
    padding: 16px;
  }
`;
export const Stage = styled.div`
  position: relative;
  height: clamp(260px, 48dvh, 470px);
  border-radius: 14px;
  overflow: hidden;
  isolation: isolate;
  background-color: #17202d;
  background-image:
    linear-gradient(45deg, #202a37 25%, transparent 25%),
    linear-gradient(-45deg, #202a37 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #202a37 75%),
    linear-gradient(-45deg, transparent 75%, #202a37 75%);
  background-size: 24px 24px;
  background-position:
    0 0,
    0 12px,
    12px -12px,
    -12px 0;
  .reactEasyCrop_Container {
    cursor: grab;
  }
  .reactEasyCrop_Container:active {
    cursor: grabbing;
  }
  .reactEasyCrop_Container:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.primary};
    outline-offset: -4px;
  }
  @media (max-width: 760px) {
    height: clamp(220px, 40dvh, 360px);
  }
`;
export const StageMessage = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 20px;
  color: #e5e7eb;
  font-size: 13px;
  svg {
    width: 28px;
    height: 28px;
    color: ${({ theme }) => theme.colors.primary};
  }
`;
export const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 22px;
  min-width: 0;
  @media (max-width: 760px) {
    gap: 16px;
  }
`;
export const PreviewPanel = styled.div`
  > span {
    display: block;
    margin-bottom: 10px;
    font-size: 12px;
    font-weight: 600;
  }
  > div {
    min-height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    padding: 12px;
    border: 1px solid ${({ theme }) => theme.colors.accentGlow};
    background: ${({ theme }) => theme.colors.surface};
  }
  @media (max-width: 760px) {
    display: none;
  }
`;
export const PreviewCanvas = styled.canvas`
  display: block;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 140px;
  border-radius: 4px;
`;
export const Ratio = styled.p`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin: 10px 0 0;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSoft};
  strong {
    font-size: 10px;
    border: 1px solid ${({ theme }) => theme.colors.accentGlow};
    border-radius: 5px;
    padding: 3px 5px;
    color: ${({ theme }) => theme.colors.heading};
  }
`;
export const ControlGroup = styled.div`
  min-width: 0;
`;
export const ControlHeading = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 10px;
  font-size: 12px;
  font-weight: 600;
  output {
    color: ${({ theme }) => theme.colors.primary};
    font-variant-numeric: tabular-nums;
  }
`;
export const ZoomControls = styled.div`
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) 44px;
  align-items: center;
  gap: 10px;
  input {
    min-width: 0;
    width: 100%;
    height: 32px;
    accent-color: ${({ theme }) => theme.colors.primary};
    cursor: pointer;
    ${focus}
  }
`;
export const ToolButton = styled.button`
  display: grid;
  place-items: center;
  min-width: 44px;
  height: 44px;
  border: 1px solid ${({ theme }) => theme.colors.accentGlow};
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.heading};
  svg {
    width: 18px;
    height: 18px;
  }
  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.accentSoft};
  }
  ${focus}
`;
export const Tools = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
`;
export const ResetButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  width: 100%;
  border-radius: 8px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSoft};
  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.colors.heading};
    background: ${({ theme }) => theme.colors.surface};
  }
  ${focus}
`;
export const Hint = styled.p`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin: 12px 0 0;
  font-size: 12px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textSoft};
  svg {
    margin-top: 2px;
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.primary};
  }
`;
export const ErrorMessage = styled.p`
  flex-shrink: 0;
  margin: 0;
  padding: 12px 24px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.feedback.danger.main};
  background: ${({ theme }) => theme.colors.feedback.danger.light};
`;
export const Footer = styled.footer`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  padding: 16px 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.accentGlow};
  @media (max-width: 540px) {
    padding: 14px 16px;
    gap: 10px;
  }
`;
export const FooterNote = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSoft};
  @media (max-width: 540px) {
    width: 100%;
  }
`;
export const FooterActions = styled.div`
  display: flex;
  gap: 10px;
  @media (max-width: 540px) {
    width: 100%;
    > button {
      flex: 1;
      padding-inline: 10px;
    }
  }
`;
export const ActionButton = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  padding: 10px 18px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme, $primary }) =>
    $primary ? theme.colors.onPrimary : theme.colors.text};
  background: ${({ theme, $primary }) =>
    $primary ? theme.colors.primary : "transparent"};
  &:hover:not(:disabled) {
    background: ${({ theme, $primary }) =>
      $primary ? theme.colors.accentHover : theme.colors.accentSoft};
  }
  ${focus}
`;
