import styled, { css, keyframes } from "styled-components";

const fade = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const scale = keyframes`
  from {
    opacity: 0;

    transform: translateY(-20px) scale(.96);
  }

  to {
    opacity: 1;

    transform: translateY(0) scale(1);
  }
`;

export const Backdrop = styled.div`
  position: fixed;

  inset: 0;

  z-index: 9999;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 2rem;

  background: rgba(0, 0, 0, 0.45);

  backdrop-filter: blur(4px);

  animation: ${fade} 0.2s ease;
`;

export const Container = styled.div`
  width: 100%;

  max-width: 640px;

  background: ${({ theme }) => theme.colors.background};

  border-radius: 12px;

  border: 1px solid ${({ theme }) => theme.colors.border};

  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.25);

  animation: ${scale} 0.25s ease;
`;

export const Header = styled.header`
  display: flex;

  align-items: center;

  justify-content: space-between;

  padding: 1.25rem 1.5rem;

  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const Title = styled.h2`
  margin: 0;

  font-size: 1.6rem;

  font-weight: 600;

  color: ${({ theme }) => theme.colors.text};
`;

export const CloseButton = styled.button`
  width: 36px;

  height: 36px;

  display: flex;

  align-items: center;

  justify-content: center;

  border: none;

  border-radius: 8px;

  background: transparent;

  cursor: pointer;

  color: ${({ theme }) => theme.colors.textSoft};

  transition: 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.surface};

    color: ${({ theme }) => theme.colors.text};
  }

  svg {
    font-size: 1.2rem;
  }
`;

export const Content = styled.div`
  padding: 1.5rem;

  color: ${({ theme }) => theme.colors.text};

  max-height: 70vh;

  overflow-y: auto;
`;

export const Footer = styled.footer`
  display: flex;

  justify-content: flex-end;

  gap: 1rem;

  padding: 1.25rem 1.5rem;

  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;

  border-radius: 8px;

  border: 1px solid ${({ theme }) => theme.colors.border};

  background: transparent;

  color: ${({ theme }) => theme.colors.text};

  cursor: pointer;

  transition: 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
  }
`;

interface ConfirmButtonProps {
  variant: "primary" | "success" | "danger";
}

const variants = {
  primary: css`
    background: ${({ theme }) => theme.colors.primary};

    color: white;
  `,

  success: css`
    background: ${({ theme }) => theme.colors.feedback.success.main};

    color: white;
  `,

  danger: css`
    background: ${({ theme }) => theme.colors.feedback.danger.main};

    color: white;
  `,
};

export const ConfirmButton = styled.button<ConfirmButtonProps>`
  padding: 0.75rem 1.5rem;

  border: none;

  border-radius: 8px;

  cursor: pointer;

  transition: 0.2s;

  ${({ variant }) => variants[variant]}

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.textSoft};

    color: ${({ theme }) => theme.colors.text};

    cursor: not-allowed;

    opacity: 0.7;
  }
`;
