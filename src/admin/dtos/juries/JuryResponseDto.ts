import type { ImageResponseDto } from "../ImageResponseDto";
import type { PersonResponseDto } from "../people/PersonResponseDto";

export interface JuryResponseDto {
  id: string;

  slug: string;

  title: string;

  coverUrl: string | null;

  date: string;

  location: string;

  description: string;

  images: ImageResponseDto[];

  judges: PersonResponseDto[];

  jurors: PersonResponseDto[];

  prosecutors: PersonResponseDto[];

  defenders: PersonResponseDto[];

  bailiffs: PersonResponseDto[];

  documentUrl?: string;

  registrationUrl: string | null;

  recordingUrl: string | null;

  meetingUrl: string | null;

  createdAt: string;

  updatedAt: string;
}
