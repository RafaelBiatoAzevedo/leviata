import { useEffect, useState } from "react";
import type { SummaryReportResponseDto } from "../../dtos/reports/SummaryReportResponseDto";
import type { ScheduleResponseDto } from "../../dtos/schedule/ScheduleResponseDto";
import type { NewsResponseDto } from "../../dtos/news/NewsResponseDto";
import { reportsService } from "../../services/reports";
import { scheduleService } from "../../services/schedule";
import { newsService } from "../../services/news";

export function useDashboard() {
  const [summary, setSummary] = useState<SummaryReportResponseDto | null>(null);
  const [events, setEvents] = useState<ScheduleResponseDto[]>([]);
  const [news, setNews] = useState<NewsResponseDto[]>([]);
  const [errors, setErrors] = useState({
    summary: false,
    events: false,
    news: false,
  });
  const [loading, setLoading] = useState(true);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    let active = true;
    async function load() {
      const [summaryResult, eventsResult, newsResult] =
        await Promise.allSettled([
          reportsService.getSummary(),
          scheduleService.getAll({
            dateFrom: new Date().toISOString(),
            limit: 4,
            sortBy: "date",
            sortOrder: "asc",
          }),
          newsService.getAll({ limit: 4, sortBy: "date", sortOrder: "desc" }),
        ]);
      if (!active) return;
      setSummary(
        summaryResult.status === "fulfilled" ? summaryResult.value.data : null,
      );
      setEvents(
        eventsResult.status === "fulfilled" ? eventsResult.value.data : [],
      );
      setNews(newsResult.status === "fulfilled" ? newsResult.value.data : []);
      setErrors({
        summary: summaryResult.status === "rejected",
        events: eventsResult.status === "rejected",
        news: newsResult.status === "rejected",
      });
      setLoading(false);
    }
    void load();
    return () => {
      active = false;
    };
  }, [revision]);

  function retry() {
    setLoading(true);
    setErrors({ summary: false, events: false, news: false });
    setRevision((value) => value + 1);
  }

  return { summary, events, news, errors, loading, retry };
}
