import type { ReactNode } from "react";

import { Container, Table } from "./styles";

interface IAdminTableProps {
  children: ReactNode;
}

export function AdminTable({ children }: IAdminTableProps) {
  return (
    <Container>
      <Table>{children}</Table>
    </Container>
  );
}
