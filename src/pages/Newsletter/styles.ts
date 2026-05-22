import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  margin-top: 70px;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 16rem;
  gap: 3rem;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;

  gap: 16px;

  max-width: 900px;
`;

export const Title = styled.h1`
  font-size: 2.6rem;

  color: ${({ theme }) => theme.colors.text};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 2.2rem;
  }
`;

export const Subtitle = styled.p`
  font-size: 1.1rem;

  line-height: 1.8;

  color: ${({ theme }) => theme.colors.textSoft};
`;

export const NewslettersWrapper = styled.div`
  display: flex;
  flex-direction: column;

  gap: 48px;
`;

export const YearBlock = styled.div`
  display: flex;
  flex-direction: column;

  gap: 24px;
`;

export const YearTitle = styled.h2`
  font-size: 2rem;

  color: ${({ theme }) => theme.colors.accent};

  padding-bottom: 12px;

  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

export const NewsletterList = styled.div`
  display: grid;

  grid-template-columns: repeat(3, 1fr);

  gap: 18px;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

export const NewsletterItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 24px;

  padding: 22px 24px;

  border-radius: 14px;

  background: ${({ theme }) => theme.colors.secondary};

  border: 1px solid rgba(255, 255, 255, 0.06);

  transition:
    transform 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);

    border-color: ${({ theme }) => theme.colors.accent};

    box-shadow:
      0 10px 30px rgba(0, 0, 0, 0.35),
      0 0 20px ${({ theme }) => theme.colors.accentGlow};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const NewsletterInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const NewsletterMonth = styled.span`
  font-size: 1.1rem;

  color: ${({ theme }) => theme.colors.text};
  color: white;

  font-weight: 500;
`;

export const NewsletterActions = styled.div`
  display: flex;

  gap: 14px;

  flex-wrap: wrap;
`;

export const ActionButton = styled.a`
  display: flex;
  align-items: center;

  gap: 8px;

  padding: 12px 18px;

  border-radius: 10px;

  text-decoration: none;

  color: ${({ theme }) => theme.colors.textSoft};

  background: ${({ theme }) => theme.colors.surface};

  border: 1px solid rgba(255, 255, 255, 0.06);

  transition:
    background 0.3s ease,
    border-color 0.3s ease,
    transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);

    border-color: ${({ theme }) => theme.colors.accent};

    color: ${({ theme }) => theme.colors.accent};
  }
`;
