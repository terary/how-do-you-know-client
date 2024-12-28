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
import { Settings, AccountCircle } from "@mui/icons-material";
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
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Your App Title
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ThemeSwitcher />
          <LanguageSelector />
          <IconButton
            size="large"
            edge="end"
            aria-label="account settings"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <Settings />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
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
        </Box>
      </Toolbar>
    </AppBar>
  );
};
