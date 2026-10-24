import { Link } from "react-router-dom";
import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  min-width: 0;
  display: flex;

  flex-direction: column;

  gap: 2rem;
`;

export const Header = styled.div`
  display: flex;

  flex-direction: column;

  gap: 1rem;
`;

export { AdminHeaderActions as HeaderActions } from "../../../components/AdminResponsive";

export { AdminDetailLayout as ContentWrapper } from "../../../components/AdminResponsive";

export const Title = styled.h1`
  margin: 0;

  font-size: 2rem;

  font-weight: 700;

  color: ${({ theme }) => theme.colors.text};
`;

export const CoverWrapper = styled(Link)`
  min-width: 0;
  max-width: 100%;
  overflow-wrap: anywhere;
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
  max-width: 100%;
  width: 220px;

  height: auto;
  max-height: 360px;

  border-radius: 4px;

  object-fit: cover;

  border: 2px solid ${({ theme }) => theme.colors.primary};
`;

export const BookTitle = styled.h2`
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
