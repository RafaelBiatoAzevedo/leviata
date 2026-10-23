import type { TMeetingType } from "../../types/TMeetingType";

export interface CreateMeetingRequestDto {
  title: string;

  type: TMeetingType;

  description?: string;

  date: string;

  location?: string;

  registrationUrl?: string;

  recordingUrl?: string;

  meetingUrl?: string;

  speakers: string[];
}
