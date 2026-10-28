import type { TMeetingType } from "../../types/TMeetingType";

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
  meetingId: string | null;
  meeting: {
    id: string;
    slug: string;
    title: string;
    type: TMeetingType;
    isInternal: boolean;
  } | null;
  createdAt: string;
  updatedAt: string;
}
