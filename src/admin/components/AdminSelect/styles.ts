import styled, { css } from "styled-components";

interface SelectProps {
  $hasError?: boolean;
}

export const Select = styled.select<SelectProps>`
  width: 100%;

  height: 46px;

  padding: 0 1rem;

  border-radius: 0.6rem;

  border: 1px solid ${({ theme }) => theme.colors.border};

  background: ${({ theme }) => theme.colors.surface};

  color: ${({ theme }) => theme.colors.text};

  font-size: 0.95rem;

  font-family: inherit;

  outline: none;

  transition: all 0.2s ease;

  cursor: pointer;

  appearance: none;

  background-image:
    linear-gradient(
      45deg,
      transparent 50%,
      ${({ theme }) => theme.colors.text} 50%
    ),
    linear-gradient(
      135deg,
      ${({ theme }) => theme.colors.text} 50%,
      transparent 50%
    );

  background-position:
    calc(100% - 18px) calc(50% - 3px),
    calc(100% - 12px) calc(50% - 3px);

  background-size: 6px 6px;

  background-repeat: no-repeat;

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

export const Option = styled.option``;
