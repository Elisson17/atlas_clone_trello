import { authService } from "@/services/auth";
import { setTokens, clearTokens, getRefreshToken } from "@/utils/tokens";
import type { User } from "@/models/user";
import { AxiosError } from "axios";

interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function loginAction(
  email: string,
  password: string,
): Promise<ActionResult<User>> {
  try {
    const response = await authService.login(email, password);
    const { user, access_token, refresh_token } = response.data;
    setTokens(access_token, refresh_token);
    return { success: true, data: user };
  } catch (error) {
    const axiosError = error as AxiosError<{ error: string }>;
    return {
      success: false,
      error: axiosError.response?.data?.error || "Erro ao fazer login",
    };
  }
}

export async function registerAction(data: {
  email: string;
  password: string;
  password_confirmation: string;
  first_name: string;
  last_name: string;
  username: string;
}): Promise<ActionResult> {
  try {
    await authService.register(data);
    return { success: true };
  } catch (error) {
    const axiosError = error as AxiosError<{
      errors: Record<string, string[]>;
    }>;
    const errors = axiosError.response?.data?.errors;
    const firstError = errors
      ? Object.values(errors).flat()[0]
      : "Erro ao criar conta";
    return { success: false, error: firstError };
  }
}

export async function logoutAction(): Promise<ActionResult> {
  try {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      await authService.logout(refreshToken);
    }
    clearTokens();
    return { success: true };
  } catch {
    clearTokens();
    return { success: true };
  }
}

export async function forgotPasswordAction(
  email: string,
): Promise<ActionResult> {
  try {
    await authService.forgotPassword(email);
    return { success: true };
  } catch (error) {
    const axiosError = error as AxiosError<{ error: string }>;
    return {
      success: false,
      error: axiosError.response?.data?.error || "Erro ao enviar email",
    };
  }
}

export async function resetPasswordAction(
  token: string,
  password: string,
  passwordConfirmation: string,
): Promise<ActionResult> {
  try {
    await authService.resetPassword(token, password, passwordConfirmation);
    return { success: true };
  } catch (error) {
    const axiosError = error as AxiosError<{ error: string }>;
    return {
      success: false,
      error: axiosError.response?.data?.error || "Erro ao redefinir senha",
    };
  }
}

export async function fetchProfileAction(): Promise<ActionResult<User>> {
  try {
    const response = await authService.getProfile();
    return { success: true, data: response.data };
  } catch {
    return { success: false, error: "Erro ao carregar perfil" };
  }
}

export async function googleAuthAction(
  idToken: string,
): Promise<ActionResult<User>> {
  try {
    const response = await authService.googleAuth(idToken);
    const { user, access_token, refresh_token } = response.data;
    setTokens(access_token, refresh_token);
    return { success: true, data: user };
  } catch (error) {
    const axiosError = error as AxiosError<{ error: string }>;
    return {
      success: false,
      error: axiosError.response?.data?.error || "Erro ao entrar com Google",
    };
  }
}
