import { apiSlice } from "@/lib/store/api/base";

export interface User {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: ("admin:exams" | "admin:users" | "user" | "public")[];
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

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => "/users",
      providesTags: ["Users"],
    }),
    getUser: builder.query<User, string>({
      query: (username) => `/users/${username}`,
      providesTags: (result, error, username) => [
        { type: "Users", id: username },
      ],
    }),
    createUser: builder.mutation<User, CreateUserDto>({
      query: (userData) => ({
        url: "/users",
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
        url: `/users/${username}`,
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
        url: `/users/${username}`,
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
