import type { CreateBoardRequestDto } from "../dtos/boards/CreateBoardRequestDto";
import type { BoardFormData } from "../validations/board,schema";

export function mapBoardToCreateDto(
  data: BoardFormData,
): CreateBoardRequestDto {
  return {
    title: data.title,
    candidateId: data.candidateId,
    advisorId: data.advisorId,
    members: data.members,
    date: data.date,
    meetingUrl: data.meetingUrl,
  };
}
