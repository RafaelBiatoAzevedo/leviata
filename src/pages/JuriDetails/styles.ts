import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  padding-top: 70px;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 16rem;
  gap: 4rem;
`;

export const ContainerLoading = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 800px;
  align-items: center;
  justify-content: center;
`;

export const Title = styled.h2`
  font-size: 2.6rem;
  line-height: 1.1;
  text-align: center;
  width: 900px;
`;

export const MainImage = styled.img`
  max-width: 900px;

  border-radius: 2rem;
  border: 2px solid ${({ theme }) => theme.colors.primary};

  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.08),
    0 16px 48px rgba(0, 0, 0, 0.12);
`;

export const Subtitle = styled.h3`
  font-size: 2rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.primary};
  width: 900px;
`;

export const TestimoniesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));

  gap: 1.5rem;
`;
