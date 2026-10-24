import styled from "styled-components";

export const Container = styled.div`
  display: flex;

  flex-direction: column;

  width: 100%;
  min-width: 0;

  padding: clamp(16px, 2.5vw, 28px);

  border-radius: 0.8rem;

  border: 1px solid ${({ theme }) => theme.colors.border};

  background: ${({ theme }) => theme.colors.background};

  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
`;
