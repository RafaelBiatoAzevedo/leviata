import styled from "styled-components";

export const Container = styled.main`
  min-height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 2rem;

  background: ${({ theme }) => theme.colors.background};

  &::before {
    content: "";

    position: absolute;
    inset: 0;

    background-image: url("/src/assets/images/leviataHero.webp");
    background-size: cover;
    background-position: center;

    opacity: 0.7;

    z-index: 0;
  }
`;

export const Card = styled.div`
  width: 100%;
  max-width: 460px;

  background: ${({ theme }) => theme.colors.background};

  border-radius: 1.5rem;

  padding: 3rem;

  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.08);

  border-color: ${({ theme }) => theme.colors.accent};

  box-shadow:
    0 0 0 4px ${({ theme }) => theme.colors.accentGlow},
    0 0 25px rgba(0, 0, 0, 0.25);

  z-index: 1;
`;

export const Title = styled.h1`
  text-align: center;

  margin-bottom: 0.5rem;

  font-size: 2rem;
  color: ${({ theme }) => theme.colors.text};
`;

export const Subtitle = styled.p`
  text-align: center;

  margin-bottom: 2.5rem;

  color: ${({ theme }) => theme.colors.primary};

  font-size: 0.95rem;

  letter-spacing: 0.04em;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;

  gap: 2rem;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;

  gap: 0.5rem;

  label {
    font-size: 0.9rem;
    font-weight: 400;

    color: ${({ theme }) => theme.colors.text};
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px 14px;

  border-radius: 20px;

  background: rgba(0, 0, 0, 0.2);
  color: ${({ theme }) => theme.colors.text};
  border: ${({ theme }) => theme.colors.primary} 1px solid;
  outline: none;

  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease,
    transform 0.3s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};

    box-shadow:
      0 0 0 4px ${({ theme }) => theme.colors.accentGlow},
      0 0 25px rgba(0, 0, 0, 0.25);

    transform: translateY(-2px);
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};

    border-radius: 10px;
  }
`;

export const Footer = styled.p`
  margin-top: 2rem;

  text-align: center;

  font-size: 0.8rem;

  color: ${({ theme }) => theme.colors.text};
`;
