import styled from "styled-components";

interface InputProps {
  $hasError?: boolean;
}

export const Input = styled.input<InputProps>`
  width: 100%;

  height: 46px;

  padding: 10px 12px;

  border: 1px solid
    ${({ theme, $hasError }) => ($hasError ? "#ef4444" : theme.colors.border)};

  border-radius: 8px;

  background: ${({ theme }) => theme.colors.surface};

  color: ${({ theme }) => theme.colors.text};

  font-size: 0.95rem;

  outline: none;

  transition: 0.2s ease;

  &:focus {
    border-color: ${({ theme, $hasError }) =>
      $hasError ? "#ef4444" : theme.colors.primary};

    box-shadow: 0 0 0 3px
      ${({ theme, $hasError }) =>
        $hasError ? `#ef444420` : `${theme.colors.primary}20`};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSoft};
  }
`;
