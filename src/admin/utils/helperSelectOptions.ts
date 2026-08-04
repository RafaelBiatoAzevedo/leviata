export interface SelectOption {
  value: string;
  label: string;
}

export function toSelectOptions<T extends { id: string; name: string }>(
  items: T[],
): SelectOption[] {
  return items.map((item) => ({
    value: item.id,
    label: item.name,
  }));
}
