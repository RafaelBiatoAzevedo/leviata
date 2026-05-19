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
  display: flex;
  gap: 8px;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

export const Input = styled.input`
  flex: 1;

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

// export const Button = styled.button`
//   padding: 12px 18px;

//   border: none;
//   border-radius: 6px;

//   background: ${({ theme }) => theme.colors.primary};
//   color: black;

//   font-weight: 600;
//   cursor: pointer;

//   transition: 0.2s;

//   &:hover {
//     filter: brightness(1.1);
//   }
// `;
