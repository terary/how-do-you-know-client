import { storageService } from "./AbstractStorageService";

const AUTH_TOKEN_KEY = "auth_token";

export const authService = {
  setToken(token: string) {
    storageService.setItem(AUTH_TOKEN_KEY, token);
  },

  getToken(): string | null {
    return storageService.getItem(AUTH_TOKEN_KEY);
  },

  removeToken() {
    storageService.removeItem(AUTH_TOKEN_KEY);
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
