import type { InputHTMLAttributes } from "react";

import { AdminField } from "../AdminField";

import { Input } from "./styles";

interface AdminYearInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
}

export function AdminYearInput({
  label,
  description,
  error,
  required = false,
  id,
  ...rest
}: AdminYearInputProps) {
  const inputId = id ?? `year-${label?.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <AdminField
      label={label}
      description={description}
      error={error}
      htmlFor={inputId}
      required={required}
    >
      <Input
        id={inputId}
        type="number"
        min={0}
        step={1}
        $hasError={!!error}
        {...rest}
      />
    </AdminField>
  );
}
