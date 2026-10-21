import styled from "styled-components";

export const Container = styled.a`
  display: flex;
  flex-direction: column;
  width: 340px;
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

export const Cover = styled.div<{ $dossier: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: 252px;
  padding: 50px 26px 26px;
  background:
    radial-gradient(
      ellipse at 70% 25%,
      ${({ theme }) => theme.colors.accentGlow},
      transparent 70%
    ),
    ${({ $dossier, theme }) => ($dossier ? "#1c322e" : theme.colors.secondary)};
`;

export const CoverLabel = styled.span`
  position: absolute;
  top: 21px;
  left: 22px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors.onSecondary};
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;

  svg {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 13px;
  }
`;

export const Volume = styled.span`
  position: absolute;
  top: 16px;
  right: 22px;
  max-width: 42%;
  overflow: hidden;
  padding: 6px 8px;
  border: 1px solid rgba(198, 161, 91, 0.3);
  border-radius: 3px;
  color: ${({ theme }) => theme.colors.onSecondary};
  font-size: 9px;
  line-height: 1.2;
  letter-spacing: 0.6px;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Issue = styled.div`
  position: relative;
  max-width: 100%;
  min-width: 0;
  z-index: 1;
  line-height: 0;
  transform: rotate(-3deg);
  transition: transform 0.4s ease;

  &::before,
  &::after {
    content: "";
    position: absolute;
    z-index: -1;
    border: 1px solid rgba(17, 24, 39, 0.12);
    background: #e8e1d2;
    pointer-events: none;
  }

  &::before {
    inset: 4px -5px -4px 5px;
    transform: rotate(3deg);
  }

  &::after {
    inset: 2px -2px -2px 2px;
    background: #f3eee4;
    transform: rotate(1.5deg);
  }

  img {
    display: block;
    width: auto;
    height: auto;
    max-width: min(100%, 244px);
    max-height: 190px;
    padding: 3px;
    background: #fcfaf5;
    box-shadow: 8px 12px 22px rgba(0, 0, 0, 0.3);
  }

  ${Container}:hover &,
  ${Container}:focus-visible & {
    transform: translateY(-3px) rotate(-1deg);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &,
    ${Container}:hover &,
    ${Container}:focus-visible & {
      transform: none;
    }
  }
`;

export const FallbackCover = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  width: 190px;
  max-width: 100%;
  height: 178px;
  padding: 22px;
  border-left: 3px solid ${({ theme }) => theme.colors.primary};
  background: #fcfaf5;
  box-shadow: 8px 12px 22px rgba(0, 0, 0, 0.3);

  svg {
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.primary};
    font-size: 27px;
    stroke-width: 1;
  }

  span {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    font-family: ${({ theme }) => theme.fonts.title};
    font-size: 20px;
    line-height: 1.2;
    letter-spacing: 0;
    text-align: center;
  }
`;

export const Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 14px;
  min-height: 220px;
  padding: 24px;
`;

export const Journal = styled.span`
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  padding-left: 10px;
  border-left: 2px solid ${({ theme }) => theme.colors.primary};
  color: #6a706b;
  font-size: 9px;
  font-weight: 600;
  line-height: 1.6;
  letter-spacing: 1.1px;
  text-transform: uppercase;
`;

export const Title = styled.h3`
  display: -webkit-box;
  min-height: 2.3em;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  font-family: ${({ theme }) => theme.fonts.title};
  font-size: 25px;
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: 0.1px;
  overflow-wrap: anywhere;
`;

export const Author = styled.p`
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: #6a706b;
  font-size: 12px;
  line-height: 1.6;
  letter-spacing: 0.1px;
  overflow-wrap: anywhere;
`;

export const Citation = styled.span`
  overflow: hidden;
  color: #6a706b;
  font-size: 10px;
  line-height: 1.5;
  letter-spacing: 0;
  text-overflow: ellipsis;
  white-space: nowrap;

  span {
    margin-right: 7px;
    color: ${({ theme }) => theme.colors.secondary};
    font-size: 8px;
    font-weight: 600;
    letter-spacing: 1px;
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

export const Year = styled.span`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;

  span {
    color: #6a706b;
    font-size: 8px;
    font-weight: 500;
    letter-spacing: 1.3px;
    text-transform: uppercase;
  }
`;

export const ReadMore = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0;
  white-space: nowrap;
`;

export const LinkArrow = styled.span`
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 30px;
  height: 30px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  font-size: 17px;
  transition: background 0.25s ease;

  svg {
    transition: transform 0.25s ease;
  }

  ${Container}:hover &,
  ${Container}:focus-visible & {
    background: ${({ theme }) => theme.colors.primary};

    svg {
      transform: translate(1px, -1px);
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
