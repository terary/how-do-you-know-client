import { useAuth } from "@/lib/hooks/useAuth";

export const mockAuthState = (
  isAuthenticated = true,
  roles = ["ADMIN", "INSTRUCTOR", "PROCTOR"]
) => {
  const mockUser = {
    id: "test-user-id",
    email: "test@test.com",
    roles,
  };

  return {
    isAuthenticated,
    user: mockUser,
  };
};
