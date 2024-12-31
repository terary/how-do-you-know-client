"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Divider,
  ListItemButton,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Home,
  QuestionAnswer,
  FormatQuote,
  Verified,
  BugReport,
  ChevronLeft,
  AccountCircle,
} from "@mui/icons-material";

const DRAWER_WIDTH = 240;
const MINI_DRAWER_WIDTH = 65;

export const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation();

  const menuItems = [
    { path: "/", label: t("nav.home"), icon: <Home /> },
    { path: "/verify", label: t("nav.verify"), icon: <Verified /> },
    {
      path: "/questionnaires",
      label: t("nav.questionnaires"),
      icon: <QuestionAnswer />,
    },
    { path: "/error-test", label: t("nav.errorTest"), icon: <BugReport /> },
    { path: "/profile", label: t("settings.profile"), icon: <AccountCircle /> },
  ];

  return (
    <>
      {/* Mini permanent drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: MINI_DRAWER_WIDTH,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: MINI_DRAWER_WIDTH,
            overflowX: "hidden",
          },
        }}
      >
        <List sx={{ mt: 7 }}>
          {menuItems.map(({ path, icon, label }) => (
            <ListItem key={path} disablePadding>
              <ListItemButton
                component={Link}
                href={path}
                selected={pathname === path}
                sx={{
                  minHeight: 48,
                  justifyContent: "center",
                  px: 2.5,
                  "&.Mui-selected": {
                    backgroundColor: "action.selected",
                  },
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 0, justifyContent: "center" }}>
                  {icon}
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Hamburger menu button */}
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={() => setOpen(true)}
        edge="start"
        sx={{
          position: "fixed",
          left: "1rem",
          top: "1rem",
          display: open ? "none" : "flex",
          zIndex: 1000,
        }}
      >
        <MenuIcon />
      </IconButton>

      {/* Full-width temporary drawer */}
      <Drawer
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
          },
        }}
        variant="temporary"
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            p: 1,
          }}
        >
          <IconButton onClick={() => setOpen(false)}>
            <ChevronLeft />
          </IconButton>
        </Box>
        <Divider />
        <List>
          {menuItems.map(({ path, label, icon }) => (
            <ListItem key={path} disablePadding>
              <ListItemButton
                component={Link}
                href={path}
                onClick={() => setOpen(false)}
                selected={pathname === path}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "action.selected",
                  },
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};
