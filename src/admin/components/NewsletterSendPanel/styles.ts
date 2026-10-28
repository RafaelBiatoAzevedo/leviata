import styled from "styled-components";

export const Panel = styled.section`
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: clamp(16px, 2.5vw, 28px);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.background};
  scroll-margin-top: 100px;

  > header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
  }
  h2 {
    margin: 0 0 8px;
    font-size: 1.4rem;
    color: ${({ theme }) => theme.colors.heading};
  }
  p {
    margin: 0;
    line-height: 1.7;
    color: ${({ theme }) => theme.colors.textSoft};
    overflow-wrap: anywhere;
  }
`;

export const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  > button {
    min-height: 44px;
  }
  @media (max-width: 540px) {
    > button {
      flex: 1 1 180px;
    }
  }
`;

export const Notice = styled.p<{ $error?: boolean }>`
  padding: 14px 16px;
  border-radius: 8px;
  border: 1px solid
    ${({ theme, $error }) =>
      $error ? "var(--theme-danger-border, #e8b5ac)" : theme.colors.border};
  background: ${({ theme, $error }) =>
    $error ? "var(--theme-danger-bg, #fff5f2)" : theme.colors.surface};
  color: ${({ theme, $error }) =>
    $error
      ? "var(--theme-danger-text, #9d3529)"
      : theme.colors.text} !important;
  line-height: 1.7;
`;

export const Summary = styled.dl`
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 140px), 1fr));
  gap: 12px;
  > div {
    padding: 16px;
    min-width: 0;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 8px;
    background: ${({ theme }) => theme.colors.surface};
  }
  dt {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.textSoft};
  }
  dd {
    margin: 8px 0 0;
    font-size: 24px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.heading};
  }
`;

export const History = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
  h3 {
    margin: 0;
    color: ${({ theme }) => theme.colors.heading};
  }
`;

export const HistoryChoice = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  button {
    min-height: 44px;
    padding: 8px 14px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 8px;
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text};
    font: inherit;
    cursor: pointer;
    &[aria-pressed="true"] {
      border-color: ${({ theme }) => theme.colors.primary};
      background: ${({ theme }) => theme.colors.accentSoft};
    }
    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.colors.primary};
      outline-offset: 2px;
    }
  }
`;

export const ConfirmationRecipients = styled.ul`
  max-height: 240px;
  overflow: auto;
  padding: 0 0 0 20px;
  margin: 16px 0;
  li {
    margin-bottom: 10px;
    overflow-wrap: anywhere;
    line-height: 1.6;
  }
`;
