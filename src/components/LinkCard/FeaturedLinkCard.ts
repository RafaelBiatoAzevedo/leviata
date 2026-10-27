import { createElement } from "react";
import { FiCalendar } from "react-icons/fi";
import styled from "styled-components";
import { LinkCard } from "./index";
import {
  CardDescription,
  CardHeader,
  CardTitle,
  IconWrapper,
  ReadMore,
} from "./styles";

export const FeaturedLinkCard = styled(LinkCard).attrs({ showReadMore: true })`
  width: 100%;
  height: 100%;
  min-height: 320px;
  gap: 20px;
  padding: 32px 30px 68px;
  border: 1px solid ${({ theme }) => theme.colors.primary}40;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: 0 6px 24px rgba(17, 24, 39, 0.035);

  &::before {
    inset: -60px -50px auto auto;
    width: 180px;
    height: 180px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      ${({ theme }) => theme.colors.accentSoft},
      transparent 70%
    );
    opacity: 0.6;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 30px;
    width: 40px;
    height: 3px;
    border-radius: 0 0 3px 3px;
    background: ${({ theme }) => theme.colors.primary};
    transition: width 0.3s ease;
  }

  &:hover,
  &:focus-visible {
    transform: translateY(-5px);
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 16px 36px rgba(17, 24, 39, 0.1);
  }

  &:hover::after,
  &:focus-visible::after {
    width: 72px;
  }

  ${CardHeader} {
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 16px;
  }

  ${IconWrapper} {
    flex-shrink: 0;
    width: 56px;
    height: 56px;
    border: 1px solid ${({ theme }) => theme.colors.primary}55;
    border-radius: 14px;
    background: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.primary};
    font-size: 25px;
    box-shadow: 0 6px 14px rgba(17, 24, 39, 0.1);
    transition: transform 0.3s ease;
  }

  &:hover ${IconWrapper}, &:focus-visible ${IconWrapper} {
    transform: rotate(-5deg);
  }

  ${CardTitle} {
    min-width: 0;
    text-align: center;
    font-size: 26px;
    font-weight: 600;
    line-height: 1.2;
    letter-spacing: 0;
    overflow-wrap: anywhere;
  }

  ${CardDescription} {
    color: var(--theme-muted, #6a706b);
    font-size: 13px;
    line-height: 1.8;
    letter-spacing: 0.1px;
  }

  @media (max-width: 640px) {
    min-height: 280px;
    padding: 28px 24px 64px;

    &::after {
      left: 24px;
    }

    ${ReadMore} {
      right: 24px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &,
    &::after,
    ${IconWrapper} {
      transition: none;
    }

    &:hover,
    &:focus-visible,
    &:hover ${IconWrapper}, &:focus-visible ${IconWrapper} {
      transform: none;
    }
  }
`;

export const CompactLinkCard = styled(FeaturedLinkCard)`
  min-height: 184px;
  gap: 10px;
  padding: 16px 24px 40px;

  &::after {
    left: 24px;
  }

  ${CardHeader} {
    justify-content: flex-start;
    gap: 12px;
  }

  ${IconWrapper} {
    width: 44px;
    height: 44px;
    border-radius: 11px;
    font-size: 22px;
  }

  ${CardTitle} {
    text-align: left;
    font-size: 24px;
  }

  ${CardDescription} {
    text-align: left;
    line-height: 1.6;
  }

  ${ReadMore} {
    right: 24px;
    bottom: 14px;
  }

  @media (max-width: 640px) {
    min-height: 168px;
    padding: 14px 20px 38px;

    &::after {
      left: 20px;
    }

    ${CardTitle} {
      font-size: 22px;
    }

    ${ReadMore} {
      right: 20px;
    }
  }
`;

export const DatedLinkCard = styled(FeaturedLinkCard).attrs({
  descriptionIcon: createElement(FiCalendar, { "aria-hidden": true }),
})`
  min-height: 260px;

  ${CardDescription} {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    align-self: center;
    gap: 9px;
    max-width: 100%;
    padding: 8px 14px;
    border: 1px solid ${({ theme }) => theme.colors.primary}55;
    border-radius: 10px;
    background: ${({ theme }) => theme.colors.accentSoft};
    color: ${({ theme }) => theme.colors.heading};
    text-align: center;
    font-weight: 500;
    font-variant-numeric: tabular-nums;

    svg {
      flex-shrink: 0;
      color: ${({ theme }) => theme.colors.primary};
      font-size: 16px;
    }
  }

  @media (max-width: 640px) {
    min-height: 240px;
  }
`;

export const CompactDatedLinkCard = styled(DatedLinkCard)`
  min-height: 184px;
  gap: 12px;
  padding: 20px 24px 48px;

  &::after {
    left: 24px;
  }

  ${CardHeader} {
    justify-content: flex-start;
    gap: 12px;
  }

  ${IconWrapper} {
    width: 44px;
    height: 44px;
    border-radius: 11px;
    font-size: 22px;
  }

  ${CardTitle} {
    text-align: left;
    font-size: 24px;
  }

  ${CardDescription} {
    align-self: flex-start;
    padding: 6px 10px;
  }

  ${ReadMore} {
    right: 24px;
    bottom: 14px;
  }

  @media (max-width: 640px) {
    min-height: 168px;
    padding: 16px 20px 42px;

    &::after {
      left: 20px;
    }

    ${CardTitle} {
      font-size: 22px;
    }

    ${ReadMore} {
      right: 20px;
    }
  }
`;
