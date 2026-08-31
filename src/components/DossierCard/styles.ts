import { Link } from "react-router-dom";
import styled from "styled-components";

export const Container = styled(Link)`
  width: 300px;

  min-height: 180px;

  display: flex;
  flex-direction: column;
  text-decoration: none;

  gap: 22px;

  padding: 28px;

  border-radius: 20px;

  overflow: hidden;

  position: relative;

  background: ${({ theme }) => theme.colors.surface};

  border: 1px solid ${({ theme }) => theme.colors.border};

  transition:
    transform 0.35s ease,
    border-color 0.35s ease,
    box-shadow 0.35s ease;

  &:hover {
    transform: translateY(-8px);

    border-color: ${({ theme }) => theme.colors.accent};

    box-shadow:
      0 20px 40px rgba(0, 0, 0, 0.4),
      0 0 24px ${({ theme }) => theme.colors.accentGlow};
  }

  &:hover svg {
    transform: scale(1.08);
  }

  &::before {
    content: "";

    position: absolute;
    inset: 0;

    background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.03));

    opacity: 0;

    transition: opacity 0.35s ease;

    pointer-events: none;
  }

  &:hover::before {
    opacity: 1;
  }
`;

export const IconWrapper = styled.div`
  width: 58px;
  height: 58px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 0.6rem;

  font-size: 1.6rem;

  color: ${({ theme }) => theme.colors.text};

  background: ${({ theme }) => theme.colors.primary};

  border: 1px solid rgba(255, 255, 255, 0.06);

  box-shadow: 0 0 20px ${({ theme }) => theme.colors.accentGlow};
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;

  gap: 12px;
`;

export const Title = styled.h3`
  color: ${({ theme }) => theme.colors.text};

  font-size: 1.15rem;

  line-height: 1.6;

  font-family: ${({ theme }) => theme.fonts.title};
`;

export const Period = styled.span`
  width: fit-content;

  padding: 8px 14px;

  border-radius: 999px;

  background: rgba(255, 255, 255, 0.04);

  color: ${({ theme }) => theme.colors.textSoft};

  font-size: 0.9rem;
  font-weight: 800;

  letter-spacing: 1px;
`;
