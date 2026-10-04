export interface ScheduleQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: "title" | "date" | "createdAt";
  sortOrder?: "asc" | "desc";
}
