import type { InputHTMLAttributes } from "react";

import { FiSearch } from "react-icons/fi";

import { Container, Input } from "./styles";

type AdminSearchBarProps = InputHTMLAttributes<HTMLInputElement>;

export function AdminSearchBar({ ...rest }: AdminSearchBarProps) {
  return (
    <Container data-admin-search>
      <FiSearch aria-hidden="true" />

      <Input
        type="search"
        aria-label={rest.placeholder || "Pesquisar registros"}
        placeholder="Pesquisar..."
        {...rest}
      />
    </Container>
  );
}
