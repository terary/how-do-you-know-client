"use client";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();

  // Since middleware handles the redirect, we just need to handle the render
  return isAuthenticated ? <>{children}</> : null;
};
