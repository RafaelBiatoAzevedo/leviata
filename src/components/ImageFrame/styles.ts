import styled from "styled-components";

export const Frame = styled.div<{ $maxWidth: string }>`
  position: relative;
  width: 100%;
  max-width: ${({ $maxWidth }) => $maxWidth};
  min-width: 0;
  margin-block: 10px;
  padding: clamp(16px, 2.5vw, 28px);
  border: 3px double ${({ theme }) => theme.colors.primary};
  border-radius: 2px;
  background:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 3px,
      rgba(116, 81, 34, 0.025) 3px,
      rgba(116, 81, 34, 0.025) 4px
    ),
    ${({ theme }) => theme.colors.surface};
  box-shadow:
    0 6px 20px rgba(64, 43, 19, 0.08),
    inset 0 0 24px ${({ theme }) => theme.colors.primary}0D;

  &::before {
    content: "";
    position: absolute;
    inset: 6px;
    border: 1px solid ${({ theme }) => theme.colors.primary}50;
    pointer-events: none;
  }
`;

export const Ornament = styled.span<{ $position: "top" | "bottom" }>`
  position: absolute;
  z-index: 1;
  left: 50%;
  ${({ $position }) => $position}: -13px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 22px;
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.surface};
  font-family: ${({ theme }) => theme.fonts.title};
  font-size: 25px;
  line-height: 1;
  transform: translateX(-50%)
    ${({ $position }) => ($position === "bottom" ? "rotate(180deg)" : "")};
  pointer-events: none;
`;

export const Mat = styled.div`
  min-width: 0;
  padding: clamp(5px, 1vw, 9px);
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.primary}30;
  border-radius: 0;
  background: ${({ theme }) => theme.colors.background};
`;

export const Picture = styled.img<{ $maxHeight: string }>`
  display: block;
  width: 100%;
  max-width: 100%;
  height: auto;
  max-height: ${({ $maxHeight }) => $maxHeight};
  object-fit: contain;
  border-radius: 0;
`;
