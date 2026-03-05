import axios from "axios";
import api from "./config";
import type {
  LoginResponse,
  RefreshResponse,
  RegisterResponse,
} from "@/models/auth";
import type { User } from "@/models/user";

const BASE = process.env.NEXT_PUBLIC_API_URL;
const JSON_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

export const authService = {
  login(email: string, password: string) {
    return axios.post<LoginResponse>(
      `${BASE}/auth/login`,
      { user: { email, password } },
      { headers: JSON_HEADERS },
    );
  },

  register(data: {
    email: string;
    password: string;
    password_confirmation: string;
    first_name: string;
    last_name: string;
    username: string;
  }) {
    return axios.post<RegisterResponse>(
      `${BASE}/auth/register`,
      { user: data },
      { headers: JSON_HEADERS },
    );
  },

  logout(refreshToken: string) {
    return api.delete("/auth/logout", {
      data: { refresh_token: refreshToken },
    });
  },

  logoutAll() {
    return api.delete("/auth/logout_all");
  },

  refresh(refreshToken: string) {
    return axios.post<RefreshResponse>(
      `${BASE}/auth/refresh`,
      { refresh_token: refreshToken },
      { headers: JSON_HEADERS },
    );
  },

  googleAuth(idToken: string) {
    return axios.post<LoginResponse>(
      `${BASE}/auth/google`,
      { id_token: idToken },
      { headers: JSON_HEADERS },
    );
  },

  forgotPassword(email: string) {
    return axios.post(
      `${BASE}/auth/password/forgot`,
      { email },
      { headers: JSON_HEADERS },
    );
  },

  resetPassword(token: string, password: string, passwordConfirmation: string) {
    return axios.patch(
      `${BASE}/auth/password/reset`,
      {
        reset_password_token: token,
        password,
        password_confirmation: passwordConfirmation,
      },
      { headers: JSON_HEADERS },
    );
  },

  resendConfirmation(email: string) {
    return axios.post(
      `${BASE}/auth/confirm/resend`,
      { email },
      { headers: JSON_HEADERS },
    );
  },

  getProfile() {
    return api.get<User>("/profile");
  },
};
