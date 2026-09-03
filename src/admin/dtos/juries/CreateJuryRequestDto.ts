export interface CreateJuryRequestDto {
  title: string;

  date: string;

  location?: string;

  description?: string;

  judges?: string[];

  jurors?: string[];

  prosecutors?: string[];

  defenders?: string[];

  bailiffs?: string[];

  documentUrl?: string;

  registrationUrl?: string;

  recordingUrl?: string;

  meetingUrl?: string;
}
