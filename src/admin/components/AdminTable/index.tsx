import {
  Children,
  cloneElement,
  isValidElement,
  useId,
  type ReactElement,
  type ReactNode,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from "react";
import { FiLoader } from "react-icons/fi";
import { CellLabel, CellValue, Container, LoadingState, Table } from "./styles";

interface IAdminTableProps {
  children: ReactNode;
  loading?: boolean;
  label?: string;
}

type TableNode = ReactElement<{ children?: ReactNode }>;

function contentText(node: ReactNode): string {
  return Children.toArray(node)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number")
        return String(child);
      return isValidElement<{ children?: ReactNode }>(child)
        ? contentText(child.props.children)
        : "";
    })
    .join(" ")
    .trim();
}

function findHeaders(
  children: ReactNode,
): ReactElement<ThHTMLAttributes<HTMLTableCellElement>>[] {
  return Children.toArray(children).flatMap((child) => {
    if (!isValidElement<{ children?: ReactNode }>(child)) return [];
    return child.type === "th" ? [child] : findHeaders(child.props.children);
  });
}

export function AdminTable({
  children,
  loading = false,
  label = "Registros cadastrados",
}: IAdminTableProps) {
  const id = useId();
  const headers = findHeaders(children);
  const columns = headers.map((header, index) => ({
    id: header.props.id || `${id}-column-${index}`,
    label: contentText(header.props.children),
  }));
  const names = columns.map((column) =>
    column.label.toLocaleLowerCase("pt-BR"),
  );
  const nameColumn = names.indexOf("nome");
  const titleColumn = names.indexOf("título");
  const primary =
    nameColumn >= 0 ? nameColumn : titleColumn >= 0 ? titleColumn : 0;
  const hasImage = names.some((name) => name === "capa" || name === "foto");
  let headerIndex = 0;

  function rowCells(node: ReactNode): ReactNode {
    let index = 0;
    return Children.map(node, (cell) => {
      if (!isValidElement<TdHTMLAttributes<HTMLTableCellElement>>(cell))
        return cell;
      if (cell.type !== "td") return cell;
      const column = columns[index];
      const name = names[index];
      const kind =
        (cell.props.colSpan || 1) > 1
          ? "span"
          : name === "ações"
            ? "actions"
            : name === "capa" || name === "foto"
              ? "image"
              : index === primary
                ? "primary"
                : "field";
      index += cell.props.colSpan || 1;
      return cloneElement(cell, {
        role: "cell",
        headers: cell.props.headers || column?.id,
        ...{ "data-kind": kind, "data-label": column?.label },
        children: (
          <>
            {kind === "field" && (
              <CellLabel aria-hidden="true">{column?.label}</CellLabel>
            )}
            {kind === "actions" && (
              <CellLabel aria-hidden="true">Ações</CellLabel>
            )}
            <CellValue>{cell.props.children}</CellValue>
          </>
        ),
      });
    });
  }

  function decorate(node: ReactNode, section?: "head" | "body"): ReactNode {
    return Children.map(node, (child) => {
      if (!isValidElement<{ children?: ReactNode }>(child)) return child;
      const element = child as TableNode;
      if (child.type === "th") {
        const header = columns[headerIndex++];
        return cloneElement(
          child as ReactElement<ThHTMLAttributes<HTMLTableCellElement>>,
          { id: header.id, scope: "col", role: "columnheader" },
        );
      }
      if (child.type === "thead")
        return cloneElement(element, {
          ...{ role: "rowgroup" },
          children: decorate(child.props.children, "head"),
        });
      if (child.type === "tbody") {
        const rows = loading ? (
          <tr>
            <td colSpan={Math.max(1, columns.length)}>
              <LoadingState role="status">
                <FiLoader aria-hidden="true" />
                Carregando registros...
              </LoadingState>
            </td>
          </tr>
        ) : (
          child.props.children
        );
        return cloneElement(element, {
          ...{ role: "rowgroup" },
          children: decorate(rows, "body"),
        });
      }
      if (child.type === "tr")
        return cloneElement(element, {
          ...{
            role: "row",
            "data-has-image":
              section === "body" && hasImage ? "true" : undefined,
          },
          children:
            section === "body"
              ? rowCells(child.props.children)
              : decorate(child.props.children, section),
        });
      return cloneElement(element, {
        children: decorate(child.props.children, section),
      });
    });
  }

  return (
    <Container data-admin-table>
      <Table role="table" aria-label={label} aria-busy={loading}>
        {decorate(children)}
      </Table>
    </Container>
  );
}
