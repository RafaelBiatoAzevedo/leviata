import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  min-width: 0;

  display: flex;

  flex-direction: column;

  gap: 0.45rem;
`;

export const Label = styled.label`
  display: flex;

  align-items: center;

  gap: 0.3rem;
  flex-wrap: wrap;

  font-size: 0.9rem;

  font-weight: 600;

  color: ${({ theme }) => theme.colors.text};
`;

export const Required = styled.span`
  color: var(--theme-danger-text, #ef4444);

  font-size: 0.9rem;
`;

export const LabelHint = styled.span`
  color: ${({ theme }) => theme.colors.textSoft};
  font-size: 0.82rem;
  font-weight: 400;
  line-height: 1.4;
`;

export const Description = styled.span`
  font-size: 0.82rem;

  color: ${({ theme }) => theme.colors.text};

  line-height: 1.4;
`;

export const Error = styled.span`
  font-size: 0.8rem;

  color: var(--theme-danger-text, #ef4444);

  font-weight: 500;
`;
