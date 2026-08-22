export interface CreateBoardRequestDto {
  title: string;

  candidateId: string;

  advisorId: string;

  members: string[];

  date: string;

  externalUrl: string;
}
