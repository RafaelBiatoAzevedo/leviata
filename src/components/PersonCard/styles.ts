import styled, { css } from "styled-components";

const focus = css`
  &:focus-visible {
    outline: 2px solid var(--person-accent);
    outline-offset: 3px;
  }
`;

export const Container = styled.article`
  --person-accent: ${({ theme }) =>
    theme.mode === "dark" ? "#D4B06A" : "#805C24"};
  --person-muted: ${({ theme }) =>
    theme.mode === "dark" ? "#B2BBCA" : "#626973"};
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  height: 100%;
  padding: clamp(22px, 2.2vw, 30px);
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.primary}45;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: 0 4px 16px
    ${({ theme }) => (theme.mode === "dark" ? "#00000016" : "#48351706")};
  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
  &::before {
    content: "";
    position: absolute;
    inset: 0 0 auto;
    height: 3px;
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.colors.primary},
      ${({ theme }) => theme.colors.primary}20
    );
    pointer-events: none;
  }
  &:hover,
  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 14px 30px
      ${({ theme }) => (theme.mode === "dark" ? "#00000038" : "#48351712")};
  }
  @media (hover: hover) {
    &:hover {
      transform: translateY(-3px);
    }
    &:hover img {
      transform: scale(1.035);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    &,
    img {
      transition: none;
      transform: none !important;
    }
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 22px;
  > div:last-child {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 16px;
    min-width: 0;
  }
`;

export const ProfileImage = styled.div`
  position: relative;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 104px;
  height: 104px;
  aspect-ratio: 1;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.primary}90;
  border-radius: 50%;
  outline: 1px solid ${({ theme }) => theme.colors.primary}25;
  outline-offset: 5px;
  background: ${({ theme }) => theme.colors.accentSoft};
  img {
    position: absolute;
    inset: 0;
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 30%;
    transition: transform 0.35s ease;
  }
`;

export const Initials = styled.span`
  color: var(--person-accent);
  font-family: ${({ theme }) => theme.fonts.title};
  font-size: 40px;
  line-height: 1;
  letter-spacing: -0.03em;
`;

export const Category = styled.span`
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  padding: 6px 9px;
  border: 1px solid ${({ theme }) => theme.colors.primary}30;
  border-radius: 5px;
  background: ${({ theme }) => theme.colors.accentSoft};
  color: var(--person-accent);
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 11px;
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: 0.07em;
  overflow-wrap: anywhere;
`;

export const Ornament = styled.span`
  display: block;
  padding-right: 6px;
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.fonts.title};
  font-size: 35px;
  line-height: 1;
  opacity: 0.65;
`;

export const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-width: 0;
  gap: 17px;
`;

export const Name = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.heading};
  font-family: ${({ theme }) => theme.fonts.title};
  font-size: clamp(25px, 2vw, 29px);
  font-weight: 600;
  line-height: 1.18;
  letter-spacing: -0.025em;
  overflow-wrap: anywhere;
  text-wrap: pretty;
`;

export const Affiliation = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 9px;
  min-width: 0;
  > svg {
    flex-shrink: 0;
    width: 15px;
    height: 15px;
    margin-top: 3px;
    color: var(--person-accent);
  }
  > div {
    min-width: 0;
  }
  strong {
    display: block;
    color: ${({ theme }) => theme.colors.heading};
    font-size: 12px;
    font-weight: 600;
    line-height: 1.7;
    letter-spacing: 0.02em;
    overflow-wrap: anywhere;
  }
  span {
    display: block;
    color: var(--person-muted);
    font-size: 12px;
    line-height: 1.7;
    letter-spacing: normal;
    overflow-wrap: anywhere;
  }
`;

export const Biography = styled.div`
  position: relative;
  z-index: 2;
  min-width: 0;
`;

export const Description = styled.p<{ $expanded: boolean }>`
  margin: 0;
  color: var(--person-muted);
  font-size: 14px;
  line-height: 1.85;
  letter-spacing: normal;
  text-align: left;
  white-space: pre-line;
  overflow-wrap: anywhere;
  overflow: hidden;
  display: ${({ $expanded }) => ($expanded ? "block" : "-webkit-box")};
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${({ $expanded }) => ($expanded ? "unset" : "4")};
`;

export const BioToggle = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 44px;
  margin-top: 4px;
  padding: 6px 0;
  border: 0;
  background: transparent;
  color: var(--person-accent);
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  font-weight: 600;
  line-height: 1.5;
  cursor: pointer;
  svg {
    flex-shrink: 0;
    font-size: 14px;
  }
  &:hover {
    text-decoration: underline;
    text-underline-offset: 4px;
  }
  ${focus}
`;

export const CardFooter = styled.footer`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  min-width: 0;
  margin-top: 22px;
  padding-top: 17px;
  border-top: 1px solid ${({ theme }) => theme.colors.primary}30;
`;

export const ProfileLink = styled.a`
  flex: 1 1 130px;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  min-height: 44px;
  padding: 8px 0;
  color: var(--person-accent);
  font-size: 12px;
  font-weight: 600;
  line-height: 1.5;
  text-decoration: none;
  svg {
    flex-shrink: 0;
    font-size: 16px;
  }
  > svg:last-child {
    margin-left: auto;
  }
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 1;
    border-radius: 14px;
  }
  &:focus-visible {
    outline: none;
  }
  &:focus-visible::after {
    outline: 2px solid var(--person-accent);
    outline-offset: -5px;
  }
`;

export const SecondaryLink = styled.a`
  position: relative;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border: 1px solid ${({ theme }) => theme.colors.primary}35;
  border-radius: 7px;
  background: ${({ theme }) => theme.colors.background};
  color: var(--person-accent);
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  > span {
    font-size: 13px;
    letter-spacing: -0.03em;
  }
  &:hover {
    background: ${({ theme }) => theme.colors.accentSoft};
    border-color: ${({ theme }) => theme.colors.primary};
  }
  ${focus}
`;
