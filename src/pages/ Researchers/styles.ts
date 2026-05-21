import styled from "styled-components";

export const Container = styled.section`
  width: 100%;

  padding: 120px 8%;

  display: flex;
  flex-direction: column;

  gap: 60px;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4rem;
  padding: 4rem 10rem;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;

  gap: 16px;

  max-width: 900px;
`;

export const Title = styled.h1`
  font-size: 2.6rem;

  color: ${({ theme }) => theme.colors.text};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 2.2rem;
  }
`;

export const Subtitle = styled.p`
  font-size: 1.1rem;

  line-height: 1.8;

  color: ${({ theme }) => theme.colors.textSoft};
`;

export const Grid = styled.div`
  display: grid;

  grid-template-columns: repeat(3, 1fr);

  gap: 32px;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;
