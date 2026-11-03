import { portalContent } from "../../styles/portal";
import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  margin-top: var(--portal-header-height, 70px);
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  ${portalContent}
`;

export const Archive = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  width: 100%;
  max-width: 1080px;
  min-width: 0;
`;

export const YearNavigation = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export const YearLink = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  padding: 10px 16px;
  border: 1px solid ${({ theme }) => theme.colors.primary}40;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.heading};
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0;
  text-decoration: none;

  span {
    color: var(--theme-muted, #6a7079);
    font-size: 11px;
    font-weight: 400;
  }

  &:hover,
  &:focus-visible {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.accentSoft};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 3px;
  }
`;

export const Timeline = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 36px;
  min-width: 0;

  &::before {
    content: "";
    position: absolute;
    top: 14px;
    bottom: 0;
    left: 5px;
    width: 1px;
    background: ${({ theme }) => theme.colors.primary}50;
  }
`;

export const YearSection = styled.section`
  position: relative;
  min-width: 0;
  padding-left: 32px;
  scroll-margin-top: 24px;

  &::before {
    content: "";
    position: absolute;
    top: 8px;
    left: 0;
    width: 11px;
    height: 11px;
    border: 2px solid ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.background};
    box-shadow: 0 0 0 4px ${({ theme }) => theme.colors.background};
  }

  .swiper-slide {
    display: flex;
    align-items: stretch;
    width: 320px;
    height: auto;
  }

  @media (max-width: 640px) {
    padding-left: 24px;

    .swiper-slide {
      width: min(320px, 100%);
    }
  }
`;

export const YearHeading = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 8px;

  h2 {
    color: ${({ theme }) => theme.colors.heading};
    font-size: 28px;
    font-weight: 600;
    line-height: 1;
    letter-spacing: 0;
  }

  span {
    color: var(--theme-muted, #6a7079);
    font-size: 11px;
    letter-spacing: 0;
  }

  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.colors.primary}60,
      transparent
    );
  }
`;
