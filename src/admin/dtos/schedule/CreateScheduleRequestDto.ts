export interface CreateScheduleRequestDto {
  title: string;
  subtitle?: string | null;
  description?: string | null;
  date: string;
  endDate?: string | null;
  location?: string | null;
  externalUrl?: string | null;
}
