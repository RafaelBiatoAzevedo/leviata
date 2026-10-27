export function newsletterPdfUrl(
  value: string | null | undefined,
  apiBaseUrl?: string,
): string | null {
  if (!value) return null;
  try {
    if (value.startsWith("/newsletter/")) {
      const origin =
        typeof window !== "undefined" ? window.location.origin : undefined;
      const base = new URL(apiBaseUrl || "/", origin);
      base.pathname = `${base.pathname.replace(/\/$/, "")}/`;
      return new URL(value.slice(1), base).href;
    }
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}
