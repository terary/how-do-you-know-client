import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { authService } from "@/lib/services/authService";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
    prepareHeaders: (headers) => {
      const token = authService.getToken();
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Users", "QuestionTemplates", "FodderPools"],
  endpoints: () => ({}),
});
