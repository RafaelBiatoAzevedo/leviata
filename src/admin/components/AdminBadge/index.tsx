import type { ReactNode } from "react";

import { Container } from "./styles";

export type TAdminBadgeVariant =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "secondary";

interface IAdminBadgeProps {
  children: ReactNode;
  variant?: TAdminBadgeVariant;
}

export function AdminBadge({
  children,
  variant = "primary",
}: IAdminBadgeProps) {
  return <Container $variant={variant}>{children}</Container>;
}
