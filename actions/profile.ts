import { profileService } from "@/services/profile";
import type { User } from "@/models/user";
import { AxiosError } from "axios";

interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function updateProfileAction(data: {
  first_name?: string;
  last_name?: string;
  username?: string;
  bio?: string | null;
}): Promise<ActionResult<User>> {
  try {
    const response = await profileService.update(data);
    return { success: true, data: response.data };
  } catch (error) {
    const axiosError = error as AxiosError<{
      errors: Record<string, string[]>;
    }>;
    const errors = axiosError.response?.data?.errors;
    const firstError = errors
      ? Object.values(errors).flat()[0]
      : "Erro ao atualizar perfil";
    return { success: false, error: firstError };
  }
}

export async function uploadAvatarAction(
  file: File,
): Promise<ActionResult<User>> {
  try {
    const response = await profileService.uploadAvatar(file);
    return { success: true, data: response.data };
  } catch (error) {
    const axiosError = error as AxiosError<{ error: string }>;
    return {
      success: false,
      error: axiosError.response?.data?.error || "Erro ao enviar avatar",
    };
  }
}

export async function changePasswordAction(data: {
  current_password: string;
  password: string;
  password_confirmation: string;
}): Promise<ActionResult> {
  try {
    await profileService.changePassword(data);
    return { success: true };
  } catch (error) {
    const axiosError = error as AxiosError<{ error: string }>;
    return {
      success: false,
      error: axiosError.response?.data?.error || "Erro ao alterar senha",
    };
  }
}
