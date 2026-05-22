import styled from "styled-components";

export const Container = styled.div<{
  $center?: boolean;
}>`
  display: flex;
  flex-direction: column;

  gap: 16px;

  width: 100%;

  text-align: ${({ $center }) => ($center ? "center" : "left")};

  align-items: ${({ $center }) => ($center ? "center" : "flex-start")};
`;

export const Title = styled.h1`
  font-size: 2.6rem;

  line-height: 1.1;

  color: ${({ theme }) => theme.colors.text};

  font-family: ${({ theme }) => theme.fonts.title};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 2.2rem;
  }
`;

export const Subtitle = styled.p`
  font-size: 1.1rem;

  line-height: 1.8;

  color: ${({ theme }) => theme.colors.textSoft};

  max-width: 900px;
`;
