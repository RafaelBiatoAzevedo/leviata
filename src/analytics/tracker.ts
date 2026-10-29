import { PAGE_LABELS } from "./route-catalog";
import { analyticsOptedOut, privacySignal } from "./privacy";

const routes = Object.keys(PAGE_LABELS)
  .sort((a, b) => {
    const dynamic = (path: string) => (path.match(/:/g) ?? []).length;
    return dynamic(a) - dynamic(b) || b.length - a.length;
  })
  .map((path) => ({
    path,
    pattern: new RegExp(`^${path.replace(/:[a-z]+/g, "[^/]+")}$`),
  }));

export function analyticsPath(pathname: string): string | null {
  if (pathname.length > 2048 || /[?#]/.test(pathname)) return null;
  const clean = pathname.replace(/\/+$/, "") || "/";
  return routes.find((route) => route.pattern.test(clean))?.path ?? null;
}

export function trafficSource(referrer: string, origin: string): string {
  try {
    if (!referrer) return "direct";
    const url = new URL(referrer);
    if (url.origin === origin) return "internal";
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    const matches = (domain: string) =>
      host === domain || host.endsWith(`.${domain}`);
    if (
      /^(?:[a-z0-9-]+\.)*google\.(?:com|com\.br|co\.uk|pt|es|fr|de)$/.test(host)
    )
      return "google";
    for (const [domain, name] of [
      ["bing.com", "bing"],
      ["duckduckgo.com", "duckduckgo"],
      ["yahoo.com", "yahoo"],
      ["instagram.com", "instagram"],
      ["facebook.com", "facebook"],
      ["youtube.com", "youtube"],
      ["linkedin.com", "linkedin"],
    ])
      if (matches(domain)) return name;
    return "other";
  } catch {
    return "direct";
  }
}

// In-memory only: no visitor/session ID, no persistent navigation history.
export function createPageviewTracker(
  send: (body: { id: string; path: string; source: string }) => void,
) {
  let previousPath: string | null = null;
  return (pathname: string, source: string) => {
    if (pathname === previousPath) return;
    previousPath = pathname;
    const path = analyticsPath(pathname);
    if (
      !path ||
      analyticsOptedOut() ||
      privacySignal() ||
      navigator.webdriver ||
      !crypto.randomUUID
    )
      return;
    send({ id: crypto.randomUUID(), path, source });
  };
}
