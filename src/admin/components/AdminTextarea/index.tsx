import type { TextareaHTMLAttributes } from "react";

import { AdminField } from "../AdminField";

import { Textarea } from "./styles";

interface AdminTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
}

export function AdminTextarea({
  label,
  description,
  error,
  required = false,
  id,
  rows = 6,
  ...rest
}: AdminTextareaProps) {
  const textareaId =
    id ?? `textarea-${label?.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <AdminField
      label={label}
      description={description}
      error={error}
      required={required}
      htmlFor={textareaId}
    >
      <Textarea id={textareaId} rows={rows} $hasError={!!error} {...rest} />
    </AdminField>
  );
}
