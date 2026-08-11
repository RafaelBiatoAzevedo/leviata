import styled from "styled-components";

type ImageVariant = "portrait" | "landscape" | "square";

interface PreviewProps {
  $variant: ImageVariant;
}

export const Container = styled.div`
  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 1rem;
`;

export const HiddenInput = styled.input`
  display: none;
`;

export const Preview = styled.div<PreviewProps>`
  width: 100%;

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

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const PreviewImage = styled.img`
  width: 100%;

  height: 100%;

  object-fit: cover;

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
  display: flex;

  align-items: center;

  gap: 0.5rem;

  padding: 0.7rem 1rem;

  border: none;

  border-radius: 8px;

  background: ${({ theme }) => theme.colors.primary};

  color: ${({ theme }) => theme.colors.text};

  cursor: pointer;

  font-size: 0.9rem;

  transition: 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;
