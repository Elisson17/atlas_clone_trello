import api from "./config";
import type { Comment } from "@/models/comment";

export const commentService = {
  list(cardId: number) {
    return api.get<Comment[]>(`/cards/${cardId}/comments`);
  },

  create(cardId: number, body: string) {
    return api.post<Comment>(`/cards/${cardId}/comments`, {
      comment: { body },
    });
  },

  update(id: number, body: string) {
    return api.patch<Comment>(`/comments/${id}`, {
      comment: { body },
    });
  },

  delete(id: number) {
    return api.delete(`/comments/${id}`);
  },
};
