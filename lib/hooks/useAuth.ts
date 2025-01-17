import { useAppSelector } from "../store/hooks";
import {
  useLoginMutation,
  useLogoutMutation,
  useGetProfileQuery,
} from "@/lib/features/auth/authApiSlice";
import { authSlice } from "@/lib/features/auth/authSlice";
import { useAppDispatch } from "../store/hooks";
import type { LoginCredentials } from "@/features/auth/types";
import type { User } from "@/lib/types";
import { authService } from "@/lib/services/authService";
import { useEffect } from "react";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const [loginMutation] = useLoginMutation();
  const [logoutMutation] = useLogoutMutation();
  const { data: profile, refetch: refetchProfile } = useGetProfileQuery();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  // Initialize auth state from storage on mount
  useEffect(() => {
    dispatch(authSlice.actions.initializeFromStorage());
  }, [dispatch]);

  // Fetch profile on mount if we have a token
  useEffect(() => {
    const token = authService.getToken();
    if (token && !user) {
      refetchProfile()
        .unwrap()
        .then((profileResult) => {
          const user: User = {
            id: profileResult.username,
            email: profileResult.email,
            name: `${profileResult.firstName} ${profileResult.lastName}`,
          };
          dispatch(
            authSlice.actions.setCredentials({
              token,
              user,
            })
          );
        })
        .catch(() => {
          // If profile fetch fails, clear auth state
          authService.removeToken();
          dispatch(authSlice.actions.logout());
        });
    }
  }, [dispatch, refetchProfile, user]);

  const login = async (credentials: LoginCredentials) => {
    const result = await loginMutation(credentials).unwrap();
    // Store token in localStorage
    authService.setToken(result.access_token);
    // Get user profile
    const profileResult = await refetchProfile().unwrap();
    // Map profile to User type
    const user: User = {
      id: profileResult.username, // Using username as id since that's what we have
      email: profileResult.email,
      name: `${profileResult.firstName} ${profileResult.lastName}`,
    };
    // Update Redux state
    dispatch(
      authSlice.actions.setCredentials({
        token: result.access_token,
        user,
      })
    );
  };

  const logout = async () => {
    await logoutMutation().unwrap();
    // Remove token from localStorage
    authService.removeToken();
    dispatch(authSlice.actions.logout());
  };

  return {
    isAuthenticated,
    user,
    login,
    logout,
  };
};
