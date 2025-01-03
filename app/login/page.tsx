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
    <>
      <div>
        <h3>Log In Page</h3>
        <p>
          A word about Authentication. <br />
        </p>
        <p>
          Current authentication is handled authApiSlice. By indicating a given
          resource is a protected route the slice automatically adds the
          appropriate authentication header.
        </p>
        <p>
          I think this will work for websockets as well so there shouldn't need
          to be other authentication. I believe in both cases jwt token is used
          as the bearer token.
        </p>
        <p>
          There is a concern have how the authentication token is stored.
          Currently in dev the client stores the auth token in localStorage
          which is not idea.
        </p>
        <p>
          Ideally, auth token storage will be stored in a secure cookie.
          However, Given the dev. environment does not have https and is hosted
          at different domains its not possible to set a secure cookie.
        </p>
        <p>
          The client is set-up to switch between dev/production
          localStorage/cookies but the cookies methods is untested
        </p>
      </div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
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
              autoComplete="false"
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              autoComplete="false"
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
    </>
  );
}
