import styled from "styled-components";

export const Container = styled.main`
  min-height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 2rem;

  background: ${({ theme }) => theme.colors.background};
`;

export const Card = styled.div`
  width: 100%;
  max-width: 460px;

  background: ${({ theme }) => theme.colors.surface};

  border-radius: 1.5rem;

  padding: 3rem;

  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.08);

  border-color: ${({ theme }) => theme.colors.accent};

  box-shadow:
    0 0 0 4px ${({ theme }) => theme.colors.accentGlow},
    0 0 25px rgba(0, 0, 0, 0.25);
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

// export const Input = styled.input`
//   height: 52px;

//   padding: 0 1rem;

//   border-radius: 0.8rem;

//   border: 1px solid ${({ theme }) => theme.colors.border};

//   background: ${({ theme }) => theme.colors.background};

//   color: ${({ theme }) => theme.colors.text};

//   font-size: 1rem;

//   transition: 0.2s;

//   &:focus {
//     outline: none;

//     border-color: ${({ theme }) => theme.colors.primary};

//     box-shadow: 0 0 0 3px rgba(89, 37, 178, 0.15);
//   }
// `;

export const Button = styled.button`
  height: 54px;

  border: 0;

  border-radius: 0.8rem;

  cursor: pointer;

  font-size: 1rem;
  font-weight: 600;

  color: #fff;

  background: ${({ theme }) => theme.colors.primary};

  transition: 0.2s;

  &:hover {
    filter: brightness(1.05);
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const Footer = styled.p`
  margin-top: 2rem;

  text-align: center;

  font-size: 0.8rem;

  color: ${({ theme }) => theme.colors.text};
`;
