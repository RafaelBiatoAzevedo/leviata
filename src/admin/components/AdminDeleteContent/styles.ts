import styled from "styled-components";

export const Container = styled.div`
  padding: 2rem 0;
`;

export const Message = styled.p`
  margin: 0;

  color: ${({ theme }) => theme.colors.text};

  font-size: 0.95rem;

  line-height: 1.5;

  strong {
    font-weight: 600;
  }
`;

export const Warning = styled.p`
  margin: 16px 0 0;

  color: ${({ theme }) => theme.colors.feedback.danger.main};

  font-size: 0.9rem;

  font-weight: 600;

  line-height: 1.5;
`;
