import api from "./config";
import type { Notification } from "@/models/notification";

export const notificationService = {
  list() {
    return api.get<Notification[]>("/notifications");
  },

  markAsRead(id: number) {
    return api.patch(`/notifications/${id}/read`);
  },

  markAllAsRead() {
    return api.patch("/notifications/read_all");
  },
};
