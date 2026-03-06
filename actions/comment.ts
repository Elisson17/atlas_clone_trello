import { commentService } from "@/services/comment";
import type { Comment, CommentResponse } from "@/models/comment";
import { AxiosError } from "axios";

interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function fetchCommentsAction(
  cardId: number,
): Promise<ActionResult<CommentResponse>> {
  try {
    const response = await commentService.list(cardId);
    const data = response.data;
    return { success: true, data };
  } catch {
    return { success: false, error: "Erro ao carregar comentários" };
  }
}

export async function createCommentAction(
  cardId: number,
  body: string,
): Promise<ActionResult<Comment>> {
  try {
    const response = await commentService.create(cardId, body);
    return { success: true, data: response.data };
  } catch (error) {
    const axiosError = error as AxiosError<{ error: string }>;
    return {
      success: false,
      error: axiosError.response?.data?.error || "Erro ao criar comentário",
    };
  }
}

export async function updateCommentAction(
  id: number,
  body: string,
): Promise<ActionResult<Comment>> {
  try {
    const response = await commentService.update(id, body);
    return { success: true, data: response.data };
  } catch (error) {
    const axiosError = error as AxiosError<{ error: string }>;
    return {
      success: false,
      error: axiosError.response?.data?.error || "Erro ao atualizar comentário",
    };
  }
}

export async function deleteCommentAction(id: number): Promise<ActionResult> {
  try {
    await commentService.delete(id);
    return { success: true };
  } catch (error) {
    const axiosError = error as AxiosError<{ error: string }>;
    return {
      success: false,
      error: axiosError.response?.data?.error || "Erro ao excluir comentário",
    };
  }
}
