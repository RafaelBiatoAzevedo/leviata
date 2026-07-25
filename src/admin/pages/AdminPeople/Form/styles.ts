import styled from "styled-components";

export const Container = styled.div`
  display: flex;

  flex-direction: column;

  gap: 2rem;
`;

export const Form = styled.form`
  display: flex;

  flex-direction: column;

  gap: 2rem;
`;

export const Section = styled.section`
  display: flex;

  flex-direction: column;

  gap: 1.5rem;

  padding: 2rem;

  border-radius: 16px;

  background: ${({ theme }) => theme.colors.surface};

  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const SectionTitle = styled.h2`
  font-size: 1.15rem;

  font-weight: 600;

  color: ${({ theme }) => theme.colors.text};
`;

export const Grid = styled.div<{ columns?: number }>`
  display: grid;

  grid-template-columns: repeat(${({ columns = 2 }) => columns}, 1fr);

  gap: 1.5rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const Actions = styled.div`
  display: flex;

  justify-content: flex-end;

  gap: 1rem;

  padding-top: 1rem;

  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;
