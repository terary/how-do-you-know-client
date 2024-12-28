"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Typography, CircularProgress, Box } from "@mui/material";
import { useLogoutMutation } from "@/lib/features/auth/authApiSlice";
import { authService } from "@/lib/services/authService";

export default function LogoutPage() {
  const router = useRouter();
  const [logout] = useLogoutMutation();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logout().unwrap();
      } catch (error) {
        console.error("Logout failed:", error);
      } finally {
        authService.removeToken();
        router.push("/login");
      }
    };

    handleLogout();
  }, [logout, router]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "50vh",
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography>Logging out...</Typography>
    </Box>
  );
}
