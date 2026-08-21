import styled from "styled-components";

interface IContainerProps {
  size: "small" | "larger";
}

export const Container = styled.div<IContainerProps>`
  width: ${({ size }) => (size === "small" ? "450px" : "600px")};
  display: flex;
  flex-direction: column;

  color: ${({ theme }) => theme.colors.text};

  h3 {
    margin-left: 4px;
    margin-bottom: 0.3rem;
    font-family: ${({ theme }) => theme.fonts.title};
    font-size: 18px;
  }
`;

export const Form = styled.form`
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: 1rem;

  button {
    align-self: flex-end;
  }

  @media (max-width: 600px) {
    flex-direction: column;
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

export const MainInputWrapper = styled.div`
  display: flex;
  flex: 1;

  flex-direction: column;
  gap: 1rem;
`;

export const TextArea = styled.textarea`
  width: 100%;

  min-height: 180px;

  padding: 12px 14px;

  border-radius: 20px;

  resize: vertical;

  outline: none;

  border: ${({ theme }) => theme.colors.primary} 1px solid;

  background: rgba(0, 0, 0, 0.2);

  color: ${({ theme }) => theme.colors.text};

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

    border-radius: 20px;
  }
`;
