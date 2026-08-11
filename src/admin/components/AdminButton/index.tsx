import type { ButtonHTMLAttributes, ReactNode } from "react";

import {
  Container,
  type TAdminButtonSize,
  type TAdminButtonVariant,
} from "./styles";

interface IAdminButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: TAdminButtonVariant;
  children: ReactNode;
  size?: TAdminButtonSize;
}

export function AdminButton({
  variant = "primary",
  size = "medium",
  children,
  ...rest
}: IAdminButtonProps) {
  return (
    <Container $variant={variant} $size={size} {...rest}>
      {children}
    </Container>
  );
}
