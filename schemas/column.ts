import { z } from "zod";

export const createColumnSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(50, "Nome deve ter no máximo 50 caracteres"),
  color: z.string().min(1, "Cor é obrigatória"),
});

export const updateColumnSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(50, "Nome deve ter no máximo 50 caracteres").optional(),
  color: z.string().optional(),
});

export type CreateColumnFormData = z.infer<typeof createColumnSchema>;
export type UpdateColumnFormData = z.infer<typeof updateColumnSchema>;
