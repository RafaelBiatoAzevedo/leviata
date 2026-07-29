import styled from "styled-components";

export const Container = styled.div`
  display: flex;

  flex-direction: column;

  gap: 2rem;
`;

export const Form = styled.form`
  display: flex;

  flex-direction: column;

  gap: 2rem;
`;

export const PersonTopWrappe = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2rem;

  > :first-child {
    flex: 1;
  }
`;

export const Actions = styled.div`
  display: flex;

  justify-content: flex-end;

  gap: 1rem;

  padding-top: 1rem;

  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;
