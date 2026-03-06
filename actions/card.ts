import { cardService } from "@/services/card";
import type { Card, CardDetail } from "@/models/card";
import { AxiosError } from "axios";

interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function fetchCardAction(
  id: number,
): Promise<ActionResult<CardDetail>> {
  try {
    const response = await cardService.get(id);
    return { success: true, data: response.data };
  } catch {
    return { success: false, error: "Erro ao carregar cartão" };
  }
}

export async function createCardAction(
  columnId: number,
  title: string,
): Promise<ActionResult<Card>> {
  try {
    const response = await cardService.create(columnId, { title });
    return { success: true, data: response.data };
  } catch (error) {
    const axiosError = error as AxiosError<{
      errors: Record<string, string[]>;
    }>;
    const errors = axiosError.response?.data?.errors;
    const firstError = errors
      ? Object.values(errors).flat()[0]
      : "Erro ao criar cartão";
    return { success: false, error: firstError };
  }
}

export async function updateCardAction(
  id: number,
  data: {
    title?: string;
    description?: string | null;
    priority?: string | null;
    assignee_id?: number | null;
    start_date?: string | null;
    due_date?: string | null;
  },
): Promise<ActionResult<Card>> {
  try {
    const response = await cardService.update(id, data);
    return { success: true, data: response.data };
  } catch (error) {
    const axiosError = error as AxiosError<{ error: string }>;
    return {
      success: false,
      error: axiosError.response?.data?.error || "Erro ao atualizar cartão",
    };
  }
}

export async function deleteCardAction(id: number): Promise<ActionResult> {
  try {
    await cardService.delete(id);
    return { success: true };
  } catch (error) {
    const axiosError = error as AxiosError<{ error: string }>;
    return {
      success: false,
      error: axiosError.response?.data?.error || "Erro ao excluir cartão",
    };
  }
}

export async function moveCardAction(
  id: number,
  columnId: number,
  position: number,
): Promise<ActionResult> {
  try {
    console.log("Moving card:", { id, columnId, position });
    await cardService.move(id, columnId, position);
    return { success: true };
  } catch {
    return { success: false, error: "Erro ao mover cartão" };
  }
}
