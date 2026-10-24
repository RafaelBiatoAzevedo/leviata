import styled, { css } from "styled-components";

const stackedFields = css`
  > *,
  > [data-admin-search] {
    flex-basis: 100%;
  }
`;

export const AdminListFilters = styled.div`
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 14px;
  width: 100%;
  min-width: 0;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.surface};

  > * {
    flex: 1 1 180px;
    width: auto;
    min-width: 0;
    max-width: none;
  }

  > [data-admin-search] {
    flex: 3 1 320px;
    max-width: none;
  }

  @container admin-content (max-width: 900px) {
    &:has(> :nth-child(3)) > [data-admin-search] {
      flex-basis: 100%;
    }
  }

  @media (max-width: 900px) {
    &:has(> :nth-child(3)) > [data-admin-search] {
      flex-basis: 100%;
    }
  }

  @container admin-content (max-width: 540px) {
    ${stackedFields}
  }

  @media (max-width: 540px) {
    ${stackedFields}
    padding: 14px;
  }
`;
