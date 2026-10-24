import styled from "styled-components";
export const Container = styled.div`
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;
export { AdminListFilters as Filters } from "../../../components/AdminListFilters";
export const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`;
export const Empty = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${({ theme }) => theme.colors.text};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: 12px;
`;
