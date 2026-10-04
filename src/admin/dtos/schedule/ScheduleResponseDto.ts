export interface ScheduleResponseDto {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  date: string;
  endDate: string | null;
  location: string | null;
  externalUrl: string | null;
  createdAt: string;
  updatedAt: string;
}
