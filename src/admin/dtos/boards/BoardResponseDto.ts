import type { ImageResponseDto } from "../ImageResponseDto";
import type { PersonResponseDto } from "../people/PersonResponseDto";

export interface BoardResponseDto {
  id: string;

  slug: string;

  title: string;

  candidateId: string;

  candidate: PersonResponseDto;

  advisorId: string;

  advisor: PersonResponseDto;

  date: string;

  meetingUrl?: string;

  members: PersonResponseDto[];

  images: ImageResponseDto[];

  createdAt: string;

  updatedAt: string;
}
