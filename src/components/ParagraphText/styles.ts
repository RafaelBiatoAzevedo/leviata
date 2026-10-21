import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 900px;
  min-width: 0;
  gap: 1rem;
`;

export const Paragraph = styled.p`
  width: 100%;
  text-align: justify;
  font-size: 1.2rem;
  line-height: 1.8;

  @media (max-width: 640px) {
    text-align: left;
    font-size: 1.1rem;
  }
`;
