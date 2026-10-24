import styled, { css, keyframes } from "styled-components";

export const CellLabel = styled.span`
  display: none;
`;

export const CellValue = styled.div`
  min-width: 0;
  overflow-wrap: anywhere;
  > * {
    max-width: 100%;
  }
`;

const cards = css`
  display: block;
  min-width: 0;
  thead {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
  tbody {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
    gap: 16px;
  }
  tbody tr {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    min-width: 0;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-top: 3px solid ${({ theme }) => theme.colors.primary};
    border-radius: 14px;
    background: ${({ theme }) => theme.colors.surface};
    box-shadow: 0 4px 16px rgb(0 0 0 / 3%);
    overflow: hidden;
  }
  tbody tr[data-has-image="true"] {
    grid-template-columns: 68px minmax(0, 1fr);
  }
  tbody tr:hover {
    background: ${({ theme }) => theme.colors.surface};
  }
  tbody td {
    display: grid;
    grid-template-columns: minmax(80px, 30%) minmax(0, 1fr);
    align-items: start;
    gap: 12px;
    grid-column: 1 / -1;
    padding: 11px 16px;
    min-width: 0;
    border: 0;
    font-size: 13px;
    line-height: 1.5;
  }
  ${CellLabel} {
    display: block;
    padding-top: 1px;
    color: ${({ theme }) => theme.colors.textSoft};
    font-size: 12px;
    font-weight: 500;
  }
  td[data-kind="primary"] {
    display: block;
    grid-row: 1;
    padding-top: 18px;
    padding-bottom: 16px;
    strong {
      font-size: 16px;
      line-height: 1.4;
    }
    small {
      font-size: 12px;
      line-height: 1.4;
      margin-top: 6px;
    }
    br {
      display: none;
    }
  }
  tr[data-has-image="true"] td[data-kind="primary"] {
    grid-column: 2;
    padding-left: 8px;
  }
  td[data-kind="image"] {
    display: block;
    grid-column: 1;
    grid-row: 1;
    padding: 18px 0 16px 16px;
    img,
    ${CellValue} > div {
      width: 44px;
      height: 52px;
    }
  }
  td[data-kind="field"] {
    border-top: 1px solid ${({ theme }) => theme.colors.border};
  }
  td[data-kind="actions"] {
    align-self: end;
    align-items: center;
    margin-top: 4px;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => theme.colors.background};
    ${CellValue} > div {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 8px;
    }
  }
  td[data-kind="span"] {
    display: block;
  }
  tr:has(td[data-kind="span"]) {
    grid-column: 1 / -1;
    border-top-width: 1px;
  }
`;

export const Container = styled.div`
  width: 100%;
  min-width: 0;
  overflow-x: auto;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 6px 20px rgb(0 0 0 / 4%);
  @container admin-content (max-width: 760px) {
    overflow: visible;
    border: 0;
    background: transparent;
    box-shadow: none;
  }
  @media (max-width: 760px) {
    overflow: visible;
    border: 0;
    background: transparent;
    box-shadow: none;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 720px;
  thead {
    background: ${({ theme }) => theme.colors.background};
  }
  th {
    padding: 16px;
    text-align: left;
    font-size: 11px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textSoft};
    text-transform: uppercase;
    letter-spacing: 0.04em;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    white-space: nowrap;
  }
  td {
    padding: 16px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text};
    font-size: 13px;
    vertical-align: middle;
  }

  td[data-label="Data"],
  td[data-label="Data e hora"],
  td[data-label="Início"],
  td[data-label="Fim"],
  td[data-label="Tipo"],
  td[data-label="Ano"],
  td[data-label="Status"],
  td[data-label="Categoria"],
  td[data-label="Exibição"],
  td[data-label="Interna"] {
    ${CellValue} {
      overflow-wrap: normal;
    }
  }

  td[data-label="Data"] ${CellValue}, td[data-label="Tipo"] ${CellValue} {
    white-space: nowrap;
  }
  tbody tr {
    transition: background 0.2s ease;
  }
  tbody tr:hover {
    background: ${({ theme }) => theme.colors.background};
  }
  tbody tr:last-child td {
    border-bottom: none;
  }
  small {
    display: block;
    margin-top: 4px;
    color: ${({ theme }) => theme.colors.textSoft};
    font-size: 12px;
  }
  th:last-child {
    width: 160px;
  }
  @container admin-content (max-width: 760px) {
    ${cards}
  }
  @media (max-width: 760px) {
    ${cards}
  }
`;

const spin = keyframes`to { transform: rotate(360deg); }`;
export const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  min-height: 100px;
  color: ${({ theme }) => theme.colors.textSoft};
  svg {
    color: ${({ theme }) => theme.colors.primary};
    animation: ${spin} 1s linear infinite;
  }
  @media (prefers-reduced-motion: reduce) {
    svg {
      animation: none;
    }
  }
`;
