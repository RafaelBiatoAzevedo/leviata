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
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 16px;
  > :first-child {
    flex: 1;
    min-width: 180px;
  }
  > :not(:first-child) {
    min-width: 170px;
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
