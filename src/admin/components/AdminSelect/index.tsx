import type { SelectHTMLAttributes, ReactNode } from "react";

import { AdminField } from "../AdminField";

import { Select } from "./styles";

interface AdminSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}

export function AdminSelect({
  label,
  description,
  error,
  required = false,
  id,
  children,
  ...rest
}: AdminSelectProps) {
  const selectId = id ?? `select-${label?.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <AdminField
      label={label}
      description={description}
      error={error}
      required={required}
      htmlFor={selectId}
    >
      <Select id={selectId} $hasError={!!error} {...rest}>
        {children}
      </Select>
    </AdminField>
  );
}
