import styled, { css } from "styled-components";
import { portalContent, portalGrid } from "../../styles/portal";
import type { NewsletterEditionStatus } from "../../utils/newsletterEditions";

export const Container = styled.div`
  width: 100%;
  margin-top: var(--portal-header-height, 70px);
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 36px;
  ${portalContent}
`;

export const Library = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(32px, 5vw, 52px);
  width: 100%;
  max-width: 1120px;
  min-width: 0;
`;

export const LibrarySummary = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  padding: clamp(24px, 3vw, 36px);
  border: 1px solid ${({ theme }) => theme.colors.primary}50;
  border-radius: 18px;
  background:
    radial-gradient(
      ellipse at top right,
      ${({ theme }) => theme.colors.accentGlow},
      transparent 65%
    ),
    ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.onSecondary};

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const SummaryCopy = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  min-width: 0;

  > div:last-child {
    min-width: 0;
  }

  span {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 10px;
    font-weight: 600;
    line-height: 1.6;
    letter-spacing: 1.6px;
    text-transform: uppercase;
  }

  h2 {
    max-width: 30ch;
    margin-top: 8px;
    font-size: clamp(25px, 2.5vw, 31px);
    font-weight: 500;
    line-height: 1.15;
    letter-spacing: 0;
    text-wrap: balance;
  }

  p {
    max-width: 60ch;
    margin-top: 10px;
    color: ${({ theme }) => theme.colors.onSecondary};
    font-size: 12px;
    line-height: 1.8;
    letter-spacing: 0.1px;
    opacity: 0.75;
  }
`;

export const SummaryIcon = styled.div`
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  border: 1px solid ${({ theme }) => theme.colors.primary}50;
  border-radius: 14px;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 23px;

  @media (max-width: 420px) {
    display: none;
  }
`;

export const SummaryStats = styled.div`
  display: flex;
  flex-shrink: 0;
  gap: 24px;
  padding-left: 24px;
  border-left: 1px solid ${({ theme }) => theme.colors.primary}40;

  > div {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  strong {
    color: ${({ theme }) => theme.colors.primary};
    font-family: ${({ theme }) => theme.fonts.title};
    font-size: 36px;
    font-weight: 500;
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }

  span {
    font-size: 11px;
    line-height: 1.6;
    letter-spacing: 0;
  }

  @media (max-width: 700px) {
    padding: 20px 0 0;
    border-left: 0;
    border-top: 1px solid ${({ theme }) => theme.colors.primary}40;
  }
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
`;

export const SectionHeading = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;

  > svg {
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.primary};
    font-size: 23px;
  }

  h2 {
    color: ${({ theme }) => theme.colors.secondary};
    font-size: clamp(27px, 2.5vw, 32px);
    font-weight: 600;
    line-height: 1.15;
    letter-spacing: -0.3px;
  }

  p {
    margin-top: 6px;
    color: #626973;
    font-size: 12px;
    line-height: 1.7;
    letter-spacing: 0;
  }
`;

export const YearBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
`;

export const YearHeading = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;

  h3 {
    color: ${({ theme }) => theme.colors.secondary};
    font-size: 25px;
    font-weight: 600;
    line-height: 1;
    letter-spacing: 0;
  }

  span {
    color: #626973;
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

export const EditionGrid = styled.div`
  ${portalGrid}
  gap: 22px;
`;

export const EditionItem = styled.article<{ $featured: boolean }>`
  display: grid;
  grid-template-columns: ${({ $featured }) =>
    $featured ? "minmax(0, 0.85fr) minmax(0, 1.15fr)" : "minmax(0, 1fr)"};
  min-width: 0;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.primary}40;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: 0 6px 24px rgba(17, 24, 39, 0.035);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:hover,
  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 12px 30px rgba(17, 24, 39, 0.075);
  }

  @media (max-width: 700px) {
    grid-template-columns: minmax(0, 1fr);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const EditionCover = styled.div<{ $featured: boolean }>`
  position: relative;
  display: flex;
  min-height: ${({ $featured }) => ($featured ? "300px" : "180px")};
  background: ${({ theme }) => theme.colors.secondary};

  > img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  @media (max-width: 700px) {
    min-height: ${({ $featured }) => ($featured ? "220px" : "180px")};
  }
`;

export const PlaceholderCover = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 32px 24px;
  color: ${({ theme }) => theme.colors.onSecondary};
  text-align: center;
  background: radial-gradient(
    ellipse at top right,
    ${({ theme }) => theme.colors.accentGlow},
    transparent 80%
  );

  &::before {
    content: "";
    position: absolute;
    inset: 14px;
    border: 1px solid ${({ theme }) => theme.colors.primary}35;
    pointer-events: none;
  }

  > svg {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 30px;
  }

  strong {
    max-width: 18ch;
    font-family: ${({ theme }) => theme.fonts.title};
    font-size: 27px;
    font-weight: 500;
    line-height: 1.15;
    letter-spacing: 0;
  }

  span {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 9px;
    line-height: 1.6;
    letter-spacing: 1.8px;
    text-transform: uppercase;
  }
`;

export const EditionBody = styled.div<{ $featured: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 13px;
  min-width: 0;
  padding: ${({ $featured }) =>
    $featured ? "clamp(24px, 3vw, 40px)" : "24px"};
`;

export const StatusBadge = styled.span<{ $status: NewsletterEditionStatus }>`
  padding: 5px 10px;
  border: 1px solid ${({ theme }) => theme.colors.primary}40;
  border-radius: 20px;
  color: ${({ theme, $status }) =>
    $status === "published" ? theme.colors.primary : theme.colors.secondary};
  background: ${({ theme, $status }) =>
    $status === "published" ? theme.colors.secondary : theme.colors.accentSoft};
  font-size: 10px;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: 0.1px;
`;

export const EditionDate = styled.time`
  display: flex;
  align-items: center;
  gap: 7px;
  color: #626973;
  font-size: 11px;
  line-height: 1.7;
  letter-spacing: 0;

  svg {
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.primary};
    font-size: 14px;
  }
`;

export const EditionTitle = styled.h3<{ $featured: boolean }>`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: ${({ $featured }) =>
    $featured ? "clamp(27px, 2.5vw, 34px)" : "25px"};
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: -0.3px;
  text-wrap: pretty;
  overflow-wrap: anywhere;
`;

export const EditionSubject = styled.p`
  color: #626973;
  font-size: 13px;
  line-height: 1.85;
  letter-spacing: 0.1px;
  overflow-wrap: anywhere;
`;

export const EditionActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  width: 100%;
  margin-top: auto;
  padding-top: 8px;
`;

const actionStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-height: 44px;
  padding: 11px 15px;
  border: 1px solid ${({ theme }) => theme.colors.primary}60;
  border-radius: 9px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: 0;
  text-decoration: none;
  transition:
    background 0.2s ease,
    border-color 0.2s ease;

  > svg {
    flex-shrink: 0;
    font-size: 16px;
  }

  &:hover,
  &:focus-visible {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.accentGlow};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const ReadButton = styled.button`
  ${actionStyles}
  color: ${({ theme }) => theme.colors.onSecondary};
  background: ${({ theme }) => theme.colors.secondary};

  &:hover,
  &:focus-visible {
    color: ${({ theme }) => theme.colors.secondary};
    background: ${({ theme }) => theme.colors.primary};
  }
`;

export const ActionLink = styled.a<{ $primary?: boolean; $onDark?: boolean }>`
  ${actionStyles}
  color: ${({ theme, $primary }) =>
    $primary ? theme.colors.onSecondary : theme.colors.secondary};
  background: ${({ theme, $primary, $onDark }) =>
    $primary
      ? theme.colors.secondary
      : $onDark
        ? theme.colors.primary
        : theme.colors.accentSoft};

  &:hover,
  &:focus-visible {
    color: ${({ theme }) => theme.colors.secondary};
    background: ${({ theme }) => theme.colors.accentHover};
  }
`;

export const Availability = styled.p`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: auto;
  padding-top: 8px;
  color: #626973;
  font-size: 11px;
  line-height: 1.8;
  letter-spacing: 0;

  svg {
    flex-shrink: 0;
    margin-top: 3px;
    color: ${({ theme }) => theme.colors.primary};
    font-size: 14px;
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 44px 24px;
  border: 1px dashed ${({ theme }) => theme.colors.primary}60;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.surface};
  text-align: center;

  > svg {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 30px;
  }

  h2 {
    max-width: 36ch;
    color: ${({ theme }) => theme.colors.secondary};
    font-size: 27px;
    font-weight: 600;
    line-height: 1.2;
    letter-spacing: 0;
  }

  p {
    max-width: 58ch;
    color: #626973;
    font-size: 13px;
    line-height: 1.8;
    letter-spacing: 0;
  }
`;

export const SubscribeSection = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.2fr);
  gap: 24px;
  scroll-margin-top: 24px;

  > section {
    width: 100%;
  }

  @media (max-width: 800px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const SubscribeCopy = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 18px;
  min-width: 0;
  padding: clamp(24px, 3vw, 40px);
  border: 1px solid ${({ theme }) => theme.colors.primary}40;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.onSecondary};

  > svg {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 28px;
  }

  > span {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }

  h2 {
    max-width: 21ch;
    font-size: clamp(28px, 2.5vw, 34px);
    font-weight: 500;
    line-height: 1.15;
    letter-spacing: 0;
    text-wrap: balance;
  }

  p {
    max-width: 42ch;
    font-size: 12px;
    line-height: 1.85;
    letter-spacing: 0.1px;
    opacity: 0.75;
  }
`;
