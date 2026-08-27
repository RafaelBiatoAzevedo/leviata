import type { TMeetingType } from "../../types/TMeetingType";

export interface CreateMeetingRequestDto {
  title: string;

  type: TMeetingType;

  description?: string;

  date: string;

  location?: string;

  registrationUrl?: string;

  meetingUrl?: string;

  speakers: string[];
}
