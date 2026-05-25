import styled from "styled-components";
import { Link } from "react-router-dom";

export const Container = styled(Link)`
  width: 340px;
  height: 100%;

  display: flex;
  flex-direction: column;

  overflow: hidden;

  border-radius: 18px;

  position: relative;

  text-decoration: none;

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

    z-index: 1;
  }
`;

export const Cover = styled.div`
  width: 100%;
  height: 240px;

  overflow: hidden;

  background: ${({ theme }) => theme.colors.backgroundCard};

  img {
    width: 100%;
    height: 100%;

    object-fit: cover;

    transition: transform 0.5s ease;
  }
`;

export const Content = styled.div`
  flex: 1;

  display: flex;
  flex-direction: column;

  gap: 14px;

  padding: 22px;

  z-index: 2;
`;

export const Journal = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 12px;

  color: ${({ theme }) => theme.colors.accent};

  font-size: 0.82rem;

  letter-spacing: 1px;

  text-transform: uppercase;

  span {
    flex-shrink: 0;

    white-space: nowrap;

    padding: 6px 10px;

    border-radius: 999px;

    background: ${({ theme }) => theme.colors.accentGlow};

    color: ${({ theme }) => theme.colors.accent};

    font-size: 0.72rem;

    font-weight: 600;
  }
`;

export const Title = styled.h3`
  color: ${({ theme }) => theme.colors.onSecondary};

  font-size: 1.2rem;

  line-height: 1.5;

  font-family: ${({ theme }) => theme.fonts.title};

  display: -webkit-box;

  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;

  overflow: hidden;
`;

export const Author = styled.span`
  color: ${({ theme }) => theme.colors.textSoft};

  font-size: 0.95rem;

  line-height: 1.6;
`;

export const Footer = styled.div`
  margin-top: auto;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 12px;
`;

export const Year = styled.span`
  color: rgba(255, 255, 255, 0.5);

  font-size: 0.9rem;

  letter-spacing: 1px;
`;

export const ReadMore = styled.span`
  color: ${({ theme }) => theme.colors.accent};

  font-size: 0.9rem;

  font-weight: 600;

  transition: 0.3s;

  ${Container}:hover & {
    transform: translateX(4px);
  }
`;
