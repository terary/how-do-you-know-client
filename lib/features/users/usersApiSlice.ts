import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { authService } from "@/lib/services/authService";

export interface User {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
}

export interface CreateUserDto {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles: string[];
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  roles?: string[];
}

export const usersApiSlice = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001/users",
    prepareHeaders: (headers) => {
      const token = authService.getToken();
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => "/",
      providesTags: ["Users"],
    }),
    getUser: builder.query<User, string>({
      query: (username) => `/${username}`,
      providesTags: (result, error, username) => [
        { type: "Users", id: username },
      ],
    }),
    createUser: builder.mutation<User, CreateUserDto>({
      query: (userData) => ({
        url: "/",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Users"],
    }),
    updateUser: builder.mutation<
      User,
      { username: string; data: UpdateUserDto }
    >({
      query: ({ username, data }) => ({
        url: `/${username}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { username }) => [
        "Users",
        { type: "Users", id: username },
      ],
    }),
    deleteUser: builder.mutation<void, string>({
      query: (username) => ({
        url: `/${username}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApiSlice;
