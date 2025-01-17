import { storageService } from "./AbstractStorageService";

const AUTH_TOKEN_KEY = "hdyk_token";
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

export const authService = {
  setToken(token: string) {
    // Set in localStorage
    storageService.setItem(AUTH_TOKEN_KEY, token);

    // Set in cookie
    document.cookie = `${AUTH_TOKEN_KEY}=${token}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  },

  getToken(): string | null {
    // Try cookie first
    const cookieToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${AUTH_TOKEN_KEY}=`))
      ?.split("=")[1];

    if (cookieToken) return cookieToken;

    // Fallback to localStorage
    return storageService.getItem(AUTH_TOKEN_KEY);
  },

  removeToken() {
    // Remove from localStorage
    storageService.removeItem(AUTH_TOKEN_KEY);

    // Remove from cookie
    document.cookie = `${AUTH_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
