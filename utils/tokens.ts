import Cookies from "js-cookie";

const ACCESS_TOKEN_KEY = "atlas_access_token";
const REFRESH_TOKEN_KEY = "atlas_refresh_token";

export function getAccessToken(): string | undefined {
  return Cookies.get(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | undefined {
  return Cookies.get(REFRESH_TOKEN_KEY);
}

export function setTokens(accessToken: string, refreshToken: string): void {
  Cookies.set(ACCESS_TOKEN_KEY, accessToken, { expires: 1 });
  Cookies.set(REFRESH_TOKEN_KEY, refreshToken, { expires: 30 });
}

export function clearTokens(): void {
  Cookies.remove(ACCESS_TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
}

export function hasTokens(): boolean {
  return !!getAccessToken();
}
