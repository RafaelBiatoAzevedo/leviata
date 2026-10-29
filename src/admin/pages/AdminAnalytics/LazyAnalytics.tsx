import { lazy, Suspense } from "react";

const Analytics = lazy(() =>
  import("./index").then((module) => ({ default: module.AdminAnalytics })),
);

export function AdminAnalyticsRoute() {
  return (
    <Suspense fallback={<p role="status">Carregando Observatório…</p>}>
      <Analytics />
    </Suspense>
  );
}
