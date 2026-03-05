import { z } from "zod";

export const createLabelSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(50, "Nome deve ter no máximo 50 caracteres"),
  color: z.string().min(1, "Cor é obrigatória"),
});

export const updateLabelSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(50, "Nome deve ter no máximo 50 caracteres").optional(),
  color: z.string().optional(),
});

export type CreateLabelFormData = z.infer<typeof createLabelSchema>;
export type UpdateLabelFormData = z.infer<typeof updateLabelSchema>;
