import { apiSlice } from "@/lib/store/api/base";
import { ProfileResponseDto, UpdateProfileDto } from "@/lib/types/profile";

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
}

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    getProfile: builder.query<ProfileResponseDto, void>({
      query: () => "/auth/profile",
      transformResponse: (response: ProfileResponseDto) => response,
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error: any) {
          if (error?.error?.status === 401) {
            window.location.href = "/login";
          }
        }
      },
      providesTags: ["Profile"],
    }),
    updateProfile: builder.mutation<ProfileResponseDto, UpdateProfileDto>({
      query: (profileData) => ({
        url: "/auth/profile",
        method: "POST",
        body: profileData,
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} = authApiSlice;
