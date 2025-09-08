export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

const TOKEN_KEY = "tokens";

export function saveTokens(tokens: AuthTokens) {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
}

export function getTokens(): AuthTokens | null {
  const raw = localStorage.getItem(TOKEN_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
}
