import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  padding-top: 70px;
`;

export const ContainerLoading = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 800px;
  align-items: center;
  justify-content: center;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 16rem;
  gap: 4rem;
`;

export const Title = styled.h2`
  font-size: 2.6rem;
  line-height: 1.1;
  text-align: center;
  width: 900px;
`;

export const Subtitle = styled.h3`
  font-size: 1.6rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.primary};
  width: 900px;
`;

export const ParagraphDecoration = styled.p`
  text-align: center;
  font-size: 1rem;
  width: 900px;
  color: ${({ theme }) => theme.colors.primary};
`;
