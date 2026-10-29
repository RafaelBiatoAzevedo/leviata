import type { AnalyticsReport, AnalyticsData } from "../../../analytics/types";

export const number = (value: number, digits = 0) =>
  new Intl.NumberFormat("pt-BR", { maximumFractionDigits: digits }).format(
    value,
  );
export const dateLabel = (day: string, long = false) =>
  new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: long ? "long" : "short",
    ...(long ? { year: "numeric" } : {}),
  }).format(new Date(`${day}T12:00:00Z`));
export function todayInSaoPaulo(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}
export function shiftDay(day: string, amount: number) {
  const date = new Date(`${day}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}
export function period(days: number, today = todayInSaoPaulo()) {
  return { from: shiftDay(today, 1 - days), to: today };
}
export function validateRange(
  from: string,
  to: string,
  today = todayInSaoPaulo(),
): string | null {
  const valid = (day: string) =>
    /^\d{4}-\d{2}-\d{2}$/.test(day) &&
    Number.isFinite(Date.parse(`${day}T12:00:00Z`)) &&
    new Date(`${day}T12:00:00Z`).toISOString().slice(0, 10) === day;
  if (!valid(from) || !valid(to)) return "Informe duas datas válidas.";
  if (from > to) return "A data inicial deve ser anterior ou igual à final.";
  if (to > today) return "O período não pode incluir datas futuras.";
  if (from < shiftDay(today, -179))
    return "O início deve estar dentro dos últimos 180 dias.";
  if ((Date.parse(to) - Date.parse(from)) / 86400000 >= 90)
    return "Selecione um intervalo de até 90 dias.";
  return null;
}
export type Granularity = "day" | "week" | "month";
export function chartBuckets(
  series: AnalyticsData["series"],
  granularity: Granularity,
) {
  const result: {
    date: string;
    end: string;
    views: number;
    previousViews: number;
  }[] = [];
  for (const [index, point] of series.entries()) {
    const starts =
      granularity === "day" ||
      index === 0 ||
      (granularity === "week"
        ? index % 7 === 0
        : point.date.slice(0, 7) !== series[index - 1].date.slice(0, 7));
    if (starts)
      result.push({
        date: point.date,
        end: point.date,
        views: 0,
        previousViews: 0,
      });
    const bucket = result[result.length - 1];
    bucket.end = point.date;
    bucket.views += point.views;
    bucket.previousViews += point.previousViews;
  }
  return result;
}

export function analyticsCsv(report: AnalyticsReport): string {
  if (!report.data) return "";
  const data = report.data;
  const rows: (string | number)[][] = [
    ["Observatório — Leviatã e o Cativeiro"],
    [
      "Início",
      report.range.from,
      "Fim",
      report.range.to,
      "Fuso",
      report.timezone,
    ],
    ["Gerado em", report.generatedAt, "Status", report.status],
    [
      "Comparação completa",
      data.comparisonReliable
        ? "Sim"
        : "Não — períodos parciais ou indisponíveis",
    ],
    ["Meses com cobertura limitada", report.limitedMonths.join(", ")],
    [
      "Métrica",
      "Visualizações de página; não representam visitantes ou sessões",
    ],
    ["Dimensão", "Chave", "Descrição", "Visualizações"],
    ...data.series.map((row) => [
      "Dia",
      row.date,
      dateLabel(row.date, true),
      row.views,
    ]),
    ...(
      ["pages", "sections", "sources", "devices", "browsers"] as const
    ).flatMap((dimension) =>
      data[dimension].map((row) => [dimension, row.key, row.label, row.views]),
    ),
  ];
  const escape = (value: string | number) => {
    let text = String(value);
    if (/^[\s]*[=+@-]|^[\t\r]/.test(text)) text = `'${text}`;
    return `"${text.replace(/"/g, '""')}"`;
  };
  return `\uFEFF${rows.map((row) => row.map(escape).join(";")).join("\r\n")}`;
}
export function downloadCsv(report: AnalyticsReport) {
  const url = URL.createObjectURL(
    new Blob([analyticsCsv(report)], { type: "text/csv;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = `observatorio-${report.range.from}-${report.range.to}.csv`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
