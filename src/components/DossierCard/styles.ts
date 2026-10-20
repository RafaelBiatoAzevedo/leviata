import { Link } from "react-router-dom";
import styled from "styled-components";

export const Container = styled(Link)`
  display: flex;
  flex-direction: column;
  width: 300px;
  max-width: 100%;
  height: 100%;
  isolation: isolate;
  overflow: hidden;
  border: 1px solid rgba(17, 24, 39, 0.12);
  border-radius: 12px;
  background: #fcfaf5;
  color: ${({ theme }) => theme.colors.secondary};
  text-decoration: none;
  transition:
    transform 0.35s ease,
    border-color 0.35s ease,
    box-shadow 0.35s ease;

  &:hover,
  &:focus-visible {
    transform: translateY(-6px);
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 18px 36px rgba(17, 24, 39, 0.14);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 4px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:hover,
    &:focus-visible {
      transform: none;
    }
  }
`;

export const Header = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 94px;
  padding: 26px 22px;
  background:
    radial-gradient(
      ellipse at 100% 0%,
      ${({ theme }) => theme.colors.accentGlow},
      transparent 75%
    ),
    #1c322e;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 22px;
    width: 48px;
    height: 3px;
    background: ${({ theme }) => theme.colors.primary};
  }
`;

export const IconWrapper = styled.div`
  position: relative;
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 48px;
  height: 36px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 3px;
  background: ${({ theme }) => theme.colors.accentSoft};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 22px;
  transition: transform 0.3s ease;

  &::before {
    content: "";
    position: absolute;
    top: -7px;
    left: -1px;
    width: 22px;
    height: 7px;
    border: 1px solid ${({ theme }) => theme.colors.primary};
    border-bottom: 0;
    border-radius: 3px 3px 0 0;
    background: #283c32;
  }

  svg {
    stroke-width: 1.3;
  }

  ${Container}:hover &,
  ${Container}:focus-visible & {
    transform: translateY(-2px);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    ${Container}:hover &,
    ${Container}:focus-visible & {
      transform: none;
    }
  }
`;

export const HeaderLabel = styled.span`
  color: ${({ theme }) => theme.colors.onSecondary};
  font-size: 9px;
  font-weight: 500;
  line-height: 1.6;
  letter-spacing: 1.2px;
  text-transform: uppercase;
`;

export const Reference = styled.span`
  margin-left: auto;
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.fonts.title};
  font-size: 34px;
  line-height: 1;
  letter-spacing: -1px;
  opacity: 0.8;
`;

export const Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 16px;
  padding: 22px;
`;

export const Title = styled.h3`
  display: -webkit-box;
  min-height: 2.4em;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  font-family: ${({ theme }) => theme.fonts.title};
  font-size: 24px;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: 0.1px;
  overflow-wrap: anywhere;
`;

export const Period = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding-left: 11px;
  border-left: 2px solid ${({ theme }) => theme.colors.primary};

  span {
    color: #6a706b;
    font-size: 8px;
    font-weight: 500;
    letter-spacing: 1.3px;
    text-transform: uppercase;
  }

  strong {
    font-size: 13px;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.5px;
  }
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid rgba(17, 24, 39, 0.1);
`;

export const ReadMore = styled.span`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0;
`;

export const LinkArrow = styled.span`
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 30px;
  height: 30px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  font-size: 16px;
  transition: background 0.25s ease;

  svg {
    transition: transform 0.25s ease;
  }

  ${Container}:hover &,
  ${Container}:focus-visible & {
    background: ${({ theme }) => theme.colors.primary};

    svg {
      transform: translateX(2px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &,
    svg {
      transition: none;
    }

    ${Container}:hover & svg,
    ${Container}:focus-visible & svg {
      transform: none;
    }
  }
`;
