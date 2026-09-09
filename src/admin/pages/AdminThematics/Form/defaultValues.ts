import type { BoardFormData } from "../../../validations/board,schema";

export const boardDefaultValues: BoardFormData = {
  title: "",
  candidateId: "",
  advisorId: "",
  members: [],
  date: "",
  meetingUrl: "",
};
