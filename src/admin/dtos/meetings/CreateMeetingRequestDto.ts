import type { TMeetingType } from "../../types/TMeetingType";

export interface CreateMeetingRequestDto {
  title: string;

  type: TMeetingType;

  isInternal: boolean;

  description?: string;

  date: string;

  location?: string;

  registrationUrl?: string;

  recordingUrl?: string;

  meetingUrl?: string;

  speakers: string[];
}
