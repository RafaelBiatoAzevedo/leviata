import { api } from "../../services/api";
import type { SummaryReportResponseDto } from "../dtos/reports/SummaryReportResponseDto";

export const reportsService = {
  getSummary() {
    return api.get<SummaryReportResponseDto>("/reports/summary");
  },
};
