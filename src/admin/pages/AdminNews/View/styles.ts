import { Link } from "react-router-dom";
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

export const ContentWrapper = styled.div`
  display: flex;

  flex-direction: row;

  gap: 2rem;
`;

export const Title = styled.h1`
  margin: 0;

  font-size: 2rem;

  font-weight: 700;

  color: ${({ theme }) => theme.colors.text};
`;

export const CoverWrapper = styled(Link)`
  display: flex;

  flex-direction: column;

  align-items: center;

  text-decoration: none;

  gap: 1rem;

  padding: 2rem;

  border-radius: 16px;

  background: ${({ theme }) => theme.colors.surface};

  border: 1px solid ${({ theme }) => theme.colors.border};

  transition: 2s ease;
`;

export const Cover = styled.img`
  width: 320px;

  height: 320px;

  border-radius: 4px;

  object-fit: contain;

  border: 2px solid ${({ theme }) => theme.colors.primary};
`;

export const NewsTitle = styled.h2`
  margin: 0;

  text-align: center;

  font-size: 1.4rem;

  font-weight: 700;

  color: ${({ theme }) => theme.colors.text};
`;

export const Subtitle = styled.span`
  color: ${({ theme }) => theme.colors.primary};

  font-size: 1rem;

  font-weight: bold;
`;
