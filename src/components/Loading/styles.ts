import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  min-height: 300px;

  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Spinner = styled.div`
  width: 40px;
  height: 40px;

  border: 3px solid rgba(255, 255, 255, 0.15);
  border-top: 3px solid ${({ theme }) => theme.colors.accent};

  border-radius: 50%;

  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
