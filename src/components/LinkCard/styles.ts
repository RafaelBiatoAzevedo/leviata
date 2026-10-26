import { Link } from "react-router-dom";
import styled from "styled-components";

export const Container = styled(Link)<{ $showReadMore?: boolean }>`
  min-width: 0;
  display: flex;
  flex-direction: column;
  text-decoration: none;

  gap: 22px;

  padding: 36px 30px;
  padding-bottom: ${({ $showReadMore }) => ($showReadMore ? "68px" : "36px")};

  border-radius: 0.8rem;

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

export const CardHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 22px;
  min-width: 0;
`;

export const IconWrapper = styled.div`
  width: 50px;
  height: 50px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 0.6rem;

  font-size: 1.4rem;

  color: ${({ theme }) => theme.colors.onPrimary};

  background: ${({ theme }) => theme.colors.primary};

  box-shadow: 0 0 20px ${({ theme }) => theme.colors.accentGlow};
`;

export const CardTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text};

  font-size: 1.5rem;

  line-height: 1.3;

  font-family: ${({ theme }) => theme.fonts.title};
`;

export const CardDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSoft};

  line-height: 1.8;

  font-size: 1rem;

  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;

  overflow: hidden;

  overflow-wrap: break-word;
`;

export const ReadMore = styled.span`
  position: absolute;
  right: 30px;
  bottom: 24px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 12px;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: 0;
  opacity: 0;
  visibility: hidden;
  transform: translateY(5px);
  transition:
    opacity 0.2s ease,
    visibility 0.2s ease,
    transform 0.2s ease;

  svg {
    width: 16px;
    height: 16px;
  }

  ${Container}:hover &,
  ${Container}:focus-visible & {
    opacity: 1;
    visibility: visible;
    transform: none;
  }

  @media (hover: none) {
    opacity: 1;
    visibility: visible;
    transform: none;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    transform: none;
  }
`;
