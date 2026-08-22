export function formatDate(
  date: string | Date,
  options?: Intl.DateTimeFormatOptions,
): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...options,
  }).format(new Date(date));
}

export function formatDateLong(date: string | Date): string {
  const formatted = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

  return formatted.replace(
    /de ([a-záéíóúãõâêôç]+)/,
    (_, month: string) =>
      `de ${month.charAt(0).toUpperCase()}${month.slice(1)}`,
  );
}
