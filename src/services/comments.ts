import { api } from "./api";

export type CommentTarget =
  | "THEMATIC"
  | "RESEARCH_INSTRUMENT"
  | "BOARD"
  | "JURY"
  | "MEETING"
  | "PRESENTED_WORK"
  | "RESEARCH"
  | "NEWS";
export interface CommentPageTarget {
  targetType: CommentTarget;
  targetId: string;
}
export interface PublicComment {
  id: string;
  fullName: string;
  text: string;
  approvedAt: string;
}
export interface CommentsPage {
  items: PublicComment[];
  total: number;
  page: number;
  limit: number;
}

export const commentsService = {
  list(target: CommentPageTarget, page = 1, signal?: AbortSignal) {
    return api.get<CommentsPage>("/comments", {
      params: { ...target, page, limit: 30 },
      signal,
    });
  },
  create(
    target: CommentPageTarget,
    values: { fullName: string; text: string },
  ) {
    return api.post<{ message: string }>("/comments", { ...target, ...values });
  },
};
