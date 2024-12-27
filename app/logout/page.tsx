"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Typography, CircularProgress, Box } from "@mui/material";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Here you would typically:
    // 1. Call your logout API
    // 2. Clear any local storage/cookies
    // 3. Reset any global state

    // For now, we'll just simulate a delay and redirect
    const timer = setTimeout(() => {
      router.push("/");
    }, 1500);

    return () => clearTimeout(timer);
  }, [router]);

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
