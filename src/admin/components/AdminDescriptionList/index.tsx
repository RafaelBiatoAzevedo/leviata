import type { ReactNode } from "react";

import { Container } from "./styles";

interface AdminDescriptionListProps {
  children: ReactNode;

  columns?: 1 | 2 | 3 | 4;

  gap?: string;
}

export function AdminDescriptionList({
  children,
  columns = 2,
  gap = "1.5rem",
}: AdminDescriptionListProps) {
  return (
    <Container $columns={columns} $gap={gap}>
      {children}
    </Container>
  );
}
