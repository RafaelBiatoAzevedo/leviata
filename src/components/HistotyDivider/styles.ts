import styled from "styled-components";

export const Container = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 80px 0;

  position: relative;

  &::before,
  &::after {
    content: "";

    flex: 1;
    height: 1px;

    background: linear-gradient(
      to right,
      transparent,
      ${({ theme }) => theme.colors.primary},
      transparent
    );

    opacity: 0.5;
  }
`;

export const Ornament = styled.span`
  padding: 0 24px;

  color: ${({ theme }) => theme.colors.accent};

  font-size: 1.3rem;

  text-shadow: 0 0 15px ${({ theme }) => theme.colors.accentGlow};
`;
