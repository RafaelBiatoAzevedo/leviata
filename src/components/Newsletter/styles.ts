import styled from "styled-components";

export const Container = styled.div`
  width: 450px;
  display: flex;
  flex-direction: column;

  color: ${({ theme }) => theme.colors.text};

  h3 {
    margin-left: 14px;
    font-family: ${({ theme }) => theme.fonts.title};
    font-size: 18px;
  }
`;

export const Form = styled.form`
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: 8px;

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

  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;

  background: rgba(0, 0, 0, 0.2);
  color: white;

  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const MainInputWrapper = styled.div`
  display: flex;
  flex: 1;

  flex-direction: column;
  gap: 1rem;
`;
