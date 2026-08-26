import type { ImageResponseDto } from "../ImageResponseDto";

export interface CreateBoardRequestDto {
  title: string;

  candidateId: string;

  advisorId: string;

  members: string[];

  images?: ImageResponseDto[];

  date: string;

  meetingUrl?: string;
}
