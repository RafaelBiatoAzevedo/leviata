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

export const ParagraphDecoration = styled.p`
  text-align: center;
  font-size: 1rem;
  padding: 0px 8rem;
  color: ${({ theme }) => theme.colors.primary};
`;

export const LinkWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 1rem;
`;

export const LinkButton = styled.a`
  width: fit-content;

  display: flex;
  align-items: center;

  gap: 10px;

  padding: 14px 20px;

  border-radius: 12px;

  text-decoration: none;

  background: ${({ theme }) => theme.colors.backgroundCard};

  border: 1px solid ${({ theme }) => theme.colors.border};

  color: ${({ theme }) => theme.colors.onSecondary};

  font-weight: 600;

  transition: 0.3s;

  svg {
    font-size: 1rem;

    transition: transform 0.3s ease;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.accent};

    border-color: ${({ theme }) => theme.colors.accent};

    box-shadow: 0 0 20px ${({ theme }) => theme.colors.accentGlow};
  }

  &:hover svg {
    transform: translate(3px, -3px);
  }
`;
