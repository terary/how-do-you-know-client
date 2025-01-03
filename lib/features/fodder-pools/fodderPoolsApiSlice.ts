import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { authService } from "@/lib/services/authService";

export interface CreateFodderPoolDto {
  name: string;
  description: string;
  items?: { text: string }[];
}

export interface FodderPoolItem {
  id: string;
  pool_id: string;
  text: string;
  created_by: string;
  created_at: string;
}

export interface FodderPool {
  id: string;
  name: string;
  description: string;
  items: FodderPoolItem[];
}

export const fodderPoolsApiSlice = createApi({
  reducerPath: "fodderPoolsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001/fodder-pools",
    prepareHeaders: (headers) => {
      const token = authService.getToken();
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["FodderPools"],
  endpoints: (builder) => ({
    getFodderPools: builder.query<FodderPool[], void>({
      query: () => "/",
      providesTags: ["FodderPools"],
    }),
    getFodderPool: builder.query<FodderPool, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "FodderPools", id }],
    }),
    createFodderPool: builder.mutation<FodderPool, CreateFodderPoolDto>({
      query: (data) => ({
        url: "/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["FodderPools"],
    }),
    deleteFodderPool: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["FodderPools"],
    }),
    updateItems: builder.mutation<void, { id: string; items: string[] }>({
      query: ({ id, items }) => ({
        url: `/${id}/items`,
        method: "POST",
        body: items.map((text) => ({ text })),
      }),
      invalidatesTags: (result, error, { id }) => [
        "FodderPools",
        { type: "FodderPools", id },
      ],
    }),
  }),
});

export const {
  useGetFodderPoolsQuery,
  useGetFodderPoolQuery,
  useCreateFodderPoolMutation,
  useDeleteFodderPoolMutation,
  useUpdateItemsMutation,
} = fodderPoolsApiSlice;
