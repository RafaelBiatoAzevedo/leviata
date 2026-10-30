import type { ImageResponseDto } from "../ImageResponseDto";
import type { PersonResponseDto } from "../people/PersonResponseDto";
import type { TBoardType } from "../../types/TBoardType";

export interface BoardResponseDto {
  id: string;

  slug: string;

  title: string;

  type?: TBoardType | null;

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
