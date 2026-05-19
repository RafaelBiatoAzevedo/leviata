import styled from "styled-components";
import { Link } from "react-router-dom";

export const Container = styled(Link)`
  display: flex;
  flex-direction: column;
  width: 360px;
  height: 330px;

  overflow: hidden;

  border-radius: 14px;

  text-decoration: none;

  background: ${({ theme }) => theme.colors.textSoft}20;

  border: 1px solid rgba(255, 255, 255, 0.06);

  transition:
    transform 0.35s ease,
    border-color 0.35s ease,
    box-shadow 0.35s ease;

  position: relative;

  &:hover {
    transform: translateY(-6px);

    border-color: ${({ theme }) => theme.colors.accent};

    box-shadow:
      0 20px 40px rgba(0, 0, 0, 0.4),
      0 0 25px ${({ theme }) => theme.colors.accentGlow};
  }

  &:hover h2 {
    transform: scale(1.08);
    opacity: 1;
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

export const Top = styled.div`
  height: 200px;

  background: #000;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;
`;

export const Acronym = styled.h2`
  font-size: 92px;

  font-family: ${({ theme }) => theme.fonts.title};

  color: ${({ theme }) => theme.colors.primary};

  opacity: 0.9;

  transition:
    transform 0.35s ease,
    opacity 0.35s ease;

  letter-spacing: 6px;
`;

export const Bottom = styled.div`
  padding: 24px;
`;

export const Title = styled.h3`
  color: ${({ theme }) => theme.colors.text};

  font-size: 22px;

  margin-bottom: 12px;

  font-family: ${({ theme }) => theme.fonts.title};
`;

export const Description = styled.p`
  color: ${({ theme }) => theme.colors.text};

  line-height: 1.7;

  font-size: 15px;
`;
