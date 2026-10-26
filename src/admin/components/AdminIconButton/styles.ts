import styled, { css } from "styled-components";

export type TVariant =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning";

interface IContainerProps {
  $variant: TVariant;
}

const variants = {
  primary: css`
    background: ${({ theme }) => theme.colors.primary}15;
    color: ${({ theme }) => theme.colors.primary};

    &:hover {
      background: ${({ theme }) => theme.colors.primary};
      color: var(--theme-on-primary, #fff);
    }
  `,

  secondary: css`
    background: rgba(120, 120, 120, 0.12);
    color: var(--theme-muted, #666);

    &:hover {
      background: #666;
      color: #fff;
    }
  `,

  success: css`
    background: rgba(34, 197, 94, 0.12);
    color: var(--theme-success-text, #16a34a);

    &:hover {
      background: #16a34a;
      color: #fff;
    }
  `,

  warning: css`
    background: rgba(245, 158, 11, 0.12);
    color: var(--theme-warning-text, #d97706);

    &:hover {
      background: #d97706;
      color: #fff;
    }
  `,

  danger: css`
    background: rgba(239, 68, 68, 0.12);
    color: var(--theme-danger-text, #dc2626);

    &:hover {
      background: #dc2626;
      color: #fff;
    }
  `,
};

export const Container = styled.button<IContainerProps>`
  width: 38px;
  flex-shrink: 0;

  height: 38px;

  border: none;

  border-radius: 0.6rem;

  cursor: pointer;

  display: flex;

  align-items: center;

  justify-content: center;

  transition: 0.2s ease;

  svg {
    font-size: 1.05rem;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 3px;
  }

  @media (max-width: 900px), (pointer: coarse) {
    width: 44px;
    height: 44px;
  }

  &:disabled {
    opacity: 0.5;

    cursor: not-allowed;
  }

  ${({ $variant }) => variants[$variant]}
`;
