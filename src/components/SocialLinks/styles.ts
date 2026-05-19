import styled from "styled-components";

export const Links = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  margin-top: 3rem;
`;

export const SocialButton = styled.a`
  width: 50px;
  height: 50px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  background: ${({ theme }) => theme.colors.backgroundCard};
  color: ${({ theme }) => theme.colors.primary};

  font-size: 1.6rem;

  border: 1px solid ${({ theme }) => theme.colors.primary}33;

  transition: 0.3s;

  &:hover {
    transform: translateY(-5px);
    background: ${({ theme }) => theme.colors.primary};
    color: #000000;

    box-shadow:
      0 0 15px ${({ theme }) => theme.colors.primary}66,
      0 0 30px ${({ theme }) => theme.colors.primary}33;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    font-size: 1.6rem;
    width: 48px;
    height: 48px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 40px;
    height: 40px;
    font-size: 1.7rem;
  }
`;
