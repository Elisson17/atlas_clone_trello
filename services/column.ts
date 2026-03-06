import api from "./config";
import type { Column, ColumnsResponse } from "@/models/column";

export const columnService = {
  list(boardId: number) {
    return api.get<ColumnsResponse>(`/boards/${boardId}/columns`);
  },

  create(boardId: number, data: { name: string; color: string }) {
    return api.post<Column>(`/boards/${boardId}/columns`, { column: data });
  },

  update(id: number, data: { name?: string; color?: string; position?: number }) {
    return api.patch<Column>(`/columns/${id}`, { column: data });
  },

  delete(id: number) {
    return api.delete(`/columns/${id}`);
  },

  reorder(positions: Array<{ id: number; position: number }>) {
    return api.patch("/columns/reorder", { columns: positions });
  },
};
