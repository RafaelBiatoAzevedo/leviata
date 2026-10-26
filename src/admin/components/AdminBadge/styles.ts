import styled, { css } from "styled-components";

interface IContainerProps {
  $variant: "primary" | "success" | "warning" | "danger" | "info" | "secondary";
}

const variants = {
  primary: css`
    background: rgba(89, 37, 178, 0.12);
    color: ${({ theme }) => theme.colors.primary};
  `,

  success: css`
    background: rgba(34, 197, 94, 0.12);
    color: var(--theme-success-text, #16a34a);
  `,

  warning: css`
    background: rgba(245, 158, 11, 0.12);
    color: var(--theme-warning-text, #d97706);
  `,

  danger: css`
    background: rgba(239, 68, 68, 0.12);
    color: var(--theme-danger-text, #dc2626);
  `,

  info: css`
    background: rgba(59, 130, 246, 0.12);
    color: var(--theme-info-text, #2563eb);
  `,

  secondary: css`
    background: rgba(107, 114, 128, 0.12);
    color: var(--theme-muted, #4b5563);
  `,
};

export const Container = styled.span<IContainerProps>`
  display: inline-flex;

  align-items: center;

  justify-content: center;

  min-height: 28px;
  white-space: nowrap;

  padding: 0.25rem 0.75rem;

  border-radius: 999px;

  font-size: 0.75rem;

  font-weight: 600;

  text-transform: uppercase;

  letter-spacing: 0.04em;

  ${({ $variant }) => variants[$variant]}
`;
