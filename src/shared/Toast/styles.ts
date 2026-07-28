import styled, { css, keyframes } from "styled-components";

import type { TToastType } from "./types";

interface ContainerProps {
  $type: TToastType;
}

const slideIn = keyframes`
  from{
    opacity:0;
    transform:translateX(120%);
  }

  to{
    opacity:1;
    transform:translateX(0);
  }
`;

const toastStyles = {
  info: css`
    background: ${({ theme }) => theme.colors.feedback.info.light};

    border-color: ${({ theme }) => theme.colors.feedback.info.border};

    color: ${({ theme }) => theme.colors.feedback.info.main};
  `,

  success: css`
    background: ${({ theme }) => theme.colors.feedback.success.light};

    border-color: ${({ theme }) => theme.colors.feedback.success.border};

    color: ${({ theme }) => theme.colors.feedback.success.main};
  `,

  warning: css`
    background: ${({ theme }) => theme.colors.feedback.warning.light};

    border-color: ${({ theme }) => theme.colors.feedback.warning.border};

    color: ${({ theme }) => theme.colors.feedback.warning.main};
  `,

  danger: css`
    background: ${({ theme }) => theme.colors.feedback.danger.light};

    border-color: ${({ theme }) => theme.colors.feedback.danger.border};

    color: ${({ theme }) => theme.colors.feedback.danger.main};
  `,
};

export const ContainerProvider = styled.div`
  position: fixed;

  top: 1.5rem;

  right: 1.5rem;

  z-index: 99999;

  display: flex;

  flex-direction: column;

  gap: 1rem;

  pointer-events: none;

  & > * {
    pointer-events: all;
  }
`;

export const Container = styled.div<ContainerProps>`
  width: 360px;

  min-height: 78px;

  display: flex;

  align-items: flex-start;

  gap: 1rem;

  padding: 1rem;

  border-radius: 14px;

  border: 1px solid;

  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);

  animation: ${slideIn} 0.25s ease;

  ${({ $type }) => toastStyles[$type]}
`;

export const IconContainer = styled.div<ContainerProps>`
  width: 42px;

  height: 42px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  background: ${({ theme, $type }) => theme.colors.feedback[$type].main};

  color: white;

  font-size: 1.4rem;
`;

export const Content = styled.div`
  flex: 1;

  display: flex;

  flex-direction: column;

  gap: 0.35rem;
`;

export const Title = styled.span`
  font-size: 0.95rem;

  font-weight: 700;

  color: ${({ theme }) => theme.colors.text};
`;

export const Description = styled.span`
  font-size: 0.85rem;

  line-height: 1.5;

  color: ${({ theme }) => theme.colors.text};
`;

export const CloseButton = styled.button`
  width: 30px;

  height: 30px;

  display: flex;

  align-items: center;

  justify-content: center;

  flex-shrink: 0;

  border: none;

  background: transparent;

  color: ${({ theme }) => theme.colors.text};

  border-radius: 50%;

  cursor: pointer;

  transition: 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.05);

    color: ${({ theme }) => theme.colors.text};
  }
`;
