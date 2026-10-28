import type { NewsletterResponseDto } from "../admin/dtos/newsletter/NewsletterResponseDto";

export type NewsletterEditionStatus = "published" | "upcoming" | "preparing";

function publicationDate(edition: NewsletterResponseDto) {
  if (!edition.publishedAt) return null;
  const date = new Date(edition.publishedAt);
  return Number.isNaN(date.getTime()) ? null : date;
}

function todayInBrazil(now: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((value) => value.type === type)!.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function newsletterEditionStatus(
  edition: NewsletterResponseDto,
  now = new Date(),
): NewsletterEditionStatus {
  const date = publicationDate(edition);
  if (!date) return "preparing";
  // The admin captures a calendar date, stored at midnight UTC, rather than a publication time.
  return date.toISOString().slice(0, 10) <= todayInBrazil(now)
    ? "published"
    : "upcoming";
}

export function newsletterEditionDate(edition: NewsletterResponseDto) {
  const date = publicationDate(edition);
  return date
    ? new Intl.DateTimeFormat("pt-BR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }).format(date)
    : "Data a confirmar";
}

export function groupNewsletterEditions(
  editions: NewsletterResponseDto[],
  now = new Date(),
) {
  const published: NewsletterResponseDto[] = [];
  const upcoming: NewsletterResponseDto[] = [];
  for (const edition of editions) {
    (newsletterEditionStatus(edition, now) === "published"
      ? published
      : upcoming
    ).push(edition);
  }
  const tieBreak = (a: NewsletterResponseDto, b: NewsletterResponseDto) =>
    a.title.localeCompare(b.title, "pt-BR") || a.id.localeCompare(b.id);
  published.sort(
    (a, b) =>
      publicationDate(b)!.getTime() - publicationDate(a)!.getTime() ||
      tieBreak(a, b),
  );
  upcoming.sort((a, b) => {
    const aDate = publicationDate(a);
    const bDate = publicationDate(b);
    if (!aDate) return bDate ? 1 : tieBreak(a, b);
    if (!bDate) return -1;
    return aDate.getTime() - bDate.getTime() || tieBreak(a, b);
  });

  const archive = new Map<string, NewsletterResponseDto[]>();
  for (const edition of published.slice(1)) {
    const year = String(publicationDate(edition)!.getUTCFullYear());
    if (!archive.has(year)) archive.set(year, []);
    archive.get(year)!.push(edition);
  }
  return {
    latest: published[0] ?? null,
    archive: [...archive].map(([year, items]) => ({ year, items })),
    upcoming,
    publishedCount: published.length,
  };
}

export function newsletterReaderDocument(html: string) {
  const head = `<meta name="viewport" content="width=device-width, initial-scale=1"><base target="_blank"><style>
    html { color-scheme: light; }
    body { margin: 0; padding: 24px; color: #111827; background: #fff; font-family: Georgia, serif; line-height: 1.8; overflow-wrap: anywhere; }
    img, video { max-width: 100% !important; }
    table { max-width: 100%; }
    img, video { height: auto; }
    a { color: #7b5b20; }
    @media (max-width: 480px) { body { padding: 16px; } }
  </style>`;
  if (/<head(?:\s[^>]*)?>/i.test(html))
    return html.replace(/<head(?:\s[^>]*)?>/i, (tag) => `${tag}${head}`);
  if (/<html(?:\s[^>]*)?>/i.test(html))
    return html.replace(
      /<html(?:\s[^>]*)?>/i,
      (tag) => `${tag}<head>${head}</head>`,
    );
  return `<!doctype html><html lang="pt-BR"><head>${head}</head><body>${html}</body></html>`;
}
