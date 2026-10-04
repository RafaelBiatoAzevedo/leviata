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
  width: min(100%, 1200px);
  margin: 0 auto;
  padding: 2rem clamp(1rem, 4vw, 4rem);
  gap: 3rem;
`;

export const Grid = styled.div`
  width: 100%;
  display: grid;

  grid-template-columns: repeat(3, 1fr);

  gap: 4rem;

  padding: 0 clamp(0px, 2vw, 2rem);

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;
