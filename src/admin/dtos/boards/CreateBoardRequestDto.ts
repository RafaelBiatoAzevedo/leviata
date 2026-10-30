import type { TBoardType } from "../../types/TBoardType";

export interface CreateBoardRequestDto {
  title: string;

  type: TBoardType;

  candidateId: string;

  advisorId: string;

  members: string[];

  date: string;

  meetingUrl?: string;
}
