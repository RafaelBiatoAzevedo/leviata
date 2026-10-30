import type { BoardFormData } from "../../../validations/board.schema";

export const boardDefaultValues: BoardFormData = {
  title: "",
  type: "",
  candidateId: "",
  advisorId: "",
  members: [],
  date: "",
  meetingUrl: "",
};
