import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 900px;
  min-width: 0;
  gap: 1rem;
`;

export const Paragraph = styled.p`
  width: 100%;
  text-align: justify;
  font-size: 1.2rem;
  line-height: 1.8;

  @media (max-width: 640px) {
    text-align: left;
    font-size: 1.1rem;
  }
`;

export const InlineLink = styled.a`
  padding: 0.08em 0.35em;
  border-radius: 5px;
  background: ${({ theme }) => theme.colors.accentSoft};
  color: var(--theme-accent-text, #765a26);
  font-weight: 500;
  text-decoration: underline;
  text-decoration-color: ${({ theme }) => theme.colors.primary};
  text-underline-offset: 0.18em;
  text-decoration-thickness: 1px;
  overflow-wrap: anywhere;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
  transition:
    background 0.2s ease,
    text-decoration-color 0.2s ease;

  svg {
    display: inline;
    width: 0.85em;
    height: 0.85em;
    margin-left: 0.2em;
    vertical-align: -0.08em;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.accentGlow};
    text-decoration-color: currentColor;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 3px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;
