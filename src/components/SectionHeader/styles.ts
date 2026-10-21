import styled from "styled-components";

export const Container = styled.div<{
  $center?: boolean;
}>`
  display: flex;
  flex-direction: column;
  align-items: ${({ $center }) => ($center ? "center" : "flex-start")};
  gap: 14px;
  width: 100%;
  min-width: 0;
  text-align: ${({ $center }) => ($center ? "center" : "left")};
`;

export const Title = styled.h1<{ $small?: boolean }>`
  max-width: min(100%, 30ch);
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.title};
  font-size: ${({ $small }) =>
    $small
      ? "clamp(1.7rem, 1.45rem + 1vw, 2.2rem)"
      : "clamp(2rem, 1.65rem + 1.2vw, 2.7rem)"};
  font-weight: 600;
  line-height: 1.12;
  letter-spacing: -0.02em;
  text-wrap: balance;
  overflow-wrap: anywhere;
`;

export const Ornament = styled.span`
  flex-shrink: 0;
  width: 64px;
  height: 3px;
  border-radius: 3px;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.primary} 0%,
    ${({ theme }) => theme.colors.primary} 60%,
    ${({ theme }) => theme.colors.accentSoft} 100%
  );
`;

export const Subtitle = styled.p`
  max-width: min(100%, 100ch);
  margin: 0;
  color: ${({ theme }) => theme.colors.textSoft};
  color: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.textSoft} 75%,
    ${({ theme }) => theme.colors.text}
  );
  font-size: clamp(1rem, 0.96rem + 0.2vw, 1.1rem);
  line-height: 1.8;
  letter-spacing: 0.15px;
  text-wrap: pretty;
  overflow-wrap: anywhere;
`;
