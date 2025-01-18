"use client";

import { Button, Stack } from "@mui/material";
import { useToast } from "@/lib/hooks/useToast";

export default function IndexPage() {
  const toast = useToast();

  const demonstrateToasts = () => {
    toast.info("This is an info message");
    setTimeout(() => toast.info("This is another info message"), 1000);
    setTimeout(() => toast.warn("This is a warning message"), 2000);
    setTimeout(() => toast.error("This is an error message"), 3000);
    setTimeout(
      () => toast.debug("This is a debug message (only in development)"),
      4000
    );
  };

  return (
    <div>
      <h1>Welcome to How Do You Know</h1>
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button variant="contained" color="primary" onClick={demonstrateToasts}>
          Test Toast Messages
        </Button>
      </Stack>
    </div>
  );
}
