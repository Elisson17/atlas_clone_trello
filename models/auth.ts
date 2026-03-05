import { User } from "./user";

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  access_token: string;
  refresh_token: string;
}

export interface RegisterResponse {
  message: string;
}

export interface RefreshResponse {
  access_token: string;
  refresh_token: string;
}
