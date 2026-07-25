import styled from "styled-components";

export const Container = styled.button`
  height: 46px;

  padding: 0 1.25rem;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 0.75rem;

  border: none;

  border-radius: 0.75rem;

  cursor: pointer;

  background: ${({ theme }) => theme.colors.primary};

  color: ${({ theme }) => theme.colors.text};

  font-size: 0.95rem;

  font-weight: 600;

  transition: 0.2s ease;

  svg {
    font-size: 1.15rem;

    flex-shrink: 0;
  }

  &:hover {
    filter: brightness(1.08);

    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;

    cursor: not-allowed;

    transform: none;
  }
`;
