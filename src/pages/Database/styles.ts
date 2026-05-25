import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  padding-top: 70px;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rem;
  padding: 4rem 16rem;
`;

export const Title = styled.h2`
  font-size: 2rem;
  text-align: center;
  width: 900px;
`;

export const Paragraph = styled.p`
  text-align: justify;
  font-size: 1.2rem;
  width: 900px;
`;

export const ParagraphDecoration = styled.p`
  text-align: center;
  font-size: 1rem;
  width: 900px;
  color: ${({ theme }) => theme.colors.primary};
`;
