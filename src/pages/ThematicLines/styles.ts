import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  padding-top: 70px;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4rem;
  padding: 4rem 16rem;
`;

export const ThematicLinesGrid = styled.div`
  width: 1300px;
  align-self: center;

  display: flex;
  gap: 4rem;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;

  grid-template-columns: repeat(3, 1fr);

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;
