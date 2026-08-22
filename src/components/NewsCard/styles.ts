import styled from "styled-components";

export const Container = styled.a`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  overflow: hidden;

  border-radius: 12px;

  text-decoration: none;

  background: ${({ theme }) => theme.colors.secondary};

  border: 1px solid rgba(255, 255, 255, 0.06);

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
  height: 240px;

  overflow: hidden;

  background: ${({ theme }) => theme.colors.backgroundCard};

  img {
    width: 100%;
    height: 100%;

    object-fit: contain;

    transition: transform 0.5s ease;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;

  gap: 12px;

  padding: 20px;

  z-index: 2;
`;

export const DateText = styled.span`
  color: ${({ theme }) => theme.colors.accent};

  font-size: 0.85rem;

  letter-spacing: 1px;

  text-transform: uppercase;
`;

export const Title = styled.h3`
  color: white;

  font-size: 1.5rem;

  line-height: 1.3;

  font-family: ${({ theme }) => theme.fonts.title};
`;

export const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSoft};

  line-height: 1.8;

  font-size: 0.95rem;
`;
