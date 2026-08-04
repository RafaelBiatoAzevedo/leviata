import styled, { css } from "styled-components";

export type TAdminButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "danger"
  | "success";

interface IButtonProps {
  $variant: TAdminButtonVariant;
}

const variants = {
  primary: css`
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text};
    border: 1px solid ${({ theme }) => theme.colors.primary};

    &:hover {
      background: ${({ theme }) => theme.colors.accentHover};
    }
  `,

  outline: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.text};
    border: 1px solid ${({ theme }) => theme.colors.border};

    &:hover {
      background: ${({ theme }) => theme.colors.surface};
    }
  `,

  danger: css`
    background: ${({ theme }) => theme.colors.feedback.danger.main};
    color: #fff;
    border: 1px solid ${({ theme }) => theme.colors.feedback.danger.main};
  `,

  success: css`
    background: ${({ theme }) => theme.colors.feedback.success.main};
    color: #fff;
    border: 1px solid ${({ theme }) => theme.colors.feedback.success.main};
  `,

  secondary: css`
    background: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.onSecondary};
    border: 1px solid ${({ theme }) => theme.colors.secondary};
  `,
};

export const Container = styled.button<IButtonProps>`
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

  span {
    white-space: nowrap;
  }

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

  ${({ $variant }) => variants[$variant]}
`;
