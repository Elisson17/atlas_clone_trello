import { columnService } from "@/services/column";
import type { Column, ColumnsResponse } from "@/models/column";
import { AxiosError } from "axios";

interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function fetchColumnsAction(
  boardId: number,
): Promise<ActionResult<ColumnsResponse>> {
  try {
    const response = await columnService.list(boardId);
    const data = response.data;
    return { success: true, data };
  } catch {
    return { success: false, error: "Erro ao carregar colunas" };
  }
}

export async function createColumnAction(
  boardId: number,
  data: { name: string; color: string },
): Promise<ActionResult<Column>> {
  try {
    const response = await columnService.create(boardId, data);
    return { success: true, data: response.data };
  } catch (error) {
    const axiosError = error as AxiosError<{
      errors: Record<string, string[]>;
    }>;
    const errors = axiosError.response?.data?.errors;
    const firstError = errors
      ? Object.values(errors).flat()[0]
      : "Erro ao criar coluna";
    return { success: false, error: firstError };
  }
}

export async function updateColumnAction(
  id: number,
  data: { name?: string; color?: string; position?: number },
): Promise<ActionResult<Column>> {
  try {
    const response = await columnService.update(id, data);
    return { success: true, data: response.data };
  } catch (error) {
    const axiosError = error as AxiosError<{ error: string }>;
    return {
      success: false,
      error: axiosError.response?.data?.error || "Erro ao atualizar coluna",
    };
  }
}

export async function deleteColumnAction(id: number): Promise<ActionResult> {
  try {
    await columnService.delete(id);
    return { success: true };
  } catch (error) {
    const axiosError = error as AxiosError<{ error: string }>;
    return {
      success: false,
      error: axiosError.response?.data?.error || "Erro ao excluir coluna",
    };
  }
}

export async function reorderColumnsAction(
  positions: Array<{ id: number; position: number }>,
): Promise<ActionResult> {
  try {
    await columnService.reorder(positions);
    return { success: true };
  } catch {
    return { success: false, error: "Erro ao reordenar colunas" };
  }
}
