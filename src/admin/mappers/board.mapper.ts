import type { BoardResponseDto } from "../dtos/boards/BoardResponseDto";
import type { BoardFormData } from "../validations/board,schema";

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
