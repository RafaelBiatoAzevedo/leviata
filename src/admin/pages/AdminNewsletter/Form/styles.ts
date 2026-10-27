import styled from "styled-components";

export const PdfNotice = styled.div`
  grid-column: 1 / -1;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 14px 16px;
  border: 1px solid ${({ theme }) => theme.colors.primary}50;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.accentSoft};
  color: ${({ theme }) => theme.colors.textSoft};
  font-size: 12px;
  line-height: 1.7;
  svg {
    flex-shrink: 0;
    margin-top: 3px;
    color: ${({ theme }) => theme.colors.heading};
  }
`;

export const Container = styled.div`
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const Form = styled.form`
  min-width: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const Advanced = styled.details`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 16px 20px;
  summary {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.textSoft};
    font-size: 13px;
    min-height: 32px;
  }
  p {
    color: ${({ theme }) => theme.colors.textSoft};
    font-size: 12px;
    line-height: 1.7;
    margin: 12px 0;
  }
`;

export const ModeNotice = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  padding: 18px;
  border: 1px solid ${({ theme }) => theme.colors.primary}60;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.accentSoft};
  > div {
    flex: 1;
    min-width: 180px;
  }
  > svg {
    color: ${({ theme }) => theme.colors.heading};
  }
  strong {
    color: ${({ theme }) => theme.colors.heading};
    font-size: 13px;
  }
  p {
    margin-top: 6px;
    font-size: 12px;
    line-height: 1.7;
    color: ${({ theme }) => theme.colors.textSoft};
  }
`;
