import styled, { css, keyframes } from "styled-components";

const focus = css`
  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 3px;
  }
`;
export const Container = styled.div`
  --muted: ${({ theme }) => (theme.mode === "light" ? "#606879" : "#B2BBCA")};
  --line: ${({ theme }) => (theme.mode === "light" ? "#E7E7E3" : "#343F50")};
  --gold: ${({ theme }) => (theme.mode === "light" ? "#866020" : "#D4B06A")};
  width: 100%;
  max-width: 1440px;
  min-width: 0;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 13px;
  h2,
  h3,
  p {
    margin: 0;
  }
  button,
  input,
  select {
    font: inherit;
  }
  button {
    cursor: pointer;
  }
  button:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
`;
export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  h1 {
    font-family: ${({ theme }) => theme.fonts.title};
    font-size: clamp(36px, 4vw, 50px);
    font-weight: 600;
    line-height: 1;
    letter-spacing: -0.03em;
    margin: 7px 0 10px;
    color: ${({ theme }) => theme.colors.heading};
  }
  p {
    color: var(--muted);
    line-height: 1.7;
  }
`;
export const Eyebrow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--gold);
  font-size: 10px;
  letter-spacing: 0.17em;
  text-transform: uppercase;
  font-weight: 700;
`;
export const Actions = styled.div`
  display: flex;
  gap: 9px;
  flex-wrap: wrap;
  align-items: center;
`;
export const Button = styled.button<{ $primary?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 42px;
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid
    ${({ $primary, theme }) =>
      $primary ? theme.colors.primary : "var(--line)"};
  background: ${({ $primary, theme }) =>
    $primary ? theme.colors.primary : theme.colors.background};
  color: ${({ $primary, theme }) =>
    $primary ? theme.colors.onPrimary : theme.colors.heading};
  font-weight: 600;
  font-size: 12px;
  &:hover:not(:disabled) {
    filter: brightness(0.96);
  }
  ${focus}
  svg {
    font-size: 16px;
    flex-shrink: 0;
  }
`;
export const Hero = styled.section`
  position: relative;
  isolation: isolate;
  overflow: hidden;
  border-radius: 16px;
  padding: 32px 36px;
  color: #f3eee4;
  background: #111c2c;
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(190px, 0.65fr);
  gap: 35px;
  align-items: center;
  background-image:
    linear-gradient(105deg, transparent 45%, rgba(198, 161, 91, 0.06)),
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 39px,
      #ffffff04 40px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 39px,
      #ffffff04 40px
    );
  &::after {
    content: "";
    position: absolute;
    z-index: -1;
    width: 420px;
    height: 420px;
    border: 1px solid #c6a15b25;
    border-radius: 50%;
    right: -70px;
    top: -160px;
    box-shadow:
      0 0 0 55px #c6a15b08,
      0 0 0 110px #c6a15b05;
  }
  h2 {
    font-family: ${({ theme }) => theme.fonts.title};
    font-weight: 500;
    font-size: clamp(30px, 3vw, 43px);
    line-height: 1.1;
    margin: 17px 0 12px;
    letter-spacing: -0.02em;
    color: #f3eee4;
  }
  h2 em {
    color: #d4b06a;
    font-weight: 500;
  }
  p {
    max-width: 500px;
    color: #c1c7d0;
    font-size: 12px;
    line-height: 1.85;
  }
  @media (max-width: 680px) {
    padding: 25px;
    grid-template-columns: 1fr;
    gap: 25px;
  }
`;
export const HeroNumber = styled.div`
  border-left: 1px solid #ffffff25;
  padding-left: 35px;
  > span {
    text-transform: uppercase;
    letter-spacing: 0.13em;
    font-size: 10px;
    color: #d4b06a;
  }
  strong {
    display: block;
    font-family: ${({ theme }) => theme.fonts.title};
    font-size: clamp(55px, 6vw, 86px);
    font-weight: 500;
    line-height: 1.1;
    font-variant-numeric: tabular-nums;
  }
  small {
    display: block;
    color: #c1c7d0;
    font-size: 11px;
    line-height: 1.8;
  }
  @media (max-width: 680px) {
    border-left: 0;
    border-top: 1px solid #ffffff25;
    padding: 20px 0 0;
  }
`;
export const Status = styled.span<{ $ready?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border: 1px solid #ffffff28;
  border-radius: 5px;
  color: #e7e9ec;
  font-size: 10px;
  letter-spacing: 0.05em;
  &::before {
    content: "";
    width: 6px;
    height: 6px;
    background: ${({ $ready }) => ($ready ? "#92C9AC" : "#D4B06A")};
    border-radius: 50%;
  }
`;
export const FilterBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  > span {
    font-size: 11px;
    color: var(--muted);
    display: flex;
    gap: 6px;
    align-items: center;
  }
`;
export const Segments = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  gap: 4px;
  background: ${({ theme }) => theme.colors.surface};
  padding: 5px;
  border: 1px solid var(--line);
  border-radius: 10px;
  button {
    min-height: 36px;
    border: 0;
    background: transparent;
    color: var(--muted);
    padding: 8px 13px;
    border-radius: 6px;
    font-size: 12px;
    ${focus}
  }
  button[aria-pressed="true"] {
    color: ${({ theme }) => theme.colors.heading};
    background: ${({ theme }) => theme.colors.background};
    box-shadow: 0 1px 4px #00000012;
    font-weight: 600;
  }
  @media (max-width: 480px) {
    width: 100%;
    button {
      flex: 1 1 auto;
      padding: 9px;
    }
  }
`;
export const CustomRange = styled.form`
  display: flex;
  align-items: end;
  flex-wrap: wrap;
  gap: 12px;
  padding: 17px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid var(--line);
  border-radius: 10px;
  label {
    flex: 1 1 160px;
    display: grid;
    gap: 7px;
    color: var(--muted);
    font-size: 12px;
  }
  input {
    width: 100%;
    min-width: 0;
    border: 1px solid var(--line);
    border-radius: 7px;
    padding: 10px;
    min-height: 42px;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.heading};
    color-scheme: ${({ theme }) => theme.mode};
    ${focus}
  }
  p {
    flex-basis: 100%;
    color: ${({ theme }) => (theme.mode === "light" ? "#A82B36" : "#FDA4AF")};
    font-size: 12px;
  }
`;
export const Metrics = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 420px) {
    grid-template-columns: 1fr;
  }
`;
export const Metric = styled.article`
  min-width: 0;
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 20px;
  background: ${({ theme }) => theme.colors.background};
  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    color: var(--muted);
    font-size: 12px;
  }
  svg {
    color: var(--gold);
    font-size: 18px;
  }
  strong {
    display: block;
    margin: 18px 0 12px;
    color: ${({ theme }) => theme.colors.heading};
    font-size: 30px;
    font-weight: 600;
    letter-spacing: -0.04em;
    overflow-wrap: anywhere;
    font-variant-numeric: tabular-nums;
  }
  small {
    color: var(--muted);
    font-size: 10px;
    line-height: 1.7;
  }
`;
export const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(0, 1fr);
  gap: 20px;
  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
`;
export const ThreeColumns = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  @media (max-width: 1150px) {
    grid-template-columns: 1fr;
  }
`;
export const Panel = styled.section`
  min-width: 0;
  padding: 23px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.background};
  h2 {
    font-family: ${({ theme }) => theme.fonts.body};
    font-size: 15px;
    font-weight: 600;
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.heading};
  }
  @media (max-width: 480px) {
    padding: 18px;
  }
`;
export const PanelHeader = styled.div`
  display: flex;
  align-items: start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 22px;
  p {
    font-size: 11px;
    line-height: 1.7;
    color: var(--muted);
    margin-top: 5px;
  }
  select {
    color: ${({ theme }) => theme.colors.heading};
    border: 1px solid var(--line);
    border-radius: 7px;
    padding: 8px 28px 8px 10px;
    background: ${({ theme }) => theme.colors.surface};
    min-height: 38px;
    font-size: 12px;
    ${focus}
  }
`;
export const ChartBox = styled.div`
  position: relative;
  min-width: 0;
  [role="slider"] {
    position: relative;
    padding-left: 32px;
    border-radius: 8px;
    touch-action: pan-y;
    ${focus}
  }
  svg {
    display: block;
    width: 100%;
    height: 225px;
    overflow: visible;
  }
`;
export const ChartAxis = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 30px;
  height: 225px;
  color: var(--muted);
  font-size: 10px;
  font-variant-numeric: tabular-nums;
  span {
    position: absolute;
    right: 0;
    transform: translateY(-50%);
  }
`;
export const ChartReadout = styled.div`
  display: flex;
  align-items: baseline;
  gap: 9px;
  flex-wrap: wrap;
  min-height: 30px;
  margin-bottom: 10px;
  color: var(--muted);
  font-size: 11px;
  strong {
    color: ${({ theme }) => theme.colors.heading};
    font-size: 17px;
  }
`;
export const ChartLabels = styled.div`
  display: flex;
  justify-content: space-between;
  color: var(--muted);
  font-size: 10px;
  margin: 12px 0 0 35px;
  gap: 10px;
`;
export const ChartFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 20px;
  font-size: 10px;
  color: var(--muted);
  label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 30px;
  }
  input {
    accent-color: ${({ theme }) => theme.colors.primary};
    ${focus}
  }
`;
export const Notice = styled.div<{ $danger?: boolean }>`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 16px 18px;
  border-radius: 10px;
  font-size: 12px;
  line-height: 1.8;
  background: ${({ $danger, theme }) =>
    $danger ? theme.colors.feedback.danger.light : theme.colors.accentSoft};
  color: ${({ $danger, theme }) =>
    $danger
      ? theme.mode === "light"
        ? "#91222D"
        : "#FDA4AF"
      : theme.colors.heading};
  > svg {
    margin-top: 3px;
    flex-shrink: 0;
    font-size: 18px;
    color: inherit;
  }
  strong {
    font-weight: 600;
    display: block;
  }
  p {
    margin-top: 4px;
  }
`;
export const State = styled(Panel)`
  text-align: center;
  padding: 45px 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  > svg {
    color: var(--gold);
    font-size: 32px;
  }
  h2 {
    font-family: ${({ theme }) => theme.fonts.title};
    font-size: 30px;
  }
  p {
    max-width: 580px;
    font-size: 12px;
    line-height: 1.9;
    color: var(--muted);
  }
`;
export const Search = styled.input`
  display: block;
  width: 100%;
  min-width: 0;
  border: 1px solid var(--line);
  border-radius: 7px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.heading};
  min-height: 40px;
  padding: 9px 12px;
  margin: 16px 0;
  ${focus}
`;
export const Ranking = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 17px;
  li {
    min-width: 0;
  }
`;
export const RankTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 15px;
  line-height: 1.5;
  margin-bottom: 7px;
  font-size: 12px;
  > div {
    min-width: 0;
  }
  strong {
    font-weight: 500;
    color: ${({ theme }) => theme.colors.heading};
    overflow-wrap: anywhere;
  }
  small {
    display: block;
    font-size: 10px;
    color: var(--muted);
    overflow-wrap: anywhere;
    margin-top: 3px;
  }
  > span {
    white-space: nowrap;
    text-align: right;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    color: ${({ theme }) => theme.colors.heading};
  }
`;
export const Bar = styled.div<{ $percent: number; $secondary?: boolean }>`
  height: 4px;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 4px;
  overflow: hidden;
  &::after {
    content: "";
    display: block;
    height: 100%;
    width: ${({ $percent }) => `${Math.max(0, Math.min(100, $percent))}%`};
    background: ${({ $secondary, theme }) =>
      $secondary
        ? theme.mode === "light"
          ? "#5B778B"
          : "#87AFC9"
        : "var(--gold)"};
    border-radius: inherit;
  }
`;
export const Empty = styled.p`
  color: var(--muted);
  padding: 25px 0;
  line-height: 1.8;
  text-align: center;
  font-size: 12px;
`;
export const InsightList = styled.div`
  display: grid;
  gap: 20px;
  article {
    display: flex;
    gap: 13px;
  }
  svg {
    flex-shrink: 0;
    margin-top: 3px;
    color: var(--gold);
    font-size: 18px;
  }
  h3 {
    font-family: ${({ theme }) => theme.fonts.body};
    font-size: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.heading};
    margin-bottom: 6px;
  }
  p {
    color: var(--muted);
    font-size: 11px;
    line-height: 1.9;
  }
`;
export const Methodology = styled.details`
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 18px 22px;
  background: ${({ theme }) => theme.colors.surface};
  font-size: 12px;
  color: var(--muted);
  line-height: 1.9;
  summary {
    cursor: pointer;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.heading};
    ${focus}
  }
  dl {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px 30px;
    margin: 20px 0 0;
  }
  dt {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.heading};
    margin-bottom: 5px;
  }
  dd {
    margin: 0;
    font-size: 11px;
  }
  @media (max-width: 650px) {
    dl {
      grid-template-columns: 1fr;
    }
  }
`;
const shimmer = keyframes`from { background-position: 200% 0; } to { background-position: -200% 0; }`;
export const Skeleton = styled.div<{ $height: number }>`
  width: 100%;
  height: ${({ $height }) => $height}px;
  border-radius: 10px;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.surface} 25%,
    ${({ theme }) => theme.colors.accentSoft} 50%,
    ${({ theme }) => theme.colors.surface} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.6s infinite;
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;
export const Footer = styled.footer`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  padding: 0 0 14px;
  font-size: 10px;
  color: var(--muted);
  line-height: 1.8;
  span:first-child {
    display: inline-flex;
    align-items: center;
    gap: 7px;
  }
  span:last-child {
    margin-left: auto;
  }
`;
