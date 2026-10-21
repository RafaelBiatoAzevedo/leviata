import styled from "styled-components";

export const Container = styled.article`
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 32px 24px;

  border-radius: 1.4rem;

  text-decoration: none;

  position: relative;

  overflow: hidden;

  background: ${({ theme }) => theme.colors.surface};

  border: 1px solid ${({ theme }) => theme.colors.border};

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
  }
`;

export const ProfileImage = styled.div`
  width: 150px;
  min-height: 150px;

  border-radius: 50%;

  overflow: hidden;

  border: 2px solid ${({ theme }) => theme.colors.accent};

  box-shadow: 0 0 20px ${({ theme }) => theme.colors.accentGlow};

  margin-bottom: 24px;

  position: relative;

  z-index: 2;

  img {
    width: 100%;
    height: 100%;

    object-fit: cover;

    transition: transform 0.5s ease;
  }
`;

export const Content = styled.div`
  display: flex;
  width: 100%;
  min-width: 0;
  height: 100%;
  flex-direction: column;
  align-items: center;

  gap: 1.2rem;

  text-align: center;
`;

export const Name = styled.h3`
  color: ${({ theme }) => theme.colors.text};

  font-size: 1.5rem;

  line-height: 1.2;
`;

export const ProfileLink = styled.a`
  color: inherit;
  text-decoration: none;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 3;
    border-radius: 18px;
  }

  &:focus-visible {
    outline: none;
  }

  &:focus-visible::after {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: -4px;
  }
`;

export const Category = styled.h4`
  color: ${({ theme }) => theme.colors.primary};

  font-size: 1rem;

  text-transform: uppercase;

  line-height: 1.2;

  &:last-child {
    margin-top: auto;
  }
`;

export const Biography = styled.div`
  position: relative;
  z-index: 4;
  width: 100%;
  max-width: 320px;
  flex: 1;
`;

export const Description = styled.p<{ $expanded: boolean }>`
  color: ${({ theme }) => theme.colors.textSoft};
  text-align: justify;

  line-height: 1.8;

  font-size: 0.95rem;

  max-width: 320px;

  display: ${({ $expanded }) => ($expanded ? "block" : "-webkit-box")};
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${({ $expanded }) => ($expanded ? "unset" : "8")};

  padding-bottom: ${({ $expanded }) => ($expanded ? "1.8rem" : "0")};

  overflow: hidden;

  overflow-wrap: break-word;

  white-space: pre-line;
`;

export const BioToggle = styled.button`
  position: absolute;
  right: 0;
  bottom: 0;

  border: 0;
  padding: 0 0 0 8px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.accent};
  box-shadow: -12px 0 12px ${({ theme }) => theme.colors.surface};

  font: inherit;
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.8;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
    border-radius: 2px;
  }
`;
