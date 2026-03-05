import { z } from "zod";

export const createCardSchema = z.object({
  title: z.string().min(1, "Título é obrigatório").max(255, "Título deve ter no máximo 255 caracteres"),
});

export const updateCardSchema = z.object({
  title: z.string().min(1, "Título é obrigatório").max(255, "Título deve ter no máximo 255 caracteres").optional(),
  description: z.string().nullable().optional(),
  priority: z.enum(["urgent", "high", "medium", "low"]).nullable().optional(),
  assignee_id: z.number().nullable().optional(),
  start_date: z.string().nullable().optional(),
  due_date: z.string().nullable().optional(),
});

export type CreateCardFormData = z.infer<typeof createCardSchema>;
export type UpdateCardFormData = z.infer<typeof updateCardSchema>;
