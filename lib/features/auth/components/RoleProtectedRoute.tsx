"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { Role, hasAnyRole } from "../roles";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  roles: Role[];
  fallbackPath?: string;
}

export const RoleProtectedRoute = ({
  children,
  roles,
  fallbackPath = "/",
}: RoleProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && !hasAnyRole(user, roles)) {
      router.push(fallbackPath);
    }
  }, [isAuthenticated, user, roles, router, fallbackPath]);

  if (!isAuthenticated || !hasAnyRole(user, roles)) {
    return null;
  }

  return <>{children}</>;
};
