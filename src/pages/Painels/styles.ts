import styled, { css } from "styled-components";

export const Container = styled.div`
  width: 100%;
  margin-top: 70px;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 16rem;
  gap: 3rem;
`;

interface ITypeProps {
  $type: "mestrado" | "defesa";
}

export const Header = styled.header`
  display: flex;
  flex-direction: column;

  margin-bottom: 4rem;

  h1 {
    font-size: 2.7rem;
    font-family: ${({ theme }) => theme.fonts.title};
    color: ${({ theme }) => theme.colors.text};

    margin-bottom: 1rem;
  }

  p {
    max-width: 720px;

    font-size: 1rem;
    line-height: 1.8;

    color: ${({ theme }) => theme.colors.textSoft};
  }

  @media (max-width: 768px) {
    margin-bottom: 3rem;

    h1 {
      font-size: 2rem;
    }
  }
`;

export const Timeline = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;

  gap: 2rem;

  padding-left: 2rem;

  &::before {
    content: "";

    position: absolute;

    left: 10px;
    top: 0;
    bottom: 0;

    width: 2px;

    background: ${({ theme }) => theme.colors.border};
  }

  @media (max-width: 768px) {
    padding-left: 1.5rem;
  }
`;

export const TimelineItem = styled.div`
  position: relative;

  display: flex;
  align-items: flex-start;
  width: 900px;
`;

export const TimelineDot = styled.div<ITypeProps>`
  position: absolute;

  left: -1.91rem;
  top: 1.8rem;

  width: 20px;
  height: 20px;

  border-radius: 50%;

  border: 4px solid ${({ theme }) => theme.colors.background};

  z-index: 2;

  ${({ $type, theme }) =>
    $type === "mestrado"
      ? css`
          background: ${theme.colors.primary};
        `
      : css`
          background: #8b5cf6;
        `};

  @media (max-width: 768px) {
    left: -1.45rem;
  }
`;

export const TimelineContent = styled.div`
  width: 100%;

  padding: 2rem;

  border-radius: 18px;

  background: ${({ theme }) => theme.colors.surface};

  border: 1px solid ${({ theme }) => theme.colors.border};

  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);

  transition: 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

export const TypeBadge = styled.div<ITypeProps>`
  width: fit-content;

  padding: 0.45rem 0.9rem;

  border-radius: 999px;

  margin-bottom: 1rem;

  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;

  ${({ $type, theme }) =>
    $type === "mestrado"
      ? css`
          background: ${theme.colors.secondary};
          color: ${theme.colors.primary};
        `
      : css`
          background: rgba(139, 92, 246, 0.12);
          color: #8b5cf6;
        `};
`;

export const DateText = styled.span`
  display: block;

  margin-bottom: 1rem;

  font-size: 1rem;
  font-weight: bold;

  color: ${({ theme }) => theme.colors.primary};
`;

export const Title = styled.h2`
  font-size: 1.35rem;
  line-height: 1.6;

  margin-bottom: 2rem;

  color: ${({ theme }) => theme.colors.text};

  font-family: ${({ theme }) => theme.fonts.title};

  @media (max-width: 768px) {
    font-size: 1.15rem;
  }
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;

  margin-bottom: 1.5rem;
`;

export const Label = styled.span`
  font-size: 0.8rem;

  text-transform: uppercase;
  letter-spacing: 0.08em;

  margin-bottom: 0.5rem;

  color: ${({ theme }) => theme.colors.textSoft};
`;

export const Text = styled.p`
  font-size: 1rem;
  line-height: 1.9;

  color: ${({ theme }) => theme.colors.text};

  text-align: justify;
`;

export const Actions = styled.div`
  display: flex;

  margin-top: 2rem;
`;

export const ActionLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;

  padding: 0.9rem 1.2rem;

  border-radius: 10px;

  background: ${({ theme }) => theme.colors.primary};

  color: #fff;

  font-size: 0.92rem;
  font-weight: 500;

  text-decoration: none;

  transition: 0.2s ease;

  svg {
    font-size: 1rem;
  }

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;
