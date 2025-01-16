import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
} from "@reduxjs/toolkit/query/react";
import type { FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";

// Define base types for the API
export type ApiBaseQuery = BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
>;

export type ApiTags = "Profile" | "Questionnaire" | "User";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001",
  }) as ApiBaseQuery,
  tagTypes: ["Profile", "Questionnaire", "User"] as ApiTags[],
  endpoints: () => ({}),
});

// Export types for endpoints
export type ApiEndpoint = typeof apiSlice.endpoints;
export type ApiState = ReturnType<typeof apiSlice.reducer>;

// Export the base api for use in other slices
export const {
  reducer: apiReducer,
  middleware: apiMiddleware,
  util: { invalidateTags, updateQueryData },
} = apiSlice;
