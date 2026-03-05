import { z } from "zod";

export const updateProfileSchema = z.object({
  first_name: z.string().min(1, "Nome é obrigatório").optional(),
  last_name: z.string().min(1, "Sobrenome é obrigatório").optional(),
  username: z
    .string()
    .min(3, "Username deve ter pelo menos 3 caracteres")
    .max(30, "Username deve ter no máximo 30 caracteres")
    .regex(/^[a-zA-Z0-9_]+$/, "Username deve conter apenas letras, números e _")
    .optional(),
  bio: z.string().max(500, "Bio deve ter no máximo 500 caracteres").nullable().optional(),
});

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, "Senha atual é obrigatória"),
    password: z.string().min(6, "A nova senha deve ter pelo menos 6 caracteres"),
    password_confirmation: z.string().min(6, "Confirmação de senha é obrigatória"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "As senhas não coincidem",
    path: ["password_confirmation"],
  });

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
