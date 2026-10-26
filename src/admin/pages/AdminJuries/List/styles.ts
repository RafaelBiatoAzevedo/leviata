import styled from "styled-components";

export const Container = styled.div`
  /* Mantém a capa horizontal também nos cards da tabela no celular. */
  --admin-table-image-column-width: 104px;
  --admin-table-image-width: 80px;
  --admin-table-image-height: 45px;

  width: 100%;
  min-width: 0;
  display: flex;

  flex-direction: column;

  gap: 2rem;
`;

export const Cover = styled.img`
  width: 80px;

  height: 45px;

  aspect-ratio: 16 / 9;

  border-radius: 2px;

  object-fit: contain;
`;

export const CoverPlaceholder = styled.div`
  width: 80px;

  height: 45px;

  aspect-ratio: 16 / 9;

  border-radius: 2px;

  display: flex;

  align-items: center;

  justify-content: center;

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

export const DescriptionCell = styled.div`
  max-width: 60rem;

  line-height: 1.4;

  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;

  overflow: hidden;

  overflow-wrap: break-word;
`;
