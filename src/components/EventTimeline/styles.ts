import styled from "styled-components";
import { Link } from "react-router-dom";
import type { TimelineStatus } from "../../utils/timeline";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(32px, 5vw, 56px);
  width: 100%;
  max-width: 1080px;
  min-width: 0;
  margin-inline: auto;
`;

export const Overview = styled.div`
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
      transparent 70%
    ),
    ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.onSecondary};

  @media (max-width: 700px) {
    align-items: stretch;
    flex-direction: column;
    gap: 22px;
  }
`;

export const OverviewCopy = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  min-width: 0;

  > div:last-child {
    min-width: 0;
  }

  span {
    display: block;
    margin-bottom: 8px;
    color: ${({ theme }) => theme.colors.primary};
    font-size: 10px;
    font-weight: 600;
    line-height: 1.6;
    letter-spacing: 1.6px;
    text-transform: uppercase;
  }

  p {
    max-width: 36ch;
    font-family: ${({ theme }) => theme.fonts.title};
    font-size: clamp(23px, 2.2vw, 29px);
    font-weight: 500;
    line-height: 1.25;
    letter-spacing: 0;
  }

  small {
    display: block;
    margin-top: 10px;
    color: ${({ theme }) => theme.colors.onSecondary};
    font-size: 10px;
    line-height: 1.6;
    opacity: 0.7;
  }
`;

export const OverviewIcon = styled.div`
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border: 1px solid ${({ theme }) => theme.colors.primary}50;
  border-radius: 14px;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 22px;

  @media (max-width: 420px) {
    display: none;
  }
`;

export const OverviewLinks = styled.nav`
  display: flex;
  gap: 10px;
  flex-shrink: 0;
`;

export const OverviewStat = styled.a`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  min-width: 112px;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.primary}40;
  border-radius: 12px;
  color: inherit;
  background: rgba(255, 255, 255, 0.025);
  text-decoration: none;
  transition:
    background 0.2s ease,
    border-color 0.2s ease;

  strong {
    color: ${({ theme }) => theme.colors.primary};
    font-family: ${({ theme }) => theme.fonts.title};
    font-size: 34px;
    font-weight: 500;
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }

  span {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    font-size: 11px;
    letter-spacing: 0;
  }

  svg {
    color: ${({ theme }) => theme.colors.primary};
    flex-shrink: 0;
  }

  &:hover,
  &:focus-visible {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.accentSoft};
  }

  @media (max-width: 360px) {
    min-width: 0;
    padding: 14px 12px;
  }
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 28px;
  min-width: 0;
  scroll-margin-top: 24px;
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

  > div {
    min-width: 0;
  }

  h2 {
    color: ${({ theme }) => theme.colors.text};
    font-size: clamp(27px, 2.6vw, 34px);
    font-weight: 600;
    line-height: 1.15;
    letter-spacing: -0.4px;
    text-wrap: balance;
  }

  p {
    margin-top: 6px;
    color: #6a7079;
    font-size: 12px;
    line-height: 1.7;
    letter-spacing: 0;
  }

  > span {
    display: grid;
    place-items: center;
    flex-shrink: 0;
    min-width: 32px;
    height: 32px;
    margin-left: auto;
    padding-inline: 8px;
    border: 1px solid ${({ theme }) => theme.colors.primary}40;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.accentSoft};
    color: ${({ theme }) => theme.colors.secondary};
    font-size: 12px;
    font-variant-numeric: tabular-nums;
  }
`;

export const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
`;

export const YearHeader = styled.div`
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
    color: #6a7079;
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

export const List = styled.ol`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 22px;
  margin: 0;
  padding: 0;
  list-style: none;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 95px;
    width: 1px;
    background: ${({ theme }) => theme.colors.primary}50;
  }

  @media (max-width: 600px) {
    &::before {
      left: 5px;
    }
  }
`;

export const Item = styled.li<{ $past: boolean }>`
  position: relative;
  display: grid;
  grid-template-columns: 76px minmax(0, 1fr);
  align-items: start;
  gap: 40px;
  min-width: 0;

  &::before {
    content: "";
    position: absolute;
    top: 32px;
    left: 90px;
    width: 11px;
    height: 11px;
    border: 2px solid ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    background: ${({ theme, $past }) =>
      $past ? theme.colors.background : theme.colors.primary};
    box-shadow: 0 0 0 4px ${({ theme }) => theme.colors.background};
  }

  @media (max-width: 600px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 10px;
    padding-left: 24px;

    &::before {
      top: 6px;
      left: 0;
    }
  }
`;

export const DateStamp = styled.div<{ $past: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  margin-top: 8px;
  padding: 12px 6px;
  border: 1px solid ${({ theme }) => theme.colors.primary}40;
  border-radius: 12px;
  background: ${({ theme, $past }) =>
    $past ? theme.colors.surface : theme.colors.secondary};
  color: ${({ theme, $past }) =>
    $past ? theme.colors.secondary : theme.colors.primary};

  strong {
    font-family: ${({ theme }) => theme.fonts.title};
    font-size: 34px;
    font-weight: 600;
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }

  span {
    font-size: 10px;
    line-height: 1.5;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  @media (max-width: 600px) {
    flex-direction: row;
    gap: 6px;
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: 0;
    background: transparent;
    color: ${({ theme }) => theme.colors.secondary};

    strong {
      font-family: ${({ theme }) => theme.fonts.body};
      font-size: 13px;
      line-height: 1.7;
    }
  }
`;

export const Card = styled.article<{ $past: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
  padding: clamp(20px, 2.5vw, 30px);
  border: 1px solid ${({ theme }) => theme.colors.primary}40;
  border-top: 3px solid
    ${({ theme, $past }) =>
      $past ? `${theme.colors.primary}60` : theme.colors.primary};
  border-radius: 4px 16px 16px 16px;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: 0 6px 22px rgba(17, 24, 39, 0.035);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:hover,
  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 12px 28px rgba(17, 24, 39, 0.07);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const GroupHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

export const DateLabel = styled.time`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #626973;
  font-size: 11px;
  line-height: 1.7;

  svg {
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.primary};
    font-size: 14px;
  }
`;

export const StatusBadge = styled.span<{ $status: TimelineStatus }>`
  flex-shrink: 0;
  padding: 5px 10px;
  border: 1px solid ${({ theme }) => theme.colors.primary}40;
  border-radius: 20px;
  background: ${({ theme, $status }) =>
    $status === "ongoing" || $status === "today"
      ? theme.colors.secondary
      : theme.colors.accentSoft};
  color: ${({ theme, $status }) =>
    $status === "ongoing" || $status === "today"
      ? theme.colors.onSecondary
      : theme.colors.secondary};
  font-size: 10px;
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: 0.2px;
`;

export const CardTitle = styled.h4`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: clamp(24px, 2.3vw, 31px);
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.3px;
  text-wrap: pretty;
  overflow-wrap: anywhere;
`;

export const CardSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 14px;
  line-height: 1.7;
  letter-spacing: 0;
`;

export const Metadata = styled.p`
  display: flex;
  align-items: flex-start;
  gap: 9px;
  color: #626973;
  font-size: 12px;
  line-height: 1.8;
  letter-spacing: 0;

  svg {
    flex-shrink: 0;
    margin-top: 3px;
    color: ${({ theme }) => theme.colors.primary};
    font-size: 15px;
  }

  span {
    min-width: 0;
    letter-spacing: inherit;
    overflow-wrap: anywhere;
  }
`;

export const CardDescription = styled.p`
  color: #626973;
  font-size: 13px;
  line-height: 1.85;
  letter-spacing: 0.1px;
  white-space: pre-line;
  overflow-wrap: anywhere;
`;

export const Authors = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.primary}30;

  > p {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #626973;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.4px;
    text-transform: uppercase;
  }

  svg {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 14px;
  }
`;

export const AuthorList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0;
  list-style: none;

  li {
    padding: 7px 10px;
    border: 1px solid ${({ theme }) => theme.colors.primary}30;
    border-radius: 8px;
    color: ${({ theme }) => theme.colors.secondary};
    font-size: 11px;
    line-height: 1.6;
    letter-spacing: 0;
    overflow-wrap: anywhere;
  }

  span {
    margin-right: 5px;
    color: #626973;
    letter-spacing: 0;
  }
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  padding-top: 4px;

  &:empty {
    display: none;
  }
`;

export const ExternalAction = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 40px;
  padding: 8px 11px;
  border: 1px solid ${({ theme }) => theme.colors.primary}50;
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.secondary};
  background: ${({ theme }) => theme.colors.accentSoft};
  font-size: 11px;
  line-height: 1.5;
  letter-spacing: 0;
  text-decoration: none;
  transition:
    border-color 0.2s ease,
    background 0.2s ease;

  svg {
    flex-shrink: 0;
    font-size: 14px;
  }

  &:hover,
  &:focus-visible {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.accentGlow};
  }
`;

export const DetailLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 40px;
  margin-left: auto;
  padding: 8px 0 8px 8px;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0;
  text-decoration: none;

  svg {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 16px;
  }

  &:hover,
  &:focus-visible {
    text-decoration: underline;
    text-decoration-color: ${({ theme }) => theme.colors.primary};
    text-underline-offset: 4px;
  }
`;

export const EmptyState = styled.div<{ $compact?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  width: 100%;
  min-width: 0;
  padding: ${({ $compact }) => ($compact ? "28px 20px" : "48px 24px")};
  border: 1px dashed ${({ theme }) => theme.colors.primary}60;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.surface};
  text-align: center;

  > svg {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 28px;
  }

  h2 {
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
