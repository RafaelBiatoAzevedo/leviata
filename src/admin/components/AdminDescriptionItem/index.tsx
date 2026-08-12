import type { ReactNode } from "react";

import { Container, Label, Value, EmptyValue } from "./styles";

interface AdminDescriptionItemProps {
  label?: string;

  value?: ReactNode;

  emptyText?: string;
}

export function AdminDescriptionItem({
  label,
  value,
  emptyText = "-",
}: AdminDescriptionItemProps) {
  const hasValue = value !== undefined && value !== null && value !== "";

  return (
    <Container>
      {!!label && <Label>{label}</Label>}

      {hasValue ? <Value>{value}</Value> : <EmptyValue>{emptyText}</EmptyValue>}
    </Container>
  );
}
