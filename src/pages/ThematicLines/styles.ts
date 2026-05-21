import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  padding-top: 70px;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4rem;
  padding: 4rem 10rem;
`;

export const Title = styled.h1`
  font-size: 2.6rem;

  color: ${({ theme }) => theme.colors.text};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 2.2rem;
  }
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;

  gap: 16px;

  max-width: 900px;
`;

export const Subtitle = styled.p`
  font-size: 1.1rem;

  line-height: 1.8;

  color: ${({ theme }) => theme.colors.textSoft};
`;

export const LinesLInksWrapper = styled.div`
  align-items: stretch;
  justify-content: center;
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 4rem;
`;
