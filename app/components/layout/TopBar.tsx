"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";
import { Settings, AccountCircle, Menu as MenuIcon } from "@mui/icons-material";
import { LanguageSelector } from "../LanguageSelector";
import { useTranslation } from "react-i18next";
import { ThemeSwitcher } from "../common/ThemeSwitcher";

export const TopBar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { t } = useTranslation();
  const router = useRouter();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (path: string) => {
    handleClose();
    router.push(path);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "background.paper",
        color: "text.primary",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Your App Title
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <LanguageSelector />
          <IconButton size="large" onClick={handleMenu} color="inherit">
            <Settings />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => handleMenuClick("/profile")}>
              {t("settings.profile")}
            </MenuItem>
            <MenuItem onClick={() => handleMenuClick("/account")}>
              {t("settings.account")}
            </MenuItem>
            <MenuItem onClick={() => handleMenuClick("/logout")}>
              {t("settings.logout")}
            </MenuItem>
          </Menu>
          <ThemeSwitcher />
        </Box>
      </Toolbar>
    </AppBar>
  );
};
