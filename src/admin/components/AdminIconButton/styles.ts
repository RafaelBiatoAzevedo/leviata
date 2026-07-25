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
      color: #fff;
    }
  `,

  secondary: css`
    background: rgba(120, 120, 120, 0.12);
    color: #666;

    &:hover {
      background: #666;
      color: #fff;
    }
  `,

  success: css`
    background: rgba(34, 197, 94, 0.12);
    color: #16a34a;

    &:hover {
      background: #16a34a;
      color: #fff;
    }
  `,

  warning: css`
    background: rgba(245, 158, 11, 0.12);
    color: #d97706;

    &:hover {
      background: #d97706;
      color: #fff;
    }
  `,

  danger: css`
    background: rgba(239, 68, 68, 0.12);
    color: #dc2626;

    &:hover {
      background: #dc2626;
      color: #fff;
    }
  `,
};

export const Container = styled.button<IContainerProps>`
  width: 38px;

  height: 38px;

  border: none;

  border-radius: 10px;

  cursor: pointer;

  display: flex;

  align-items: center;

  justify-content: center;

  transition: 0.2s ease;

  svg {
    font-size: 1.05rem;
  }

  &:disabled {
    opacity: 0.5;

    cursor: not-allowed;
  }

  ${({ $variant }) => variants[$variant]}
`;
