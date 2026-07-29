import styled from "styled-components";

interface ContainerProps {
  $columns: number;

  $gap: string;
}

export const Container = styled.div<ContainerProps>`
  display: grid;

  grid-template-columns: repeat(${({ $columns }) => $columns}, 1fr);

  gap: ${({ $gap }) => $gap};

  align-items: start;

  width: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoints.laptop}) {
    grid-template-columns: repeat(
      ${({ $columns }) => Math.min($columns, 2)},
      1fr
    );
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;
