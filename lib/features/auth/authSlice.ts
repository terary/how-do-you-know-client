import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AuthState } from "./types";
import { authService } from "@/lib/services/authService";

const token = typeof window !== "undefined" ? authService.getToken() : null;

const initialState: AuthState = {
  user: null,
  isAuthenticated: !!token,
  token,
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
  },
});
