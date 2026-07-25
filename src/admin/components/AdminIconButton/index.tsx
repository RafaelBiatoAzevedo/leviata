import type { ButtonHTMLAttributes, ReactNode } from "react";

import { Container } from "./styles";
import type { TVariant } from "./styles";

interface IAdminIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: TVariant;
}

export function AdminIconButton({
  children,
  variant = "primary",
  ...rest
}: IAdminIconButtonProps) {
  return (
    <Container type="button" $variant={variant} {...rest}>
      {children}
    </Container>
  );
}
