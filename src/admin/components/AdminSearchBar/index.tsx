import type { InputHTMLAttributes } from "react";

import { FiSearch } from "react-icons/fi";

import { Container, Input } from "./styles";

type AdminSearchBarProps = InputHTMLAttributes<HTMLInputElement>;

export function AdminSearchBar({ ...rest }: AdminSearchBarProps) {
  return (
    <Container>
      <FiSearch />

      <Input placeholder="Pesquisar..." {...rest} />
    </Container>
  );
}
