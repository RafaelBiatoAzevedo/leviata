import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  min-width: 0;

  max-width: 420px;

  min-height: 46px;

  display: flex;

  align-items: center;

  gap: 0.75rem;

  padding: 0 1rem;

  border-radius: 0.6rem;

  border: 1px solid
    var(--theme-field-border, ${({ theme }) => theme.colors.border});

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
  width: 100%;
  min-width: 0;

  border: none;

  outline: none;

  background: transparent;

  color: ${({ theme }) => theme.colors.text};

  font-size: 14px;

  @media (max-width: 768px) {
    font-size: 16px;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text};
  }
`;
