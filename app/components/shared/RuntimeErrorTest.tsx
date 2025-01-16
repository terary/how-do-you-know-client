"use client";
import { Button } from "@mui/material";
import { useState } from "react";

export const RuntimeErrorTest = () => {
  const [triggerError, setTriggerError] = useState(false);

  const causeError = () => {
    setTriggerError(true);
  };

  if (triggerError) {
    // This will cause a runtime error
    const obj: any = undefined;
    return <div>{obj.nonexistentProperty}</div>;
  }

  return (
    <Button
      variant="contained"
      color="warning"
      onClick={causeError}
      sx={{ ml: 2 }}
    >
      Trigger Runtime Error
    </Button>
  );
};
