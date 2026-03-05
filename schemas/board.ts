import { z } from "zod";

export const createBoardSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome deve ter no máximo 100 caracteres"),
  description: z.string().max(500, "Descrição deve ter no máximo 500 caracteres").optional(),
  board_type: z.enum(["personal", "team"]),
});

export const updateBoardSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome deve ter no máximo 100 caracteres").optional(),
  description: z.string().max(500, "Descrição deve ter no máximo 500 caracteres").optional(),
  board_type: z.enum(["personal", "team"]).optional(),
});

export const joinBoardSchema = z.object({
  invite_code: z.string().min(1, "Código de convite é obrigatório"),
});

export type CreateBoardFormData = z.infer<typeof createBoardSchema>;
export type UpdateBoardFormData = z.infer<typeof updateBoardSchema>;
export type JoinBoardFormData = z.infer<typeof joinBoardSchema>;
