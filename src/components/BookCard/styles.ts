import styled from "styled-components";

export const Container = styled.a`
  display: flex;
  flex-direction: column;
  width: 290px;
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
    box-shadow:
      0 18px 36px rgba(17, 24, 39, 0.14),
      0 4px 10px rgba(17, 24, 39, 0.06);
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

export const Cover = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: 338px;
  padding: 54px 30px 30px;
  perspective: 1000px;

  background:
    radial-gradient(
      ellipse at 50% 35%,
      ${({ theme }) => theme.colors.accentGlow},
      transparent 70%
    ),
    ${({ theme }) => theme.colors.secondary};

  &::after {
    content: "";
    position: absolute;
    right: 24px;
    bottom: 24px;
    left: 24px;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      ${({ theme }) => theme.colors.primary},
      transparent
    );
    opacity: 0.3;
  }
`;

export const CoverLabel = styled.span`
  position: absolute;
  top: 22px;
  left: 22px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors.onSecondary};
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 2.5px;
  text-transform: uppercase;

  span {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary};
  }
`;

export const Book = styled.div`
  position: relative;
  z-index: 1;
  line-height: 0;
  transform: rotateY(-10deg) rotateZ(-3deg);
  transition: transform 0.45s ease;

  &::before {
    content: "";
    position: absolute;
    inset: 0 auto 0 0;
    z-index: 1;
    width: 14px;
    background: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.3),
      rgba(255, 255, 255, 0.12) 35%,
      transparent
    );
    pointer-events: none;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 3px -5px 3px auto;
    z-index: -1;
    width: 6px;
    border-radius: 0 2px 2px 0;
    background: repeating-linear-gradient(90deg, #e8e1d2 0 1px, #fcfaf5 1px 2px);
  }

  img {
    display: block;
    width: auto;
    height: auto;
    max-width: 198px;
    max-height: 254px;
    border-radius: 2px 3px 3px 2px;
    box-shadow:
      14px 18px 26px rgba(0, 0, 0, 0.4),
      0 2px 6px rgba(0, 0, 0, 0.2);
  }

  ${Container}:hover &,
  ${Container}:focus-visible & {
    transform: translateY(-5px) rotateY(-3deg) rotateZ(-1deg);
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
  gap: 22px;
  width: 182px;
  height: 248px;
  padding: 26px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  outline: 1px solid rgba(198, 161, 91, 0.25);
  outline-offset: -10px;
  background: linear-gradient(145deg, #30483e, #192c28);
  color: #f3e8ce;
  box-shadow: 14px 18px 26px rgba(0, 0, 0, 0.4);

  svg {
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.primary};
    font-size: 30px;
    stroke-width: 1;
  }

  span {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 5;
    font-family: ${({ theme }) => theme.fonts.title};
    font-size: 21px;
    line-height: 1.3;
    text-align: center;
  }
`;

export const Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 12px;
  min-height: 210px;
  padding: 22px;
`;

export const Publisher = styled.span`
  overflow: hidden;
  color: #6a706b;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 1.7px;
  text-overflow: ellipsis;
  text-transform: uppercase;
  white-space: nowrap;
`;

export const Title = styled.h3`
  display: -webkit-box;
  min-height: 2.3em;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  font-family: ${({ theme }) => theme.fonts.title};
  font-size: 24px;
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: 0.1px;
  overflow-wrap: anywhere;
`;

export const Subtitle = styled.p`
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: #6a706b;
  font-size: 12px;
  line-height: 1.5;
  letter-spacing: 0.1px;
  overflow-wrap: anywhere;
`;

export const AuthorName = styled.p`
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: #6a706b;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.6;
  letter-spacing: 0.1px;
  overflow-wrap: anywhere;
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
`;

export const LinkArrow = styled.span`
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 30px;
  height: 30px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.secondary};
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
