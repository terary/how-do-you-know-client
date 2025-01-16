import { apiSlice } from "@/lib/store/api/base";

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

export const fodderPoolsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFodderPools: builder.query<FodderPool[], void>({
      query: () => "/fodder-pools",
      providesTags: ["FodderPools"],
    }),
    getFodderPool: builder.query<FodderPool, string>({
      query: (id) => `/fodder-pools/${id}`,
      providesTags: (result, error, id) => [{ type: "FodderPools", id }],
    }),
    createFodderPool: builder.mutation<FodderPool, CreateFodderPoolDto>({
      query: (data) => ({
        url: "/fodder-pools",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["FodderPools"],
    }),
    deleteFodderPool: builder.mutation<void, string>({
      query: (id) => ({
        url: `/fodder-pools/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["FodderPools"],
    }),
    updateItems: builder.mutation<void, { id: string; items: string[] }>({
      query: ({ id, items }) => ({
        url: `/fodder-pools/${id}/items`,
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
