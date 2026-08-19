import styled from "styled-components";

export const Container = styled.div`
  display: flex;

  flex-direction: column;

  width: 100%;

  padding: 2rem;

  border-radius: 0.8rem;

  border: 1px solid ${({ theme }) => theme.colors.border};

  background: ${({ theme }) => theme.colors.background};

  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
`;
