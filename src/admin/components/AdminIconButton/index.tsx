import type { ButtonHTMLAttributes, ReactNode } from "react";

import { Container } from "./styles";
import type { TVariant } from "./styles";
import { useAuth } from "../../hooks/useAuth";

interface IAdminIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: TVariant;
  permission?: "delete";
}

export function AdminIconButton({
  children,
  variant = "primary",
  permission,
  ...rest
}: IAdminIconButtonProps) {
  const { user } = useAuth();
  if (permission === "delete" && user?.role !== "SUPER_ADMIN") return null;

  return (
    <Container
      type="button"
      $variant={variant}
      aria-label={rest["aria-label"] || rest.title}
      {...rest}
    >
      {children}
    </Container>
  );
}
