"use client";
import { useTranslation } from "react-i18next";
import { Typography, Paper, Box } from "@mui/material";

export default function AccountPage() {
  const { t } = useTranslation();

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
      <Typography variant="h4" gutterBottom>
        {t("settings.account")}
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          This is the account settings page where users can manage their account
          preferences.
        </Typography>
      </Paper>
    </Box>
  );
}
