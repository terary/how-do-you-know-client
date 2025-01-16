import { useAppSelector } from "../store/hooks";
import { authApiSlice } from "../store/api/authApiSlice";
import { authSlice } from "../store/slices/authSlice";
import { useAppDispatch } from "../store/hooks";
import type { LoginCredentials } from "@/features/auth/types";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const [loginMutation] = authApiSlice.useLoginMutation();
  const [logoutMutation] = authApiSlice.useLogoutMutation();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const login = async (credentials: LoginCredentials) => {
    const result = await loginMutation(credentials).unwrap();
    dispatch(
      authSlice.actions.setCredentials({
        token: result.access_token,
        user: user, // We need to get the user from a profile endpoint
      })
    );
  };

  const logout = async () => {
    await logoutMutation().unwrap();
    dispatch(authSlice.actions.logout());
  };

  return {
    isAuthenticated,
    user,
    login,
    logout,
  };
};
