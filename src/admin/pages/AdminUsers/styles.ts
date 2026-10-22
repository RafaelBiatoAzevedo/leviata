import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;
export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;
export const Filters = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 180px 170px;
  align-items: end;
  gap: 16px;

  > * {
    min-width: 0;
  }

  > :first-child {
    max-width: none;
  }

  input {
    min-width: 0;
  }

  @media (max-width: 960px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    > :first-child {
      grid-column: 1 / -1;
    }
  }

  @media (max-width: 480px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;
export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
export const Empty = styled.div`
  padding: 32px;
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textSoft};
`;
export const HeaderActions = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
`;
