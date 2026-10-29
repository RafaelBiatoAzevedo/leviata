import { api } from "../../services/api";
import type { AnalyticsReport } from "../../analytics/types";

export const analyticsService = {
  report(params: { from: string; to: string }, signal?: AbortSignal) {
    return api.get<AnalyticsReport>("/analytics/report", {
      params,
      signal,
      timeout: 10000,
    });
  },
};
