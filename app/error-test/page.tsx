import { ErrorTest } from "../components/ErrorTest";
import { RuntimeErrorTest } from "../components/RuntimeErrorTest";
import { Typography, Box } from "@mui/material";

export default function ErrorTestPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Error Boundary Test
      </Typography>
      <Typography paragraph>
        Click either button below to see the Error Boundary in action:
      </Typography>
      <Box sx={{ display: "flex", gap: 2 }}>
        <ErrorTest />
        <RuntimeErrorTest />
      </Box>
    </Box>
  );
}
