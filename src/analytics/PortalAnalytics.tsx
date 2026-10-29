import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { envs } from "../config/env";
import { PRIVACY_EVENT } from "./privacy";
import { createPageviewTracker, trafficSource } from "./tracker";

const track = createPageviewTracker((body) => {
  // Separate transport: never attach JWTs, cookies or the current URL as referrer.
  const endpoint = `${envs.API_BASE_URL?.replace(/\/+$/, "")}/analytics/collect`;
  void fetch(endpoint, {
    method: "POST",
    credentials: "omit",
    referrerPolicy: "no-referrer",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(3000),
    keepalive: true,
  }).catch(() => {
    /* Analytics must never affect portal navigation. */
  });
});

export function PortalAnalytics() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (import.meta.env.VITE_ANALYTICS_ENABLED !== "true" || !envs.API_BASE_URL)
      return;
    const source = trafficSource(document.referrer, window.location.origin);
    let timer: ReturnType<typeof setTimeout> | undefined;
    const visible = () => {
      if (document.visibilityState !== "visible") return;
      clearTimeout(timer);
      // Delay until the route is visible; canceled if navigation changes first.
      timer = setTimeout(() => track(pathname, source), 350);
    };
    visible();
    document.addEventListener("visibilitychange", visible);
    window.addEventListener(PRIVACY_EVENT, visible);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", visible);
      window.removeEventListener(PRIVACY_EVENT, visible);
    };
  }, [pathname]);
  return null;
}
