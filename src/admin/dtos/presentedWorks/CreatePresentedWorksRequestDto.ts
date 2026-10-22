export interface CreatePresentedWorkRequestDto {
  title: string;

  date: string;

  location?: string;

  meetingId?: string;

  documentUrl?: string | null;

  registrationUrl?: string | null;

  recordingUrl?: string | null;

  meetingUrl?: string | null;

  authors: string[];
}
