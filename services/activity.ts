import api from "./config";
import type { Activity } from "@/models/activity";

export const activityService = {
  list(cardId: number) {
    return api.get<Activity[]>(`/cards/${cardId}/activities`);
  },
};
