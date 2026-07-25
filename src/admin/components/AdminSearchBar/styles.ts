import styled from "styled-components";

export const Container = styled.div`
  width: 100%;

  max-width: 420px;

  height: 46px;

  display: flex;

  align-items: center;

  gap: 0.75rem;

  padding: 0 1rem;

  border-radius: 12px;

  border: 1px solid ${({ theme }) => theme.colors.border};

  background: ${({ theme }) => theme.colors.surface};

  transition: 0.2s;

  svg {
    font-size: 1.1rem;

    color: ${({ theme }) => theme.colors.text};

    flex-shrink: 0;
  }

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary};

    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

export const Input = styled.input`
  flex: 1;

  border: none;

  outline: none;

  background: transparent;

  color: ${({ theme }) => theme.colors.text};

  font-size: 0.95rem;

  &::placeholder {
    color: ${({ theme }) => theme.colors.text};
  }
`;
