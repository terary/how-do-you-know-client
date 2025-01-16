"use client";
import { Button } from "@mui/material";
import { useState } from "react";

export const ErrorTest = () => {
  const [throwError, setThrowError] = useState(false);

  if (throwError) {
    throw new Error("This is a test error!");
  }

  return (
    <Button
      variant="contained"
      color="error"
      onClick={() => setThrowError(true)}
    >
      Throw Test Error
    </Button>
  );
};
