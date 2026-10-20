import styled from "styled-components";

export const Container = styled.a`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
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
  flex-shrink: 0;
  height: 244px;
  background: ${({ theme }) => theme.colors.secondary};
`;

export const ImageFrame = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
`;

export const CoverBackdrop = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(18px) brightness(0.45);
  transform: scale(1.18);
`;

export const CoverImage = styled.img`
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.5s ease;

  ${Container}:hover &,
  ${Container}:focus-visible & {
    transform: scale(1.035);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    ${Container}:hover &,
    ${Container}:focus-visible & {
      transform: none;
    }
  }
`;

export const Category = styled.span`
  position: absolute;
  top: 18px;
  left: 18px;
  display: flex;
  align-items: center;
  gap: 7px;
  max-width: calc(100% - 36px);
  padding: 8px 11px;
  border: 1px solid rgba(198, 161, 91, 0.35);
  border-radius: 3px;
  background: #fcfaf5;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 9px;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: 1.4px;
  text-transform: uppercase;

  &::before {
    content: "";
    flex-shrink: 0;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary};
  }
`;

export const DateBadge = styled.div`
  position: absolute;
  bottom: -16px;
  left: 24px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
  width: 62px;
  height: 70px;
  border: 1px solid rgba(17, 24, 39, 0.08);
  border-top: 3px solid ${({ theme }) => theme.colors.primary};
  border-radius: 3px;
  background: #fcfaf5;
  box-shadow: 0 5px 14px rgba(17, 24, 39, 0.12);

  strong {
    font-family: ${({ theme }) => theme.fonts.title};
    font-size: 34px;
    font-weight: 600;
    line-height: 1;
    letter-spacing: -1px;
  }

  span {
    color: #6a706b;
    font-size: 9px;
    font-weight: 600;
    line-height: 1.5;
    letter-spacing: 1.8px;
    text-transform: uppercase;
  }
`;

export const FallbackCover = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  height: 100%;
  padding: 48px 24px;
  background:
    repeating-linear-gradient(
      0deg,
      transparent 0 27px,
      rgba(198, 161, 91, 0.06) 27px 28px
    ),
    radial-gradient(
      ellipse at 75% 20%,
      ${({ theme }) => theme.colors.accentGlow},
      transparent 70%
    ),
    ${({ theme }) => theme.colors.secondary};
  color: #f0e8d8;

  &::after {
    content: "L.";
    position: absolute;
    right: 20px;
    bottom: -20px;
    color: ${({ theme }) => theme.colors.primary};
    font-family: ${({ theme }) => theme.fonts.title};
    font-size: 180px;
    font-style: italic;
    line-height: 1;
    opacity: 0.1;
    pointer-events: none;
  }

  svg {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 42px;
    stroke-width: 1;
  }

  span {
    font-family: ${({ theme }) => theme.fonts.title};
    font-size: 22px;
    font-weight: 500;
    letter-spacing: 0.2px;
    text-align: center;
  }
`;

export const Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 14px;
  padding: 24px;
`;

export const DateText = styled.time`
  align-self: flex-end;
  color: #6a706b;
  font-size: 9px;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: 0.2px;
`;

export const Title = styled.h3`
  display: -webkit-box;
  min-height: 2.3em;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  font-family: ${({ theme }) => theme.fonts.title};
  font-size: 26px;
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: 0.1px;
  overflow-wrap: anywhere;
`;

export const Description = styled.p`
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  color: #6a706b;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.7;
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

export const Source = styled.span`
  color: #6a706b;
  font-size: 8px;
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

export const ReadMore = styled.span`
  display: flex;
  align-items: center;
  gap: 9px;
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
  font-size: 16px;
  transition: background 0.25s ease;

  svg {
    transition: transform 0.25s ease;
  }

  ${Container}:hover &,
  ${Container}:focus-visible & {
    background: ${({ theme }) => theme.colors.primary};

    svg {
      transform: translateX(2px);
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
