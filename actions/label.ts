import { labelService } from "@/services/label";
import type { Label, LabelsResponse } from "@/models/label";
import { AxiosError } from "axios";

interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function fetchLabelsAction(
  boardId: number,
): Promise<ActionResult<LabelsResponse>> {
  try {
    const response = await labelService.list(boardId);
    const data = response.data;
    return { success: true, data };
  } catch {
    return { success: false, error: "Erro ao carregar etiquetas" };
  }
}

export async function createLabelAction(
  boardId: number,
  data: { name: string; color: string },
): Promise<ActionResult<Label>> {
  try {
    const response = await labelService.create(boardId, data);
    return { success: true, data: response.data };
  } catch (error) {
    const axiosError = error as AxiosError<{
      errors: Record<string, string[]>;
    }>;
    const errors = axiosError.response?.data?.errors;
    const firstError = errors
      ? Object.values(errors).flat()[0]
      : "Erro ao criar etiqueta";
    return { success: false, error: firstError };
  }
}

export async function updateLabelAction(
  id: number,
  data: { name?: string; color?: string },
): Promise<ActionResult<Label>> {
  try {
    const response = await labelService.update(id, data);
    return { success: true, data: response.data };
  } catch (error) {
    const axiosError = error as AxiosError<{ error: string }>;
    return {
      success: false,
      error: axiosError.response?.data?.error || "Erro ao atualizar etiqueta",
    };
  }
}

export async function deleteLabelAction(id: number): Promise<ActionResult> {
  try {
    await labelService.delete(id);
    return { success: true };
  } catch (error) {
    const axiosError = error as AxiosError<{ error: string }>;
    return {
      success: false,
      error: axiosError.response?.data?.error || "Erro ao excluir etiqueta",
    };
  }
}

export async function addLabelToCardAction(
  cardId: number,
  labelId: number,
): Promise<ActionResult> {
  try {
    await labelService.addToCard(cardId, labelId);
    return { success: true };
  } catch {
    return { success: false, error: "Erro ao adicionar etiqueta" };
  }
}

export async function removeLabelFromCardAction(
  cardLabelId: number,
): Promise<ActionResult> {
  try {
    await labelService.removeFromCard(cardLabelId);
    return { success: true };
  } catch {
    return { success: false, error: "Erro ao remover etiqueta" };
  }
}
