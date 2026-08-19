import styled, { css } from "styled-components";

interface InputProps {
  $hasError?: boolean;
}

export const Input = styled.input<InputProps>`
  width: 100%;

  height: 46px;

  padding: 0 1rem;

  border-radius: 0.6rem;

  border: 1px solid ${({ theme }) => theme.colors.border};

  background: ${({ theme }) => theme.colors.surface};

  color: ${({ theme }) => theme.colors.text};

  font-size: 0.95rem;

  transition: all 0.2s ease;

  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSoft};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};

    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}20`};
  }

  &:disabled {
    cursor: not-allowed;

    opacity: 0.7;

    background: ${({ theme }) => theme.colors.background};
  }

  ${({ $hasError }) =>
    $hasError &&
    css`
      border-color: #ef4444;

      &:focus {
        border-color: #ef4444;

        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
      }
    `}
`;
