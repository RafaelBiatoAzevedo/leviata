import type { BoardResponseDto } from "../dtos/boards/BoardResponseDto";
import type { CreateBoardRequestDto } from "../dtos/boards/CreateBoardRequestDto";
import type { BoardFormData } from "../validations/board.schema";
import { toLocalDateTime } from "../utils/dateTime";

export function mapBoardToForm(board: BoardResponseDto): BoardFormData {
  return {
    title: board.title,

    type: board.type ?? "",

    date: toLocalDateTime(board.date),

    members: board.members.map((member) => member.id!),

    candidateId: board.candidateId,

    advisorId: board.advisorId,

    meetingUrl: board.meetingUrl ?? "",
  };
}

export function mapBoardToCreateDto(
  data: BoardFormData,
): CreateBoardRequestDto {
  if (!data.type) throw new Error("Selecione o tipo de banca.");
  return {
    title: data.title,

    type: data.type,

    candidateId: data.candidateId,

    advisorId: data.advisorId,

    members: data.members,

    date: new Date(data.date).toISOString(),

    meetingUrl: data.meetingUrl,
  };
}
