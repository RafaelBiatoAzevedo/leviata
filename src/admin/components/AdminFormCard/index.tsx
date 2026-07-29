import type { ReactNode } from "react";

import { Container } from "./styles";

interface AdminFormCardProps {
  children: ReactNode;
}

export function AdminFormCard({ children }: AdminFormCardProps) {
  return <Container>{children}</Container>;
}
