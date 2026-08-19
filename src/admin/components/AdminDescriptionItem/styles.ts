import styled from "styled-components";

export const Container = styled.div`
  display: flex;

  flex-direction: column;

  gap: 0.45rem;

  width: 100%;
`;

export const Label = styled.span`
  font-size: 0.8rem;

  font-weight: 600;

  text-transform: uppercase;

  letter-spacing: 0.05em;

  color: ${({ theme }) => theme.colors.textSoft};
`;

export const Value = styled.div`
  min-height: 46px;

  display: flex;

  align-items: center;

  padding: 0.7rem 1rem;

  border: 1px solid ${({ theme }) => theme.colors.border};

  border-radius: 0.6rem;

  background: ${({ theme }) => theme.colors.surface};

  color: ${({ theme }) => theme.colors.text};

  font-size: 0.95rem;

  font-weight: 500;

  word-break: break-word;

  line-height: 1.5;
`;

export const EmptyValue = styled(Value)`
  color: ${({ theme }) => theme.colors.textSoft};

  font-style: italic;
`;
