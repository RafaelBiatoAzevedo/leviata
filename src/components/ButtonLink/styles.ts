import styled from "styled-components";
import { Link } from "react-router-dom";

interface IContainerProps {
  $isLink?: boolean;
}

export const Container = styled.button<IContainerProps>`
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 12px 18px;

  border-radius: 20px;

  border: none;

  cursor: pointer;

  text-decoration: none;

  background: ${({ theme }) => theme.colors.primary};

  color: ${({ theme }) => theme.colors.text};

  font-weight: 600;

  transition: 0.3s;

  &:hover {
    transform: translateY(-2px);

    box-shadow: 0 0 20px ${({ theme }) => theme.colors.accentGlow};
  }
`;

export const LinkContainer = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 12px 18px;

  border-radius: 20px;

  text-decoration: none;

  background: ${({ theme }) => theme.colors.primary};

  color: ${({ theme }) => theme.colors.text};

  font-weight: 600;

  transition: 0.3s;

  &:hover {
    transform: translateY(-2px);

    box-shadow: 0 0 20px ${({ theme }) => theme.colors.accentGlow};
  }
`;
