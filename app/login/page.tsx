"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/lib/features/auth/authApiSlice";
import { authService } from "@/lib/services/authService";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  Container,
} from "@mui/material";

export default function LoginPage() {
  const router = useRouter();
  const [login, { isLoading, error }] = useLoginMutation();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login({ username, password }).unwrap();
      authService.setToken(result.access_token);
      router.push("/");
    } catch (err) {
      console.error("Failed to login:", err);
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          py: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Paper sx={{ p: 4, maxWidth: 400, width: "100%" }}>
            <Typography variant="h4" gutterBottom>
              Login
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Invalid credentials
              </Alert>
            )}
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                margin="normal"
                required
                autoComplete="username"
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                autoComplete="current-password"
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{ mt: 2 }}
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Paper>
        </Box>

        <Paper sx={{ p: 4 }}>
          <Typography variant="h6" gutterBottom>
            Authentication Information
          </Typography>
          <Typography paragraph>
            Current authentication is handled by authApiSlice. Protected routes
            automatically include the appropriate authentication header.
          </Typography>
          <Typography paragraph>
            Authentication works for both REST API and WebSocket connections
            using JWT tokens as bearer tokens.
          </Typography>
          <Typography paragraph>
            Note: In development, the auth token is stored in localStorage for
            simplicity. In production, it should use secure cookies, but this
            requires HTTPS and proper domain configuration.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
