import styled, { keyframes } from "styled-components";

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

interface SpinnerStyledProps {
  $size: number;
}

export const Spinner = styled.span<SpinnerStyledProps>`
  width: ${({ $size }) => `${$size}px`};
  height: ${({ $size }) => `${$size}px`};
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
  animation: ${spin} 0.7s linear infinite;
`;
