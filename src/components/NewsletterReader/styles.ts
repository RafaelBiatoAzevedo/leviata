import styled from "styled-components";

export const Dialog = styled.dialog`
  width: min(940px, calc(100vw - 32px));
  height: min(860px, calc(100dvh - 48px));
  max-width: 100%;
  max-height: 100%;
  margin: auto;
  padding: 0;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.primary}70;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: 0 24px 90px rgba(17, 24, 39, 0.25);

  &[open] {
    display: flex;
    flex-direction: column;
  }

  &::backdrop {
    background: rgba(17, 24, 39, 0.72);
    backdrop-filter: blur(4px);
  }

  @media (max-width: 480px) {
    width: calc(100vw - 16px);
    height: calc(100dvh - 24px);
    border-radius: 12px;
  }
`;

export const ReaderToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.primary}40;
`;

export const ReaderHeading = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;

  > svg {
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.primary};
    font-size: 22px;
  }

  h2 {
    color: ${({ theme }) => theme.colors.secondary};
    font-size: 24px;
    font-weight: 600;
    line-height: 1.2;
    letter-spacing: 0;
    overflow-wrap: anywhere;
  }
`;

export const CloseButton = styled.button`
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border: 1px solid ${({ theme }) => theme.colors.primary}50;
  border-radius: 10px;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 22px;

  &:hover,
  &:focus-visible {
    background: ${({ theme }) => theme.colors.accentSoft};
  }
`;

export const Frame = styled.iframe`
  display: block;
  flex: 1;
  width: 100%;
  min-height: 0;
  border: 0;
  background: white;
`;
