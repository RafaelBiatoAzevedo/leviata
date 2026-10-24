import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  min-width: 0;
  display: flex;

  flex-direction: column;

  gap: 2rem;
`;

export const Cover = styled.img`
  width: 42px;

  height: 42px;

  border-radius: 2px;

  object-fit: contain;
`;

export const CoverPlaceholder = styled.div`
  width: 42px;

  height: 42px;

  border-radius: 2px;

  display: flex;

  align-items: center;

  justify-content: center;

  background: ${({ theme }) => theme.colors.background};

  color: ${({ theme }) => theme.colors.text};

  svg {
    font-size: 1.2rem;
  }
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

export const SelectWrapper = styled.div`
  position: relative;

  width: 240px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;
