import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 100%;
  min-width: 0;
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  @media (max-width: 540px) {
    width: 100%;
    > a,
    > button {
      flex: 1 1 auto;
    }
  }
`;

export const ResourceLink = styled.a<{ $primary?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  padding: 10px 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background: ${({ theme, $primary }) =>
    $primary ? theme.colors.primary : theme.colors.surface};
  color: ${({ theme, $primary }) =>
    $primary ? theme.colors.onPrimary : theme.colors.heading};
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  svg {
    flex-shrink: 0;
    font-size: 16px;
  }
  &:hover {
    background: ${({ theme, $primary }) =>
      $primary ? theme.colors.accentHover : theme.colors.accentSoft};
  }
  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 3px;
  }
`;

export const ReaderStatus = styled.p`
  display: flex;
  align-items: flex-start;
  gap: 9px;
  margin: 0;
  color: ${({ theme }) => theme.colors.heading};
  font-size: 12px;
  line-height: 1.7;
  svg {
    flex-shrink: 0;
    margin-top: 2px;
    font-size: 16px;
  }
`;

export const Reader = styled.section`
  min-width: 0;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border}60;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.surface};
`;

export const DocumentFrame = styled.iframe`
  display: block;
  width: 100%;
  height: max(680px, calc(100dvh - 270px));
  border: 0;
  background: #f7f4ed;
  @media (max-width: 768px) {
    height: max(650px, calc(100dvh - 240px));
  }
`;
