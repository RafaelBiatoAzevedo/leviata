import type { ButtonHTMLAttributes, ReactNode } from "react";

import { Container, type TAdminButtonVariant } from "./styles";

interface IAdminButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: TAdminButtonVariant;
  children: ReactNode;
}

export function AdminButton({
  variant = "primary",
  children,
  ...rest
}: IAdminButtonProps) {
  return (
    <Container $variant={variant} {...rest}>
      {children}
    </Container>
  );
}
