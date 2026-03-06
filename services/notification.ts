import api from "./config";
import type { NotificationsResponse } from "@/models/notification";

export const notificationService = {
  list() {
    return api.get<NotificationsResponse>("/notifications");
  },

  markAsRead(id: number) {
    return api.patch(`/notifications/${id}/read`);
  },

  markAllAsRead() {
    return api.patch("/notifications/read_all");
  },
};
