import type { ReactNode } from "react";

import { Container } from "./styles";

interface AdminFormGridProps {
  children: ReactNode;

  columns?: 1 | 2 | 3 | 4;

  gap?: string;
}

export function AdminFormGrid({
  children,
  columns = 2,
  gap = "1.5rem",
}: AdminFormGridProps) {
  return (
    <Container $columns={columns} $gap={gap}>
      {children}
    </Container>
  );
}
