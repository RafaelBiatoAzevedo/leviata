import styled from "styled-components";

export const Container = styled.div`
  min-height: 300px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 1rem;

  color: ${({ theme }) => theme.colors.textSoft};
`;

export const Spinner = styled.div`
  width: 36px;
  height: 36px;

  border: 3px solid ${({ theme }) => theme.colors.border};
  border-top: 3px solid ${({ theme }) => theme.colors.primary};

  border-radius: 50%;

  animation-name: spinnerRotation;
  animation-duration: 0.8s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;

  @keyframes spinnerRotation {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
`;

export const Text = styled.span`
  font-size: 1.4rem;
`;
