import styled from "styled-components";

export const Container = styled.figure`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  margin: 0;

  overflow: hidden;

  border-radius: 12px;

  text-decoration: none;

  background: ${({ theme }) => theme.colors.surface};

  border: 1px solid ${({ theme }) => theme.colors.primary}40;

  position: relative;

  transition:
    transform 0.35s ease,
    border-color 0.35s ease,
    box-shadow 0.35s ease;

  &:hover {
    transform: translateY(-8px);

    border-color: ${({ theme }) => theme.colors.accent};

    box-shadow:
      0 20px 40px rgba(0, 0, 0, 0.45),
      0 0 25px ${({ theme }) => theme.colors.accentGlow};
  }

  &:hover img {
    transform: scale(1.05);
  }

  &:hover::before {
    opacity: 1;
  }

  &::before {
    content: "";

    position: absolute;
    inset: 0;

    background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.04));

    opacity: 0;

    transition: opacity 0.35s ease;

    pointer-events: none;

    z-index: 1;
  }
`;

export const Cover = styled.div`
  width: 100%;
  aspect-ratio: 1;
  flex-shrink: 0;

  overflow: hidden;

  background: ${({ theme }) => theme.colors.backgroundCard};

  img {
    display: block;
    width: 100%;
    height: 100%;

    object-fit: contain;

    transition: transform 0.5s ease;
  }
`;

export const Content = styled.figcaption`
  display: flex;
  flex-direction: column;

  gap: 12px;

  padding: 20px;

  z-index: 2;
`;

export const Description = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textSoft};
  text-align: left;

  line-height: 1.6;
  white-space: pre-line;
  overflow-wrap: anywhere;

  font-size: 0.95rem;
`;

export const Title = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  font-family: ${({ theme }) => theme.fonts.title};
  font-size: 1.25rem;
  line-height: 1.4;
  overflow-wrap: anywhere;
`;
