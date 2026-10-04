import { useId } from "react";
import {
  MdArrowDropDown,
  MdChevronLeft,
  MdChevronRight,
  MdFirstPage,
  MdLastPage,
} from "react-icons/md";
import {
  Container,
  Controls,
  PageButton,
  Range,
  RowsField,
  SelectWrapper,
} from "./styles";

interface AdminPaginationProps {
  page: number;
  rowsPerPage: number;
  total: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  disabled?: boolean;
  loading?: boolean;
}

export function AdminPagination({
  page,
  rowsPerPage,
  total,
  onPageChange,
  onRowsPerPageChange,
  disabled = false,
  loading = false,
}: AdminPaginationProps) {
  const selectId = useId();
  const lastPage = Math.max(1, Math.ceil(total / rowsPerPage));
  const first = total === 0 ? 0 : (page - 1) * rowsPerPage + 1;
  const last = Math.min(page * rowsPerPage, total);

  return (
    <Container aria-label="Paginação da lista" aria-busy={loading}>
      <RowsField>
        <label htmlFor={selectId}>Linhas por página:</label>
        <SelectWrapper>
          <select
            id={selectId}
            value={rowsPerPage}
            disabled={disabled || loading}
            onChange={(event) =>
              onRowsPerPageChange(Number(event.target.value))
            }
          >
            {[15, 30, 50, 100].map((rows) => (
              <option key={rows} value={rows}>
                {rows}
              </option>
            ))}
          </select>
          <MdArrowDropDown aria-hidden="true" />
        </SelectWrapper>
      </RowsField>
      <Range aria-live="polite" aria-atomic="true">
        {loading
          ? "Carregando…"
          : `${first.toLocaleString("pt-BR")}-${last.toLocaleString("pt-BR")} de ${total.toLocaleString("pt-BR")}`}
      </Range>
      <Controls>
        <PageButton
          type="button"
          aria-label="Primeira página"
          title="Primeira página"
          disabled={disabled || loading || page <= 1}
          onClick={() => onPageChange(1)}
        >
          <MdFirstPage aria-hidden="true" />
        </PageButton>
        <PageButton
          type="button"
          aria-label="Página anterior"
          title="Página anterior"
          disabled={disabled || loading || page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <MdChevronLeft aria-hidden="true" />
        </PageButton>
        <PageButton
          type="button"
          aria-label="Próxima página"
          title="Próxima página"
          disabled={disabled || loading || page >= lastPage}
          onClick={() => onPageChange(page + 1)}
        >
          <MdChevronRight aria-hidden="true" />
        </PageButton>
        <PageButton
          type="button"
          aria-label="Última página"
          title="Última página"
          disabled={disabled || loading || page >= lastPage}
          onClick={() => onPageChange(lastPage)}
        >
          <MdLastPage aria-hidden="true" />
        </PageButton>
      </Controls>
    </Container>
  );
}
