import type { InputHTMLAttributes } from "react";

import { AdminField } from "../AdminField";

import { Input } from "./styles";

interface AdminDateInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
}

export function AdminDateInput({
  label,
  description,
  error,
  required = false,
  id,
  ...rest
}: AdminDateInputProps) {
  const inputId = id ?? `date-${label?.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <AdminField
      label={label}
      description={description}
      error={error}
      required={required}
      htmlFor={inputId}
    >
      <Input id={inputId} type="date" $hasError={!!error} {...rest} />
    </AdminField>
  );
}
