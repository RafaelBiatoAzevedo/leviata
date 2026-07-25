import type { InputHTMLAttributes } from "react";

import { AdminField } from "../AdminField";

import { Input } from "./styles";

interface AdminInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
}

export function AdminInput({
  label,
  description,
  error,
  required = false,
  id,
  ...rest
}: AdminInputProps) {
  const inputId = id ?? `input-${label?.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <AdminField
      label={label}
      description={description}
      error={error}
      required={required}
      htmlFor={inputId}
    >
      <Input id={inputId} $hasError={!!error} {...rest} />
    </AdminField>
  );
}
