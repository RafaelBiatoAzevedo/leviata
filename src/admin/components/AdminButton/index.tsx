import type { ButtonHTMLAttributes, ReactNode } from "react";

import { Container } from "./styles";

interface INewButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function AdminButton({ children, ...rest }: INewButtonProps) {
  return <Container {...rest}>{children}</Container>;
}
