import { Link } from "react-router-dom";
import styled, { css, keyframes } from "styled-components";

const focus = css`
  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 4px;
  }
`;

export const Container = styled.div`
  width: 100%;
  max-width: 1360px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 28px;
  font-size: 14px;
  h3 {
    font-family: ${({ theme }) => theme.fonts.body};
    letter-spacing: normal;
  }
  color: ${({ theme }) => theme.colors.text};
`;
export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
`;
export const Eyebrow = styled.p`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSoft};
  margin: 0 0 8px;
`;
export const Title = styled.h1`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.title};
  font-size: clamp(34px, 3vw, 46px);
  font-weight: 600;
  line-height: 1.05;
  letter-spacing: -0.035em;
  color: ${({ theme }) => theme.colors.secondary};
`;
export const Subtitle = styled.p`
  margin: 9px 0 0;
  color: ${({ theme }) => theme.colors.textSoft};
  font-size: 14px;
  line-height: 1.6;
`;
export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 18px;
`;
export const DateLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSoft};
  svg {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 16px;
  }
`;
export const ActionLink = styled(Link)<{ $variant?: "gold" | "ghost" }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 12px 17px;
  border-radius: 9px;
  font-size: 12px;
  line-height: 1.3;
  font-weight: 600;
  text-decoration: none;
  border: 1px solid
    color-mix(in srgb, ${({ theme }) => theme.colors.textSoft} 22%, transparent);
  color: ${({ theme }) => theme.colors.secondary};
  background: ${({ theme }) => theme.colors.background};
  transition:
    background 0.2s,
    transform 0.2s;
  svg {
    font-size: 16px;
    flex-shrink: 0;
  }
  &:hover {
    transform: translateY(-2px);
    background: ${({ theme }) => theme.colors.accentSoft};
  }
  ${({ $variant, theme }) =>
    $variant === "gold" &&
    css`
      background: ${theme.colors.primary};
      color: ${theme.colors.secondary};
      border-color: ${theme.colors.primary};
      &:hover {
        background: ${theme.colors.accentHover};
      }
    `}
  ${({ $variant, theme }) =>
    $variant === "ghost" &&
    css`
      background: transparent;
      color: ${theme.colors.onSecondary};
      border-color: color-mix(
        in srgb,
        ${theme.colors.onSecondary} 22%,
        transparent
      );
      &:hover {
        background: color-mix(
          in srgb,
          ${theme.colors.onSecondary} 8%,
          transparent
        );
      }
    `}
  ${focus}
`;
export const Banner = styled.section`
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1.45fr 1fr;
  align-items: center;
  gap: 40px;
  padding: 36px 42px;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.onSecondary};
  isolation: isolate;
  &::before,
  &::after {
    content: "";
    position: absolute;
    z-index: -1;
    pointer-events: none;
    width: 510px;
    height: 510px;
    right: -130px;
    top: -120px;
    border: 1px solid ${({ theme }) => theme.colors.accentGlow};
    border-radius: 50%;
  }
  &::before {
    box-shadow:
      0 0 0 52px
        color-mix(
          in srgb,
          ${({ theme }) => theme.colors.primary} 4.5%,
          transparent
        ),
      0 0 0 106px
        color-mix(
          in srgb,
          ${({ theme }) => theme.colors.primary} 3%,
          transparent
        );
  }
  &::after {
    width: 280px;
    height: 280px;
    right: -15px;
    top: -5px;
  }
  @media (max-width: 900px) {
    padding: 30px;
    gap: 28px;
    grid-template-columns: 1.4fr 1fr;
  }
  @media (max-width: 650px) {
    grid-template-columns: 1fr;
    padding: 25px;
    gap: 30px;
  }
`;
export const BannerCopy = styled.div`
  > p {
    margin: 16px 0 0;
    max-width: 410px;
    color: ${({ theme }) => theme.colors.onSecondary};
    font-size: 14px;
    line-height: 1.8;
  }
`;
export const BannerLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accentHover};
  span {
    height: 5px;
    width: 5px;
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    flex-shrink: 0;
  }
`;
export const BannerTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.title};
  color: ${({ theme }) => theme.colors.onSecondary};
  font-size: clamp(36px, 3.5vw, 55px);
  font-weight: 500;
  line-height: 1.03;
  letter-spacing: -0.025em;
  margin: 19px 0 0;
  em {
    color: ${({ theme }) => theme.colors.accentHover};
    font-weight: 500;
  }

  @media (max-width: 650px) {
    font-size: clamp(28px, 6vw, 40px);
  }
`;
export const BannerActions = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 25px;
`;
export const BannerSummary = styled.div`
  justify-self: center;
  border-left: 1px solid
    color-mix(
      in srgb,
      ${({ theme }) => theme.colors.onSecondary} 16%,
      transparent
    );
  padding-left: 44px;
  > span {
    font-size: 11px;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.onSecondary};
  }
  p {
    margin: 0;
    font-size: 12px;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.onSecondary};
  }
  small {
    margin-top: 25px;
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 11px;
    color: ${({ theme }) => theme.colors.onSecondary};
  }
  @media (max-width: 900px) {
    padding-left: 24px;
  }
  @media (max-width: 650px) {
    justify-self: stretch;
    border-left: 0;
    border-top: 1px solid
      color-mix(
        in srgb,
        ${({ theme }) => theme.colors.onSecondary} 16%,
        transparent
      );
    padding: 22px 0 0;
    small {
      margin-top: 12px;
    }
  }
`;
export const BannerNumber = styled.div`
  display: flex;
  align-items: center;
  min-height: 92px;
  font-family: ${({ theme }) => theme.fonts.title};
  font-size: clamp(60px, 6vw, 90px);
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.04em;
  color: ${({ theme }) => theme.colors.onSecondary};
  margin: 6px 0;
`;
export const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 14px;
  @media (max-width: 1150px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }
`;
export const StatCard = styled(Link)`
  display: flex;
  flex-direction: column;
  min-width: 0;
  text-decoration: none;
  border: 1px solid
    color-mix(in srgb, ${({ theme }) => theme.colors.textSoft} 22%, transparent);
  border-radius: 12px;
  padding: 17px;
  background: ${({ theme }) => theme.colors.background};
  box-shadow: 0 3px 10px
    color-mix(
      in srgb,
      ${({ theme }) => theme.colors.secondary} 2.5%,
      transparent
    );
  transition:
    border-color 0.2s,
    transform 0.2s,
    box-shadow 0.2s;
  > span {
    color: ${({ theme }) => theme.colors.textSoft};
    font-size: 12px;
    line-height: 1.5;
  }
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-3px);
    box-shadow: 0 8px 16px
      color-mix(
        in srgb,
        ${({ theme }) => theme.colors.secondary} 5%,
        transparent
      );
  }
  ${focus}
`;
export const StatTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  > svg {
    font-size: 14px;
    color: ${({ theme }) => theme.colors.textSoft};
  }
`;
export const IconTile = styled.div`
  width: 33px;
  height: 33px;
  border-radius: 9px;
  display: grid;
  place-items: center;
  background: ${({ theme }) => theme.colors.accentSoft};
  color: ${({ theme }) => theme.colors.primary};
  svg {
    font-size: 17px;
  }
`;
export const StatValue = styled.strong`
  display: block;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 28px;
  font-weight: 600;
  margin: 15px 0 5px;
  line-height: 1.2;
`;
export const PanelGrid = styled.div`
  display: grid;
  grid-template-columns: 1.08fr 1fr;
  gap: 22px;
  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;
export const Panel = styled.section`
  min-width: 0;
  border: 1px solid
    color-mix(in srgb, ${({ theme }) => theme.colors.textSoft} 22%, transparent);
  border-radius: 14px;
  padding: 25px;
  background: ${({ theme }) => theme.colors.background};
  @media (max-width: 480px) {
    padding: 18px;
  }
`;
export const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
  > span {
    color: ${({ theme }) => theme.colors.textSoft};
    font-size: 12px;
  }
`;
export const SectionHeading = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.secondary};
  font-family: ${({ theme }) => theme.fonts.title};
  font-size: 27px;
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: -0.02em;
`;
export const PanelLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 11px;
  font-weight: 600;
  text-decoration: none;
  svg {
    font-size: 14px;
    transition: transform 0.2s;
  }
  &:hover {
    color: ${({ theme }) => theme.colors.accentHover};
    svg {
      transform: translateX(3px);
    }
  }
  ${focus}
`;
export const EventList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  li + li {
    border-top: 1px solid
      color-mix(
        in srgb,
        ${({ theme }) => theme.colors.textSoft} 15%,
        transparent
      );
  }
`;
export const EventItem = styled(Link)`
  display: flex;
  gap: 16px;
  align-items: center;
  text-decoration: none;
  padding: 17px 0;
  border-radius: 8px;
  > svg {
    color: ${({ theme }) => theme.colors.textSoft};
    flex-shrink: 0;
    margin-left: auto;
  }
  &:hover h3 {
    color: ${({ theme }) => theme.colors.primary};
  }
  ${focus}
`;
export const DateTile = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 57px;
  height: 62px;
  flex-shrink: 0;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.accentSoft};
  border: 1px solid ${({ theme }) => theme.colors.accentGlow};
  color: ${({ theme }) => theme.colors.secondary};
  strong {
    font-size: 22px;
    font-weight: 600;
    line-height: 1.2;
  }
  span {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.09em;
    margin-top: 3px;
  }
`;
export const EventDetails = styled.div`
  min-width: 0;
  small {
    color: ${({ theme }) => theme.colors.textSoft};
    font-size: 11px;
  }
  h3 {
    color: ${({ theme }) => theme.colors.secondary};
    font-size: 14px;
    line-height: 1.5;
    font-weight: 500;
    margin: 4px 0;
    overflow-wrap: anywhere;
  }
  p {
    display: flex;
    align-items: center;
    gap: 4px;
    margin: 0;
    color: ${({ theme }) => theme.colors.textSoft};
    font-size: 11px;
    line-height: 1.5;
    svg {
      flex-shrink: 0;
    }
  }
`;
export const NewsList = styled(EventList)``;
export const NewsItem = styled(EventItem)`
  gap: 13px;
`;
export const NewsThumbnail = styled.div`
  width: 58px;
  height: 58px;
  flex-shrink: 0;
  border-radius: 9px;
  overflow: hidden;
  display: grid;
  place-items: center;
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.accentSoft};
  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
  svg {
    font-size: 23px;
  }
`;
export const NewsDetails = styled(EventDetails)`
  h3 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-bottom: 0;
  }
  small {
    color: ${({ theme }) => theme.colors.textSoft};
  }
`;
export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 30px 15px;
  min-height: 240px;
  justify-content: center;
  > svg {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 29px;
    margin-bottom: 15px;
  }
  h3 {
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.secondary};
    margin: 0 0 8px;
  }
  p {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.textSoft};
    line-height: 1.7;
    max-width: 280px;
    margin: 0 0 16px;
  }
`;
export const ErrorState = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 15px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.feedback.danger.border};
  background: ${({ theme }) => theme.colors.feedback.danger.light};
  color: ${({ theme }) => theme.colors.feedback.danger.main};
  font-size: 12px;
  margin-bottom: 15px;
  line-height: 1.6;
  button {
    border: 0;
    background: transparent;
    color: inherit;
    cursor: pointer;
    font: inherit;
    font-weight: 600;
    text-decoration: underline;
    ${focus}
  }
`;
export const ShortcutGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;
export const Shortcut = styled(Link)`
  min-width: 0;
  padding: 21px;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid
    color-mix(in srgb, ${({ theme }) => theme.colors.textSoft} 22%, transparent);
  border-radius: 12px;
  text-decoration: none;
  transition:
    border-color 0.2s,
    background 0.2s;
  > svg {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 22px;
  }
  h3 {
    color: ${({ theme }) => theme.colors.secondary};
    margin: 16px 0 7px;
    font-size: 14px;
    font-weight: 600;
  }
  p {
    color: ${({ theme }) => theme.colors.textSoft};
    margin: 0;
    font-size: 11px;
    line-height: 1.7;
  }
  span {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 7px;
    color: ${({ theme }) => theme.colors.primary};
    font-size: 11px;
    font-weight: 600;
    margin-top: 20px;
  }
  &:hover {
    background: ${({ theme }) => theme.colors.accentSoft};
    border-color: ${({ theme }) => theme.colors.primary};
  }
  ${focus}
`;
const shimmer = keyframes`from { background-position: 200% 0; } to { background-position: -200% 0; }`;
export const Skeleton = styled.span<{
  $width?: string;
  $height: string;
  $spacing?: boolean;
}>`
  display: block;
  width: ${({ $width }) => $width ?? "100%"};
  max-width: 100%;
  height: ${({ $height }) => $height};
  border-radius: 8px;
  background: linear-gradient(
    90deg,
    color-mix(in srgb, ${({ theme }) => theme.colors.textSoft} 12%, transparent)
      25%,
    color-mix(in srgb, ${({ theme }) => theme.colors.textSoft} 23%, transparent)
      50%,
    color-mix(in srgb, ${({ theme }) => theme.colors.textSoft} 12%, transparent)
      75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.7s ease-in-out infinite;
  margin-bottom: ${({ $spacing }) => ($spacing ? "15px" : "0")};
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;
export const Footer = styled.footer`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 9px;
  padding: 4px 0 10px;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSoft};
  svg {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 15px;
  }
  span:first-of-type {
    color: ${({ theme }) => theme.colors.textSoft};
    font-weight: 500;
  }
  span:last-of-type {
    margin-left: auto;
  }
  @media (max-width: 650px) {
    span:last-of-type {
      margin-left: 0;
      width: 100%;
    }
  }
`;
