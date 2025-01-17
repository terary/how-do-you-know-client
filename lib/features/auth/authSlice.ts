import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AuthState } from "./types";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthState["user"]; token: string }>
    ) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    initializeFromStorage: (state) => {
      if (typeof window !== "undefined") {
        const token =
          localStorage.getItem("hdyk_token") ||
          document.cookie
            .split("; ")
            .find((row) => row.startsWith("hdyk_token="))
            ?.split("=")[1] ||
          null;

        state.token = token;
        state.isAuthenticated = !!token;
      }
    },
  },
});
