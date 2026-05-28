import { Link } from "react-router-dom";
import styled from "styled-components";

export const Container = styled(Link)`
  display: flex;
  flex-direction: column;
  text-decoration: none;

  gap: 22px;

  padding: 36px 30px;

  border-radius: 18px;

  position: relative;

  overflow: hidden;

  background: ${({ theme }) => theme.colors.secondary};

  border: 1px solid rgba(255, 255, 255, 0.06);

  transition:
    transform 0.35s ease,
    border-color 0.35s ease,
    box-shadow 0.35s ease;

  &:hover {
    transform: translateY(-8px);

    border-color: ${({ theme }) => theme.colors.accent};

    box-shadow:
      0 20px 40px rgba(0, 0, 0, 0.45),
      0 0 25px ${({ theme }) => theme.colors.accentGlow};
  }

  &:hover::before {
    opacity: 1;
  }

  &::before {
    content: "";

    position: absolute;
    inset: 0;

    background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.04));

    opacity: 0;

    transition: opacity 0.35s ease;

    pointer-events: none;
  }
`;

export const IconWrapper = styled.div`
  width: 68px;
  height: 68px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 16px;

  font-size: 1.8rem;

  color: ${({ theme }) => theme.colors.accent};

  background: ${({ theme }) => theme.colors.backgroundCard};

  border: 1px solid rgba(255, 255, 255, 0.06);

  box-shadow: 0 0 20px ${({ theme }) => theme.colors.accentGlow};
`;

export const CardTitle = styled.h3`
  color: ${({ theme }) => theme.colors.onSecondary};

  font-size: 1.5rem;

  line-height: 1.3;

  font-family: ${({ theme }) => theme.fonts.title};
`;

export const CardDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSoft};

  line-height: 1.8;

  font-size: 1rem;
`;
