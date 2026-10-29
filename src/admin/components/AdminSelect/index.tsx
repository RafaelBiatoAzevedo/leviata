import type { SelectHTMLAttributes } from "react";

import { AdminField } from "../AdminField";

import { Option, Select } from "./styles";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface AdminSelectProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "children"
> {
  label?: string;
  labelHint?: string;
  description?: string;
  error?: string;
  required?: boolean;

  options: SelectOption[];
}

export function AdminSelect({
  label,
  labelHint,
  description,
  error,
  required = false,
  id,
  options,
  ...rest
}: AdminSelectProps) {
  const selectId = id ?? `select-${label?.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <AdminField
      label={label}
      labelHint={labelHint}
      description={description}
      error={error}
      required={required}
      htmlFor={selectId}
    >
      <Select id={selectId} $hasError={!!error} {...rest}>
        {options.map((option) => (
          <Option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </Option>
        ))}
      </Select>
    </AdminField>
  );
}
