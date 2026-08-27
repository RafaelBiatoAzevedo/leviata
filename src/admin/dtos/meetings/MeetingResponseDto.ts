import type { TMeetingType } from "../../types/TMeetingType";
import type { ImageResponseDto } from "../ImageResponseDto";
import type { PersonResponseDto } from "../people/PersonResponseDto";

export type Speaker = Partial<PersonResponseDto>;

export interface MeetingResponseDto {
  id: string;

  slug: string;

  type: TMeetingType;

  title: string;

  coverUrl: string | null;

  description: string | null;

  date: string;

  location: string | null;

  registrationUrl: string | null;

  meetingUrl: string | null;

  speakers: Speaker[];

  images: ImageResponseDto[];

  createdAt: string;

  updatedAt: string;
}
