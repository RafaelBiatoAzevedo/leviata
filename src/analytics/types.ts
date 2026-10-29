export const TIMEZONE = "America/Sao_Paulo";

export interface AnalyticsRange {
  from: string;
  to: string;
  previousFrom: string;
  previousTo: string;
  days: number;
}
export interface AnalyticsRow {
  key: string;
  label: string;
  views: number;
}
export interface AnalyticsData {
  pageviews: number;
  previousPageviews: number;
  changePercent: number | null;
  comparisonReliable: boolean;
  averagePerDay: number;
  activeDays: number;
  sessions: null;
  uniqueVisitors: null;
  pagesPerSession: null;
  series: { date: string; views: number; previousViews: number }[];
  pages: AnalyticsRow[];
  sections: AnalyticsRow[];
  sources: AnalyticsRow[];
  devices: AnalyticsRow[];
  browsers: AnalyticsRow[];
}
export interface AnalyticsReport {
  status: "ready" | "not_configured" | "unavailable" | "quota_reached";
  provider: "first-party";
  timezone: typeof TIMEZONE;
  range: AnalyticsRange;
  generatedAt: string;
  cacheSeconds: number;
  retentionDays: number;
  earliestAvailableDate: string | null;
  missing: string[];
  quota: { month: string; used: number; limit: number } | null;
  limitedMonths: string[];
  data: AnalyticsData | null;
}
