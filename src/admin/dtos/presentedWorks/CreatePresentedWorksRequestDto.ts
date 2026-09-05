export interface CreatePresentedWorkRequestDto {
  title: string;

  date: string;

  location?: string;

  meetingId?: string;

  documentUrl?: string;

  registrationUrl?: string;

  recordingUrl?: string;

  meetingUrl?: string;

  authors: string[];
}
