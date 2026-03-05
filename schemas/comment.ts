import { z } from "zod";

export const createCommentSchema = z.object({
  body: z.string().min(1, "Comentário não pode estar vazio"),
});

export const updateCommentSchema = z.object({
  body: z.string().min(1, "Comentário não pode estar vazio"),
});

export type CreateCommentFormData = z.infer<typeof createCommentSchema>;
export type UpdateCommentFormData = z.infer<typeof updateCommentSchema>;
