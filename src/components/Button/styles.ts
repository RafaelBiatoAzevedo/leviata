import styled from "styled-components";

export const Container = styled.button`
  padding: 12px 18px;

  border: none;
  border-radius: 20px;

  background: ${({ theme }) => theme.colors.primary};
  color: black;

  font-weight: 600;
  cursor: pointer;

  transition: 0.2s;

  &:hover {
    filter: brightness(1.1);
  }
`;
