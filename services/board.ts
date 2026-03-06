import api from "./config";
import type { Board, BoardMembersResponse, BoardsResponse } from "@/models/board";

export const boardService = {
  list() {
    return api.get<BoardsResponse>("/boards");
  },

  get(id: number) {
    return api.get<Board>(`/boards/${id}`);
  },

  create(data: { name: string; description?: string; board_type: string }) {
    return api.post<Board>("/boards", { board: data });
  },

  update(
    id: number,
    data: { name?: string; description?: string; board_type?: string },
  ) {
    return api.patch<Board>(`/boards/${id}`, { board: data });
  },

  delete(id: number) {
    return api.delete(`/boards/${id}`);
  },

  join(inviteCode: string) {
    return api.post<Board>("/boards/join", { invite_code: inviteCode });
  },

  regenerateInviteCode(id: number) {
    return api.post<{ invite_code: string }>(
      `/boards/${id}/regenerate_invite_code`,
    );
  },

  favorite(id: number) {
    return api.post(`/boards/${id}/favorite`);
  },

  unfavorite(id: number) {
    return api.delete(`/boards/${id}/favorite`);
  },

  getMembers(id: number) {
    return api.get<BoardMembersResponse>(`/boards/${id}/members`);
  },

  updateMember(boardId: number, memberId: number, role: string) {
    return api.patch(`/boards/${boardId}/members/${memberId}`, {
      board_member: { role },
    });
  },

  removeMember(boardId: number, memberId: number) {
    return api.delete(`/boards/${boardId}/members/${memberId}`);
  },
};
