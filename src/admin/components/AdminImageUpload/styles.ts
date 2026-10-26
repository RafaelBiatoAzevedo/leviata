import styled, { css } from "styled-components";
import type { ImageVariant } from "../AdminImageEditor/types";

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

export const Container = styled.div`
  min-width: 0;
  max-width: 100%;
  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 1rem;
`;

export const HiddenInput = styled.input`
  display: none;
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
