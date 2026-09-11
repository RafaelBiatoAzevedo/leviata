import type { BoardResponseDto } from "../dtos/boards/BoardResponseDto";
import type { CreateBoardRequestDto } from "../dtos/boards/CreateBoardRequestDto";
import type { BoardFormData } from "../validations/board.schema";

export function mapBoardToForm(board: BoardResponseDto): BoardFormData {
  return {
    title: board.title,

    date: board.date ? new Date(board.date).toISOString().split("T")[0] : "",

    members: board.members.map((member) => member.id!),

    candidateId: board.candidateId,

    advisorId: board.advisorId,

    meetingUrl: board.meetingUrl ?? "",
  };
}

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
