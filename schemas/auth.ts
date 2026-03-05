import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export const registerSchema = z
  .object({
    first_name: z.string().min(1, "Nome é obrigatório"),
    last_name: z.string().min(1, "Sobrenome é obrigatório"),
    username: z
      .string()
      .min(3, "Username deve ter pelo menos 3 caracteres")
      .max(30, "Username deve ter no máximo 30 caracteres")
      .regex(/^[a-zA-Z0-9_]+$/, "Username deve conter apenas letras, números e _"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    password_confirmation: z.string().min(6, "Confirmação de senha é obrigatória"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "As senhas não coincidem",
    path: ["password_confirmation"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    password_confirmation: z.string().min(6, "Confirmação de senha é obrigatória"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "As senhas não coincidem",
    path: ["password_confirmation"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
