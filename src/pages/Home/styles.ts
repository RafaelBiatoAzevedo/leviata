import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  padding-top: 50px;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rem;
  padding: 4rem 10rem;
`;

export const ImageHero = styled.img`
  width: 100%;
  height: auto;
`;

export const LinesLInksWrapper = styled.div`
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 4rem;
`;

export const HrDivisor = styled.div`
  width: 100%;
  height: 1px;

  background: ${({ theme }) => theme.colors.primary};
`;
