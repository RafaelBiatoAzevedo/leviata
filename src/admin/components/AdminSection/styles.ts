import styled from "styled-components";

export const Container = styled.section`
  display: flex;

  flex-direction: column;

  gap: 1.5rem;
`;

export const Header = styled.div`
  display: flex;

  align-items: center;

  justify-content: space-between;

  padding-bottom: 1rem;

  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const Title = styled.h2`
  margin: 0;

  font-size: 0.95rem;

  text-transform: uppercase;

  letter-spacing: 0.08em;

  color: ${({ theme }) => theme.colors.primary};
`;

export const Content = styled.div`
  display: flex;

  flex-direction: column;

  gap: 1.5rem;
`;
