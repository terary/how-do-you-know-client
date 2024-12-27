"use client";
import { useTranslation } from "react-i18next";
import { Typography, Paper, Box } from "@mui/material";

export default function ProfilePage() {
  const { t } = useTranslation();

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
      <Typography variant="h4" gutterBottom>
        {t("settings.profile")}
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          This is the profile page where users can view and edit their profile
          information.
        </Typography>
      </Paper>
    </Box>
  );
}
