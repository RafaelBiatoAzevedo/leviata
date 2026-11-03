import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useAuth } from "../../hooks/useAuth";

import {
  Container,
  type TAdminButtonSize,
  type TAdminButtonVariant,
} from "./styles";

interface IAdminButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: TAdminButtonVariant;
  children: ReactNode;
  size?: TAdminButtonSize;
  permission?: "delete";
}

export function AdminButton({
  variant = "primary",
  size = "medium",
  permission,
  children,
  ...rest
}: IAdminButtonProps) {
  const { user } = useAuth();
  if (permission === "delete" && user?.role !== "SUPER_ADMIN") return null;

  return (
    <Container $variant={variant} $size={size} {...rest}>
      {children}
    </Container>
  );
}
