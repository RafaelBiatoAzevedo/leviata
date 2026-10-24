import styled from "styled-components";

interface ContainerProps {
  $columns: number;

  $gap: string;
}

export const Container = styled.div<ContainerProps>`
  display: grid;

  grid-template-columns: repeat(${({ $columns }) => $columns}, minmax(0, 1fr));

  gap: ${({ $gap }) => $gap};

  align-items: start;

  width: 100%;
  min-width: 0;

  > * {
    min-width: 0;
    max-width: 100%;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.laptop}) {
    grid-template-columns: repeat(
      ${({ $columns }) => Math.min($columns, 2)},
      minmax(0, 1fr)
    );
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: minmax(0, 1fr);
    > * {
      grid-column: auto;
    }
  }
  @container admin-content (max-width: 600px) {
    grid-template-columns: minmax(0, 1fr);
    > * {
      grid-column: auto;
    }
  }
`;
