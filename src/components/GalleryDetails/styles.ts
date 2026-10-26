import { portalContent } from "../../styles/portal";
import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  padding-top: var(--portal-header-height, 70px);
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  ${portalContent}
`;

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  min-width: 0;
`;

export const Cover = styled.img`
  width: min(100%, 900px);
  max-height: 600px;
  object-fit: contain;
  border-radius: 1rem;
`;

export const Links = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
  a {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

export const AccessSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 1080px;
  min-width: 0;
`;

export const AccessLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;

  a {
    display: flex;
    align-items: center;
    flex: 1 1 220px;
    gap: 12px;
    min-width: 0;
    min-height: 58px;
    padding: 16px 18px;
    border: 1px solid ${({ theme }) => theme.colors.primary}70;
    border-left: 3px solid ${({ theme }) => theme.colors.primary};
    border-radius: 2px;
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.heading};
    font-size: 14px;
    line-height: 1.5;
    text-decoration: none;
    transition:
      border-color 0.2s ease,
      background 0.2s ease;
  }

  span {
    flex: 1;
    min-width: 0;
    overflow-wrap: anywhere;
  }

  svg {
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.primary};
    font-size: 20px;
  }

  a:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.accentSoft};
  }

  a:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 3px;
  }

  @media (prefers-reduced-motion: reduce) {
    a {
      transition: none;
    }
  }
`;

export const Status = styled.div`
  min-height: 70vh;
  padding: 5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;
