import { api } from "../../services/api";
import type { SummaryReportResponseDto } from "../dtos/reports/SummaryReportResponseDto";

export const reportsService = {
  getSummary(signal?: AbortSignal) {
    return api.get<SummaryReportResponseDto>("/reports/summary", {
      signal,
      headers: { "Cache-Control": "no-cache" },
    });
  },
};
