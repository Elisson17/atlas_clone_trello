import api from "./config";
import type { Label } from "@/models/label";

export const labelService = {
  list(boardId: number) {
    return api.get<Label[]>(`/boards/${boardId}/labels`);
  },

  create(boardId: number, data: { name: string; color: string }) {
    return api.post<Label>(`/boards/${boardId}/labels`, { label: data });
  },

  update(id: number, data: { name?: string; color?: string }) {
    return api.patch<Label>(`/labels/${id}`, { label: data });
  },

  delete(id: number) {
    return api.delete(`/labels/${id}`);
  },

  addToCard(cardId: number, labelId: number) {
    return api.post(`/cards/${cardId}/labels`, { label_id: labelId });
  },

  removeFromCard(cardLabelId: number) {
    return api.delete(`/card_labels/${cardLabelId}`);
  },
};
