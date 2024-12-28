import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { authService } from "@/lib/services/authService";

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
}

export const authApiSlice = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001/auth",
    prepareHeaders: (headers) => {
      const token = authService.getToken();
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
    getProfile: builder.query<any, void>({
      query: () => "/profile",
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useGetProfileQuery } =
  authApiSlice;
