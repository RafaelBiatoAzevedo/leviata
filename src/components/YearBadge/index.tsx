import { Container, Label, Stamp, Year } from "./styles";

export function PeriodBadge({ period }: { period: string }) {
  if (!period.trim()) return null;
  return (
    <Container $wide>
      <Stamp as="div" aria-label={`Período: ${period}`}>
        <Label>Período</Label>
        <Year>{period}</Year>
      </Stamp>
    </Container>
  );
}

export function YearBadge({ date }: { date?: string | null }) {
  if (!date) return null;
  const parsedDate = new Date(date);
  if (!Number.isFinite(parsedDate.getTime())) return null;
  const year = new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    timeZone: "UTC",
  }).format(parsedDate);

  return (
    <Container>
      <Stamp dateTime={parsedDate.toISOString()} aria-label={`Ano: ${year}`}>
        <Label>Ano</Label>
        <Year>{year}</Year>
      </Stamp>
    </Container>
  );
}
