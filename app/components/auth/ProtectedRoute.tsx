"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/services/authService";
import { Box, CircularProgress } from "@mui/material";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check authentication only on the client side
    const authStatus = authService.isAuthenticated();
    setIsAuthenticated(authStatus);

    if (!authStatus) {
      router.push("/login");
    }
  }, [router]);

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Only render children if authenticated
  return isAuthenticated ? <>{children}</> : null;
}
