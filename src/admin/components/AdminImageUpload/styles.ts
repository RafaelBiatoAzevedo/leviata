import styled, { css } from "styled-components";
import { imageVariants, type ImageVariant } from "../AdminImageEditor/types";

interface PreviewProps {
  $variant: ImageVariant;
  $dragging?: boolean;
}

const compactWidth = ({ $variant }: PreviewProps) =>
  $variant === "portrait"
    ? "160px"
    : $variant === "landscape"
      ? "360px"
      : "180px";

export const Container = styled.div<{ $formatSide?: boolean }>`
  min-width: 0;
  max-width: 100%;
  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 1rem;

  ${({ $formatSide }) =>
    $formatSide &&
    css`
      display: grid;
      grid-template-columns: 104px minmax(0, 1fr);
      align-items: start;
      gap: 18px;
      width: 100%;

      @media (max-width: 480px) {
        display: flex;
        align-items: stretch;
      }
    `}
`;

export const PreviewColumn = styled.div`
  min-width: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

export const HiddenInput = styled.input`
  display: none;
`;

export const FormatSelector = styled.fieldset<{ $side?: boolean }>`
  width: ${({ $side }) => ($side ? "104px" : "340px")};
  max-width: 100%;
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;

  legend {
    margin-bottom: 10px;
    padding: 0;
    color: ${({ theme }) => theme.colors.text};
    font-size: 13px;
    font-weight: 600;
  }

  @media (max-width: 480px) {
    width: 340px;
  }
`;

export const FormatOptions = styled.div<{ $side?: boolean }>`
  display: grid;
  grid-template-columns: ${({ $side }) =>
    $side ? "minmax(0, 1fr)" : "repeat(3, minmax(0, 1fr))"};
  gap: 6px;
  @media (max-width: 480px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

export const FormatOption = styled.button<{ $side?: boolean }>`
  position: relative;
  min-width: 0;
  min-height: ${({ $side }) => ($side ? "88px" : "108px")};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
  padding: 16px 5px 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textSoft};
  font-family: inherit;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease;

  strong {
    color: ${({ theme }) => theme.colors.heading};
    font-size: 12px;
    font-weight: 500;
  }

  > span:last-child {
    font-size: 10px;
    font-variant-numeric: tabular-nums;
    line-height: 1.3;
  }

  > svg {
    position: absolute;
    top: 7px;
    right: 7px;
    width: 12px;
    height: 12px;
    color: ${({ theme }) => theme.colors.heading};
  }

  &[aria-pressed="true"] {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.accentSoft};
    color: ${({ theme }) => theme.colors.primary};
    box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.primary};
  }

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 3px;
  }

  &:disabled {
    cursor: progress;
    opacity: 0.6;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const FormatShape = styled.span<{ $variant: ImageVariant }>`
  display: block;
  flex-shrink: 0;
  width: ${({ $variant }) =>
    $variant === "landscape"
      ? "44px"
      : $variant === "square"
        ? "30px"
        : "20px"};
  aspect-ratio: ${({ $variant }) => imageVariants[$variant].aspect};
  margin-block: auto 5px;
  border: 1.5px solid currentColor;
  border-radius: 4px;
  background:
    linear-gradient(
      145deg,
      transparent 45%,
      currentColor 46% 49%,
      transparent 50%
    ),
    linear-gradient(
      35deg,
      transparent 50%,
      currentColor 51% 54%,
      transparent 55%
    );
`;

export const FormatHint = styled.p`
  margin-top: 8px;
  color: ${({ theme }) => theme.colors.textSoft};
  font-size: 11px;
  line-height: 1.5;
`;

export const Preview = styled.button<PreviewProps>`
  position: relative;
  padding: 0;
  display: grid;
  place-items: center;
  max-width: 100%;
  width: 100%;
  min-width: 0;

  width: ${({ $variant }) => {
    switch ($variant) {
      case "portrait":
        return "280px";

      case "landscape":
        return "500px";

      case "square":
      default:
        return "250px";
    }
  }};

  aspect-ratio: ${({ $variant }) => {
    switch ($variant) {
      case "portrait":
        return "3 / 4.5";

      case "landscape":
        return "16 / 9";

      case "square":
      default:
        return "1 / 1";
    }
  }};

  overflow: hidden;

  border-radius: 12px;

  cursor: pointer;

  border: 2px dashed ${({ theme }) => theme.colors.border};

  background: ${({ theme }) => theme.colors.surface};

  transition: 0.2s ease;

  @container admin-content (max-width: 760px) {
    width: ${compactWidth};
  }

  @media (max-width: 900px) {
    width: ${compactWidth};
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 4px;
  }
  &:disabled {
    cursor: progress;
    opacity: 0.6;
  }
  &:has(img) {
    border-style: solid;
  }
  ${({ $dragging, theme }) =>
    $dragging &&
    `border-color: ${theme.colors.primary}; background: ${theme.colors.accentSoft};`}
`;

export const PreviewImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;

  height: 100%;

  object-fit: contain;

  display: block;
`;

export const Placeholder = styled.div`
  width: 100%;

  height: 100%;

  display: flex;

  flex-direction: column;

  justify-content: center;

  align-items: center;

  gap: 0.75rem;

  color: ${({ theme }) => theme.colors.text};

  svg {
    opacity: 0.7;
  }

  span {
    font-size: 0.9rem;
  }
`;

export const ChangeButton = styled.button`
  min-height: 44px;
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 6px;

  padding: 10px 12px;

  border: none;

  border-radius: 8px;

  background: ${({ theme }) => theme.colors.primary};

  color: ${({ theme }) => theme.colors.onPrimary};

  cursor: pointer;

  font-size: 12px;
  font-weight: 600;
  line-height: 1.4;
  min-width: 0;
  svg {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
  }

  transition: 0.2s;

  &:hover {
    opacity: 0.9;
  }
  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 3px;
  }
  &:disabled {
    cursor: progress;
    opacity: 0.6;
  }
`;

export const Actions = styled.div<{ $hasImage?: boolean }>`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  width: 100%;
  max-width: 280px;
  > :only-child {
    grid-column: 1 / -1;
  }

  ${({ $hasImage, theme }) =>
    $hasImage &&
    css`
      display: inline-flex;
      width: auto;
      max-width: 100%;
      gap: 2px;
      padding: 3px;
      border: 1px solid ${theme.colors.accentGlow};
      border-radius: 9px;
      background: ${theme.colors.surface};

      > button {
        min-height: 32px;
        padding: 6px 10px;
        border: 0;
        border-radius: 6px;
        background: transparent;
        color: ${theme.colors.heading};
        font-size: 12px;
        font-weight: 500;
        line-height: 1.2;
        letter-spacing: 0;
        white-space: nowrap;

        svg {
          width: 14px;
          height: 14px;
        }

        &:hover:not(:disabled) {
          background: ${theme.colors.accentSoft};
          opacity: 1;
        }

        &:focus-visible {
          outline: 2px solid ${theme.colors.primary};
          outline-offset: 1px;
        }
      }

      > button + button {
        border-left: 1px solid ${theme.colors.accentGlow};
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }

      @media (max-width: 600px), (pointer: coarse) {
        > button {
          min-height: 44px;
        }
      }
    `}
`;

export const EditButton = styled(ChangeButton)`
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: transparent;
  color: ${({ theme }) => theme.colors.heading};
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.accentSoft};
  }
`;

export const PreviewOverlay = styled.span`
  position: absolute;
  inset: auto 0 0;
  min-height: 44px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  background: linear-gradient(transparent, rgb(0 0 0 / 85%));
  color: ${({ theme }) => theme.colors.primary};
  opacity: 0;
  transition: opacity 0.2s;
  ${Preview}:hover &, ${Preview}:focus-visible & {
    opacity: 1;
  }
  @media (pointer: coarse) {
    opacity: 1;
  }
`;

export const DropHint = styled.span`
  position: absolute;
  inset: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  font-weight: 600;
  pointer-events: none;
  svg {
    width: 32px;
    height: 32px;
  }
`;
