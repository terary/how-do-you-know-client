const AUTH_TOKEN_KEY = "auth_token";

export const authService = {
  setToken(token: string) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  },

  getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(AUTH_TOKEN_KEY);
    }
    return null;
  },

  removeToken() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
