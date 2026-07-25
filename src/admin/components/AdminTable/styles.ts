import styled from "styled-components";

export const Container = styled.div`
  width: 100%;

  overflow-x: auto;

  border-radius: 16px;

  background: ${({ theme }) => theme.colors.surface};

  border: 1px solid ${({ theme }) => theme.colors.border};

  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.04);
`;

export const Table = styled.table`
  width: 100%;

  border-collapse: collapse;

  min-width: 900px;

  thead {
    background: ${({ theme }) => theme.colors.background};
  }

  th {
    padding: 1rem;

    text-align: left;

    font-size: 0.85rem;

    font-weight: 700;

    color: ${({ theme }) => theme.colors.text};

    text-transform: uppercase;

    letter-spacing: 0.05em;

    border-bottom: 1px solid ${({ theme }) => theme.colors.border};

    white-space: nowrap;
  }

  td {
    padding: 1rem;

    border-bottom: 1px solid ${({ theme }) => theme.colors.border};

    color: ${({ theme }) => theme.colors.text};

    font-size: 0.95rem;

    vertical-align: middle;
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

    margin-top: 0.25rem;

    color: ${({ theme }) => theme.colors.text};

    font-size: 0.8rem;
  }

  th:last-child {
    width: 150px;
  }
`;
