import styled from "styled-components";

export const Container = styled.div`
  display: flex;

  flex-direction: column;

  gap: 2rem;
`;

export const Filters = styled.div`
  display: flex;
  flex-direction: row;

  justify-content: space-between;

  gap: 1rem;
`;

export const Actions = styled.div`
  display: flex;

  gap: 0.5rem;
`;

export const Empty = styled.div`
  text-align: center;

  padding: 3rem;

  color: ${({ theme }) => theme.colors.text};

  border: 1px dashed ${({ theme }) => theme.colors.border};

  border-radius: 12px;
`;
