import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  padding-top: 70px;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rem;
  padding: 2rem 16rem;
`;

export const Paragraph = styled.p`
  text-align: justify;
  font-size: 1.2rem;
  width: 900px;
`;

export const DossiersGrid = styled.div`
  width: 1100px;

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
