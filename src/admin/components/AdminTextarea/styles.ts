import styled, { css } from "styled-components";

interface TextareaProps {
  $hasError?: boolean;
}

export const Textarea = styled.textarea<TextareaProps>`
  width: 100%;

  min-height: 140px;

  padding: 0.9rem 1rem;

  border-radius: 12px;

  border: 1px solid ${({ theme }) => theme.colors.border};

  background: ${({ theme }) => theme.colors.surface};

  color: ${({ theme }) => theme.colors.text};

  font-size: 0.95rem;

  font-family: inherit;

  resize: vertical;

  outline: none;

  transition: all 0.2s ease;

  &::placeholder {
    color: ${({ theme }) => theme.colors.text};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};

    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}20`};
  }

  &:disabled {
    opacity: 0.7;

    cursor: not-allowed;

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
