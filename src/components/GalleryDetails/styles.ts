import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  padding-top: 70px;
`;

export const Content = styled.div`
  width: min(100%, 1200px);
  margin: 0 auto;
  padding: 2rem clamp(1rem, 4vw, 4rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

export const Cover = styled.img`
  width: min(100%, 900px);
  max-height: 600px;
  object-fit: contain;
  border-radius: 1rem;
`;

export const Links = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
  a {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

export const Status = styled.div`
  min-height: 70vh;
  padding: 5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;
