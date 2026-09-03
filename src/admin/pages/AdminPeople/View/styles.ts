import styled from "styled-components";

export const Container = styled.div`
  display: flex;

  flex-direction: column;

  gap: 2rem;
`;

export const Header = styled.div`
  display: flex;

  flex-direction: column;

  gap: 1rem;
`;

export const HeaderActions = styled.div`
  display: flex;

  justify-content: space-between;
`;

export const Title = styled.h1`
  margin: 0;

  font-size: 2rem;

  font-weight: 700;

  color: ${({ theme }) => theme.colors.text};
`;

export const PhotoWrapper = styled.div`
  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 1rem;

  padding: 2rem;

  border-radius: 16px;

  background: ${({ theme }) => theme.colors.surface};

  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const Photo = styled.img`
  width: 180px;

  height: 180px;

  border-radius: 50%;

  object-fit: cover;

  border: 4px solid ${({ theme }) => theme.colors.primary};
`;

export const Name = styled.h2`
  margin: 0;

  text-align: center;

  font-size: 1.8rem;

  font-weight: 700;

  color: ${({ theme }) => theme.colors.text};
`;

export const Subtitle = styled.span`
  color: ${({ theme }) => theme.colors.textSoft};

  font-size: 1rem;
`;
