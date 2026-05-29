import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  margin-top: 70px;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 16rem;
  gap: 3rem;
`;

export const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;

  margin-bottom: 1.5rem;
  align-self: flex-start;
`;

export const Label = styled.h2`
  align-self: flex-start;
  font-size: 1.8rem;
  letter-spacing: 0.08em;

  margin-bottom: 0.5rem;

  color: ${({ theme }) => theme.colors.text};
`;

export const Text = styled.p`
  line-height: 1.9;
  margin-left: 1rem;

  color: ${({ theme }) => theme.colors.text};

  text-align: justify;
`;
