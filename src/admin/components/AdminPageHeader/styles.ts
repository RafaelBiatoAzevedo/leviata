import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  min-width: 0;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;
  flex-wrap: wrap;

  margin-bottom: 0;

  @media (max-width: 768px) {
    flex-direction: column;

    align-items: flex-start;
    gap: 16px;
  }
`;

export const Left = styled.div`
  flex: 1 1 280px;
  min-width: 0;
  display: flex;

  flex-direction: column;

  gap: 0.35rem;

  @media (max-width: 768px) {
    flex-basis: auto;
  }
`;

export const Right = styled.div`
  max-width: 100%;
  min-width: 0;
  display: flex;

  align-items: center;

  gap: 0.75rem;

  flex-wrap: wrap;

  @media (max-width: 540px) {
    width: 100%;

    > button {
      flex: 1 1 160px;
      min-height: 44px;
      height: auto;
      padding: 10px 14px;
    }
  }
`;

export const Title = styled.h1`
  margin: 0;

  font-size: clamp(24px, 2.4vw, 30px);
  line-height: 1.2;
  overflow-wrap: anywhere;

  font-weight: 700;

  color: ${({ theme }) => theme.colors.text};
`;

export const Subtitle = styled.p`
  margin: 0;

  color: ${({ theme }) => theme.colors.textSoft};

  font-size: 14px;
  overflow-wrap: anywhere;

  line-height: 1.5;
`;
