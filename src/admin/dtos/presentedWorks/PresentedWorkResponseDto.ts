import type { ImageResponseDto } from "../ImageResponseDto";
import type { MeetingResponseDto } from "../meetings/MeetingResponseDto";
import type { PersonResponseDto } from "../people/PersonResponseDto";

export interface PresentedWorkResponseDto {
  id: string;

  slug: string;

  title: string;

  date: string;

  location: string | null;

  images: ImageResponseDto[];

  meetingId: string | null;

  meeting: MeetingResponseDto | null;

  authors: PersonResponseDto[];

  documentUrl: string | null;

  registrationUrl: string | null;

  recordingUrl: string | null;

  meetingUrl: string | null;

  createdAt: string;

  updatedAt: string;
}
