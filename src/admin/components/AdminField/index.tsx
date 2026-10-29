import type { ReactNode } from "react";

import { Container, Description, Error, Label, LabelHint, Required } from "./styles";

interface AdminFieldProps {
  label?: string;
  labelHint?: string;
  required?: boolean;
  description?: string;
  error?: string;
  htmlFor?: string;
  children: ReactNode;
}

export function AdminField({
  label,
  labelHint,
  required = false,
  description,
  error,
  htmlFor,
  children,
}: AdminFieldProps) {
  return (
    <Container>
      {label && (
        <Label htmlFor={htmlFor}>
          {label}

          {required && <Required>*</Required>}

          {labelHint && <LabelHint>({labelHint})</LabelHint>}
        </Label>
      )}

      {description && <Description>{description}</Description>}

      {children}

      {error && <Error>{error}</Error>}
    </Container>
  );
}
