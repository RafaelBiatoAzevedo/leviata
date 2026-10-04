import styled from "styled-components";

export const Container = styled.main`
  width: 100%;
  height: 100%;
`;

export const Content = styled.div`
  max-width: 1200px;

  margin: 0 auto;

  padding: 3rem;

  @media (max-width: 600px) {
    padding: 1.25rem;
  }
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

export const ReportCard = styled(WelcomeCard)`
  margin-top: 2rem;
`;

export const ReportHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;

  h2 {
    margin-bottom: 0;
  }
`;

export const ReportGrid = styled.dl`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
`;

export const ReportItem = styled.div`
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 0.75rem;

  dt {
    color: ${({ theme }) => theme.colors.text};
  }

  dd {
    margin: 0.5rem 0 0;
    font-size: 1.75rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const ReportError = styled.p`
  color: ${({ theme }) => theme.colors.feedback.danger.main};
  margin-bottom: 1rem;
`;
