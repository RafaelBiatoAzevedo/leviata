import styled from "styled-components";

export const Container = styled.main`
  width: 100%;
  height: 100%;
`;

export const Content = styled.div`
  max-width: 1200px;

  margin: 0 auto;

  padding: 3rem;
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;

  color: ${({ theme }) => theme.colors.primary};

  margin-bottom: 0.5rem;
`;

export const Subtitle = styled.p`
  font-size: 1rem;

  color: ${({ theme }) => theme.colors.text};

  margin-bottom: 2rem;
`;

export const WelcomeCard = styled.section`
  background: ${({ theme }) => theme.colors.surface};

  border: 1px solid ${({ theme }) => theme.colors.border};

  border-radius: 1.5rem;

  padding: 2rem;

  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
`;

export const WelcomeTitle = styled.h2`
  font-size: 1.5rem;

  color: ${({ theme }) => theme.colors.primary};

  margin-bottom: 1rem;
`;

export const WelcomeText = styled.p`
  color: ${({ theme }) => theme.colors.text};

  line-height: 1.8;

  &:not(:last-child) {
    margin-bottom: 1rem;
  }
`;
