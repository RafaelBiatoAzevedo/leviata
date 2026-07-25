import styled from "styled-components";

export const Container = styled.div`
  width: 100%;

  display: flex;

  flex-direction: column;

  gap: 0.45rem;
`;

export const Label = styled.label`
  display: flex;

  align-items: center;

  gap: 0.3rem;

  font-size: 0.9rem;

  font-weight: 600;

  color: ${({ theme }) => theme.colors.text};
`;

export const Required = styled.span`
  color: #ef4444;

  font-size: 0.9rem;
`;

export const Description = styled.span`
  font-size: 0.82rem;

  color: ${({ theme }) => theme.colors.text};

  line-height: 1.4;
`;

export const Error = styled.span`
  font-size: 0.8rem;

  color: #ef4444;

  font-weight: 500;
`;
