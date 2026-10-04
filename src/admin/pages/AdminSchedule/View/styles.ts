import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const HeaderActions = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

export const Description = styled.p`
  margin: 0;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  color: ${({ theme }) => theme.colors.text};
`;
