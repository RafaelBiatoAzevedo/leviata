import { Link } from "react-router-dom";
import styled from "styled-components";

export const Container = styled(Link)`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 32px 24px;

  border-radius: 18px;

  text-decoration: none;

  position: relative;

  overflow: hidden;

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
      0 20px 40px rgba(0, 0, 0, 0.45),
      0 0 25px ${({ theme }) => theme.colors.accentGlow};
  }

  &:hover img {
    transform: scale(1.05);
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

export const ProfileImage = styled.div`
  width: 150px;
  min-height: 150px;

  border-radius: 50%;

  overflow: hidden;

  border: 2px solid ${({ theme }) => theme.colors.accent};

  box-shadow: 0 0 20px ${({ theme }) => theme.colors.accentGlow};

  margin-bottom: 24px;

  position: relative;

  z-index: 2;

  img {
    width: 100%;
    height: 100%;

    object-fit: cover;

    transition: transform 0.5s ease;
  }
`;

export const Content = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;

  gap: 1.2rem;

  text-align: center;

  position: relative;

  z-index: 2;
`;

export const Name = styled.h3`
  color: ${({ theme }) => theme.colors.text};

  font-size: 1.5rem;

  line-height: 1.2;
`;

export const Category = styled.h4`
  color: ${({ theme }) => theme.colors.primary};

  font-size: 1rem;

  text-transform: uppercase;

  line-height: 1.2;

  &:last-child {
    margin-top: auto;
  }
`;

export const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSoft};
  text-align: justify;

  line-height: 1.8;

  font-size: 0.95rem;

  max-width: 320px;

  flex: 1;
`;
