// src/lib/auth.ts
export type AuthTokens = {
  access_token: string;
  refresh_token?: string;
  token_type: "Bearer";
  expires_in: number;
};

const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";

export function saveTokens(t: AuthTokens) {
  localStorage.setItem(ACCESS_KEY, t.access_token);
  if (t.refresh_token) localStorage.setItem(REFRESH_KEY, t.refresh_token);
}
export function getAccessToken() { return localStorage.getItem(ACCESS_KEY); }
export function getRefreshToken() { return localStorage.getItem(REFRESH_KEY); }
