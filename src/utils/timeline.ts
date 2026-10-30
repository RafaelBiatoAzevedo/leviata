import type { TBoardType } from "../admin/types/TBoardType";

export type TimelineStatus =
  | "upcoming"
  | "today"
  | "ongoing"
  | "past"
  | "undated";

export interface TimelinePerson {
  id: string;
  name: string;
  abbreviation?: string;
  institution?: string;
}

export interface TimelineEntry {
  id: string;
  title: string;
  date: string;
  endDate?: string | null;
  dateOnly?: boolean;
  boardType?: TBoardType | null;
  subtitle?: string | null;
  description?: string | null;
  location?: string | null;
  meetingTitle?: string | null;
  authors?: TimelinePerson[];
  participantGroups?: { label: string; people: TimelinePerson[] }[];
  images?: {
    id: string;
    imageUrl: string;
    title?: string | null;
    description?: string | null;
  }[];
  actions?: {
    kind: "registration" | "meeting" | "recording" | "document" | "external";
    label: string;
    url: string | null | undefined;
  }[];
  detailsTo?: string;
  detailsLabel?: string;
}

export interface TimelineYearGroup {
  year: string;
  entries: TimelineEntry[];
}

const portalTimeZone = "America/Sao_Paulo";

function validDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function dateParts(date: Date, dateOnly = false) {
  const parts = new Intl.DateTimeFormat("pt-BR", {
    timeZone: dateOnly ? "UTC" : portalTimeZone,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)!.value;
  return {
    day: part("day"),
    month: part("month"),
    year: part("year"),
    key: `${part("year")}-${part("month")}-${part("day")}`,
  };
}

export function timelineStatus(
  entry: TimelineEntry,
  now = new Date(),
): TimelineStatus {
  const start = validDate(entry.date);
  if (!start) return "undated";
  const end = validDate(entry.endDate);

  if (!entry.dateOnly && end && end >= start) {
    if (end <= now) return "past";
    if (start <= now) return "ongoing";
    return dateParts(start).key === dateParts(now).key ? "today" : "upcoming";
  }

  const day = dateParts(start, entry.dateOnly).key;
  const today = dateParts(now).key;
  if (entry.dateOnly && end && end >= start) {
    if (dateParts(end, true).key < today) return "past";
    if (day < today) return "ongoing";
  }
  if (day < today) return "past";
  return day === today ? "today" : "upcoming";
}

export function groupTimeline(entries: TimelineEntry[], now = new Date()) {
  const upcoming: TimelineEntry[] = [];
  const past: TimelineEntry[] = [];
  const undated: TimelineEntry[] = [];
  for (const entry of entries) {
    const status = timelineStatus(entry, now);
    if (status === "undated") undated.push(entry);
    else if (status === "past") past.push(entry);
    else upcoming.push(entry);
  }

  function byYear(items: TimelineEntry[], direction: 1 | -1) {
    const sorted = [...items].sort(
      (a, b) =>
        direction * (new Date(a.date).getTime() - new Date(b.date).getTime()) ||
        a.title.localeCompare(b.title, "pt-BR") ||
        a.id.localeCompare(b.id),
    );
    const groups = new Map<string, TimelineEntry[]>();
    for (const entry of sorted) {
      const year = dateParts(new Date(entry.date), entry.dateOnly).year;
      if (!groups.has(year)) groups.set(year, []);
      groups.get(year)!.push(entry);
    }
    return [...groups].map(([year, grouped]) => ({ year, entries: grouped }));
  }

  return {
    upcoming: byYear(upcoming, 1),
    past: byYear(past, -1),
    undated,
    upcomingCount: upcoming.length,
    pastCount: past.length,
  };
}

export function timelineDateStamp(entry: TimelineEntry) {
  const date = validDate(entry.date);
  if (!date) return { day: "—", month: "a definir" };
  return {
    day: dateParts(date, entry.dateOnly).day,
    month: new Intl.DateTimeFormat("pt-BR", {
      month: "short",
      timeZone: entry.dateOnly ? "UTC" : portalTimeZone,
    })
      .format(date)
      .replace(".", ""),
  };
}

export function timelineDateLabel(entry: TimelineEntry) {
  const start = validDate(entry.date);
  if (!start) return "Data a confirmar";
  const timeZone = entry.dateOnly ? "UTC" : portalTimeZone;
  const formatDay = (date: Date) =>
    new Intl.DateTimeFormat("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone,
    }).format(date);
  const end = validDate(entry.endDate);
  if (entry.dateOnly) {
    return end &&
      end > start &&
      dateParts(end, true).key !== dateParts(start, true).key
      ? `${formatDay(start)} a ${formatDay(end)}`
      : formatDay(start);
  }
  const formatTime = (date: Date) =>
    new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone,
    }).format(date);
  if (end && end > start) {
    if (dateParts(start).key === dateParts(end).key)
      return `${formatDay(start)}, das ${formatTime(start)} às ${formatTime(end)}`;
    return `${formatDay(start)} às ${formatTime(start)} até ${formatDay(end)} às ${formatTime(end)}`;
  }
  return `${formatDay(start)} às ${formatTime(start)}`;
}

export function timelineExternalUrl(value?: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.href
      : null;
  } catch {
    return null;
  }
}
