import styled from "styled-components";

export const Container = styled.div`
  width: 100%;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 2rem;

  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;

    align-items: flex-start;
  }
`;

export const Left = styled.div`
  display: flex;

  flex-direction: column;

  gap: 0.35rem;
`;

export const Right = styled.div`
  display: flex;

  align-items: center;

  gap: 0.75rem;

  flex-wrap: wrap;
`;

export const Title = styled.h1`
  margin: 0;

  font-size: 2rem;

  font-weight: 700;

  color: ${({ theme }) => theme.colors.text};
`;

export const Subtitle = styled.p`
  margin: 0;

  color: ${({ theme }) => theme.colors.textSoft};

  font-size: 0.95rem;

  line-height: 1.5;
`;
