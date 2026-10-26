import { api } from "../../services/api";
import type { CommentTarget } from "../../services/comments";

export type NotificationType = "INFO" | "REMINDER" | "COMMENT";
export interface AdminNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  visibleAt: string;
  readAt: string | null;
  resolution: "APPROVED" | "REJECTED" | null;
  targetTitle: string | null;
  targetPath: string | null;
  comment: {
    id: string;
    fullName: string;
    text: string;
    status: "PENDING" | "APPROVED";
    targetType: CommentTarget;
    targetId: string;
  } | null;
}
export interface NotificationCounts {
  unreadCount: number;
  pendingCount: number;
}
export interface NotificationsPage extends NotificationCounts {
  items: AdminNotification[];
  total: number;
  page: number;
  limit: number;
}
export interface NotificationQuery {
  page?: number;
  limit?: number;
  type?: NotificationType;
  status?: "all" | "unread" | "pending" | "scheduled";
}

export const notificationsService = {
  counts(signal?: AbortSignal) {
    return api.get<NotificationCounts>("/notifications/counts", { signal });
  },
  list(params: NotificationQuery, signal?: AbortSignal) {
    return api.get<NotificationsPage>("/notifications", { params, signal });
  },
  get(id: string, signal?: AbortSignal) {
    return api.get<AdminNotification>(`/notifications/${id}`, { signal });
  },
  read(id: string) {
    return api.patch(`/notifications/${id}/read`);
  },
  readAll() {
    return api.patch("/notifications/read-all");
  },
  moderate(id: string, decision: "approve" | "reject") {
    return api.patch(`/comments/${id}/moderation`, { decision });
  },
  create(values: {
    type: "INFO" | "REMINDER";
    title: string;
    message: string;
    visibleAt?: string;
  }) {
    return api.post("/notifications", values);
  },
};
