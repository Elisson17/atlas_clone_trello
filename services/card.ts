import api from "./config";
import type { Card, CardDetail } from "@/models/card";

export const cardService = {
  list(columnId: number) {
    return api.get<Card[]>(`/columns/${columnId}/cards`);
  },

  get(id: number) {
    return api.get<CardDetail>(`/cards/${id}`);
  },

  create(columnId: number, data: { title: string }) {
    return api.post<Card>(`/columns/${columnId}/cards`, { card: data });
  },

  update(
    id: number,
    data: {
      title?: string;
      description?: string | null;
      priority?: string | null;
      assignee_id?: number | null;
      start_date?: string | null;
      due_date?: string | null;
    },
  ) {
    return api.patch<Card>(`/cards/${id}`, { card: data });
  },

  delete(id: number) {
    return api.delete(`/cards/${id}`);
  },

  move(id: number, columnId: number, position: number) {
    return api.patch(`/cards/${id}/move`, {
      column_id: columnId,
      position,
    });
  },
};
