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
  padding: 2rem 16rem;
  gap: 3rem;
`;

export const Label = styled.h2`
  align-self: flex-start;
  font-size: 1.8rem;
  letter-spacing: 0.08em;

  margin-bottom: 0.5rem;

  color: ${({ theme }) => theme.colors.text};
`;

export const Grid = styled.div`
  display: grid;

  grid-template-columns: repeat(3, 1fr);

  gap: 4rem;

  padding: 0px 4rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;
