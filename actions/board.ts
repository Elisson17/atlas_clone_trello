import { boardService } from "@/services/board";
import type { Board, BoardMember, BoardsResponse } from "@/models/board";
import { AxiosError } from "axios";

interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function fetchBoardsAction(): Promise<
  ActionResult<BoardsResponse>
> {
  try {
    const response = await boardService.list();
    const data = response.data;
    return { success: true, data };
  } catch {
    return { success: false, error: "Erro ao carregar boards" };
  }
}

export async function fetchBoardAction(
  id: number,
): Promise<ActionResult<Board>> {
  try {
    const response = await boardService.get(id);
    return { success: true, data: response.data };
  } catch {
    return { success: false, error: "Erro ao carregar board" };
  }
}

export async function createBoardAction(data: {
  name: string;
  description?: string;
  board_type: string;
}): Promise<ActionResult<Board>> {
  try {
    const response = await boardService.create(data);
    return { success: true, data: response.data };
  } catch (error) {
    const axiosError = error as AxiosError<{
      errors: Record<string, string[]>;
    }>;
    const errors = axiosError.response?.data?.errors;
    const firstError = errors
      ? Object.values(errors).flat()[0]
      : "Erro ao criar board";
    return { success: false, error: firstError };
  }
}

export async function updateBoardAction(
  id: number,
  data: { name?: string; description?: string; board_type?: string },
): Promise<ActionResult<Board>> {
  try {
    const response = await boardService.update(id, data);
    return { success: true, data: response.data };
  } catch (error) {
    const axiosError = error as AxiosError<{ error: string }>;
    return {
      success: false,
      error: axiosError.response?.data?.error || "Erro ao atualizar board",
    };
  }
}

export async function deleteBoardAction(id: number): Promise<ActionResult> {
  try {
    await boardService.delete(id);
    return { success: true };
  } catch (error) {
    const axiosError = error as AxiosError<{ error: string }>;
    return {
      success: false,
      error: axiosError.response?.data?.error || "Erro ao excluir board",
    };
  }
}

export async function joinBoardAction(
  inviteCode: string,
): Promise<ActionResult<Board>> {
  try {
    const response = await boardService.join(inviteCode);
    return { success: true, data: response.data };
  } catch (error) {
    const axiosError = error as AxiosError<{ error: string }>;
    return {
      success: false,
      error: axiosError.response?.data?.error || "Código de convite inválido",
    };
  }
}

export async function toggleFavoriteAction(
  id: number,
  isFavorite: boolean,
): Promise<ActionResult> {
  try {
    if (isFavorite) {
      await boardService.unfavorite(id);
    } else {
      await boardService.favorite(id);
    }
    return { success: true };
  } catch {
    return { success: false, error: "Erro ao atualizar favorito" };
  }
}

export async function fetchMembersAction(
  boardId: number,
): Promise<ActionResult<{ owner: BoardMember; members: BoardMember[] }>> {
  try {
    const response = await boardService.getMembers(boardId);
    return {
      success: true,
      data: response.data,
    };
  } catch {
    return { success: false, error: "Erro ao carregar membros" };
  }
}

export async function removeMemberAction(
  boardId: number,
  memberId: number,
): Promise<ActionResult> {
  try {
    await boardService.removeMember(boardId, memberId);
    return { success: true };
  } catch (error) {
    const axiosError = error as AxiosError<{ error: string }>;
    return {
      success: false,
      error: axiosError.response?.data?.error || "Erro ao remover membro",
    };
  }
}
