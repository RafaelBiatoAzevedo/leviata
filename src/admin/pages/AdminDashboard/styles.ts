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
  color: #777767;
  margin: 0 0 8px;
`;
export const Title = styled.h1`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.title};
  font-size: clamp(34px, 3vw, 46px);
  font-weight: 600;
  line-height: 1.05;
  letter-spacing: -0.035em;
  color: #24382f;
`;
export const Subtitle = styled.p`
  margin: 9px 0 0;
  color: #6b716b;
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
  color: #6b716b;
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
  border: 1px solid #e4e6df;
  color: #344138;
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
    background: #f4f4ed;
  }
  ${({ $variant, theme }) =>
    $variant === "gold" &&
    css`
      background: ${theme.colors.primary};
      color: #1c3029;
      border-color: ${theme.colors.primary};
      &:hover {
        background: ${theme.colors.accentHover};
      }
    `}
  ${({ $variant }) =>
    $variant === "ghost" &&
    css`
      background: transparent;
      color: #f4f1e7;
      border-color: rgba(255, 255, 255, 0.22);
      &:hover {
        background: rgba(255, 255, 255, 0.08);
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
  background: #1d342c;
  color: #f4f1e7;
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
    border: 1px solid rgba(198, 161, 91, 0.17);
    border-radius: 50%;
  }
  &::before {
    box-shadow:
      0 0 0 52px rgba(198, 161, 91, 0.045),
      0 0 0 106px rgba(198, 161, 91, 0.03);
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
    color: #c3ccc2;
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
  color: #d4bd86;
  span {
    height: 5px;
    width: 5px;
    background: #c6a15b;
    border-radius: 50%;
    flex-shrink: 0;
  }
`;
export const BannerTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.title};
  font-size: clamp(36px, 3.5vw, 55px);
  font-weight: 500;
  line-height: 1.03;
  letter-spacing: -0.025em;
  margin: 19px 0 0;
  em {
    color: #d7b972;
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
  border-left: 1px solid rgba(255, 255, 255, 0.16);
  padding-left: 44px;
  > span {
    font-size: 11px;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: #c3ccc2;
  }
  p {
    margin: 0;
    font-size: 12px;
    line-height: 1.6;
    color: #c3ccc2;
  }
  small {
    margin-top: 25px;
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 11px;
    color: #b6c6b9;
  }
  @media (max-width: 900px) {
    padding-left: 24px;
  }
  @media (max-width: 650px) {
    justify-self: stretch;
    border-left: 0;
    border-top: 1px solid rgba(255, 255, 255, 0.16);
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
  color: #f7f2e5;
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
  border: 1px solid #e6e9e2;
  border-radius: 12px;
  padding: 17px;
  background: ${({ theme }) => theme.colors.background};
  box-shadow: 0 3px 10px rgba(33, 48, 39, 0.025);
  transition:
    border-color 0.2s,
    transform 0.2s,
    box-shadow 0.2s;
  > span {
    color: #6b716b;
    font-size: 12px;
    line-height: 1.5;
  }
  &:hover {
    border-color: #c6a15b;
    transform: translateY(-3px);
    box-shadow: 0 8px 16px rgba(33, 48, 39, 0.05);
  }
  ${focus}
`;
export const StatTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  > svg {
    font-size: 14px;
    color: #a3aaa0;
  }
`;
const iconColors = {
  sage: { background: "#ecf1e9", color: "#59755a" },
  gold: { background: "#f7f0e0", color: "#9e7d38" },
  blue: { background: "#ecf0f5", color: "#5d7895" },
  rose: { background: "#f6eeea", color: "#a07462" },
};
export const IconTile = styled.div<{ $color: keyof typeof iconColors }>`
  width: 33px;
  height: 33px;
  border-radius: 9px;
  display: grid;
  place-items: center;
  background: ${({ $color }) => iconColors[$color].background};
  color: ${({ $color }) => iconColors[$color].color};
  svg {
    font-size: 17px;
  }
`;
export const StatValue = styled.strong`
  display: block;
  color: #2c3b30;
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
  border: 1px solid #e6e9e2;
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
    color: #848a80;
    font-size: 12px;
  }
`;
export const SectionHeading = styled.h2`
  margin: 0;
  color: #2c3b30;
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
  color: #5f714d;
  font-size: 11px;
  font-weight: 600;
  text-decoration: none;
  svg {
    font-size: 14px;
    transition: transform 0.2s;
  }
  &:hover {
    color: #88703e;
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
    border-top: 1px solid #eff0eb;
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
    color: #9b9f94;
    flex-shrink: 0;
    margin-left: auto;
  }
  &:hover h3 {
    color: #9e7d38;
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
  background: #f3f2e9;
  border: 1px solid #e9e7d8;
  color: #53694e;
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
    color: #7c8576;
    font-size: 11px;
  }
  h3 {
    color: #364237;
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
    color: #90968c;
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
  color: #a98d52;
  background: #f3f0e6;
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
    color: #a48a50;
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
    color: #a59161;
    font-size: 29px;
    margin-bottom: 15px;
  }
  h3 {
    font-size: 14px;
    font-weight: 500;
    color: #495747;
    margin: 0 0 8px;
  }
  p {
    font-size: 12px;
    color: #899180;
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
  color: #a04639;
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
  background: #f8f8f2;
  border: 1px solid #e6e8dd;
  border-radius: 12px;
  text-decoration: none;
  transition:
    border-color 0.2s,
    background 0.2s;
  > svg {
    color: #819268;
    font-size: 22px;
  }
  h3 {
    color: #364237;
    margin: 16px 0 7px;
    font-size: 14px;
    font-weight: 600;
  }
  p {
    color: #808773;
    margin: 0;
    font-size: 11px;
    line-height: 1.7;
  }
  span {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 7px;
    color: #708256;
    font-size: 11px;
    font-weight: 600;
    margin-top: 20px;
  }
  &:hover {
    background: #f2f3e8;
    border-color: #c6a15b;
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
    rgba(150, 158, 141, 0.12) 25%,
    rgba(150, 158, 141, 0.23) 50%,
    rgba(150, 158, 141, 0.12) 75%
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
  color: #9b9f93;
  svg {
    color: #b4a273;
    font-size: 15px;
  }
  span:first-of-type {
    color: #7f8678;
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
