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
} from "@mui/material";
import {
  Menu as MenuIcon,
  Home,
  QuestionAnswer,
  FormatQuote,
  Verified,
  BugReport,
  ChevronLeft,
} from "@mui/icons-material";

const DRAWER_WIDTH = 240;

export const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const menuItems = [
    { path: "/", label: t("nav.home"), icon: <Home /> },
    { path: "/verify", label: t("nav.verify"), icon: <Verified /> },
    { path: "/quotes", label: t("nav.quotes"), icon: <FormatQuote /> },
    {
      path: "/questionnaires",
      label: t("nav.questionnaires"),
      icon: <QuestionAnswer />,
    },
    {
      path: "/error-test",
      label: t("nav.errorTest"),
      icon: <BugReport />,
    },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? DRAWER_WIDTH : 65,
        transition: "width 0.2s",
        "& .MuiDrawer-paper": {
          width: open ? DRAWER_WIDTH : 65,
          transition: "width 0.2s",
          whiteSpace: "nowrap",
          overflowX: "hidden",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", p: 1 }}>
        <IconButton onClick={toggleDrawer}>
          {open ? <ChevronLeft /> : <MenuIcon />}
        </IconButton>
      </Box>
      <Divider />
      <List>
        {menuItems.map(({ path, label, icon }) => (
          <ListItem
            key={path}
            component={Link}
            href={path}
            sx={{
              backgroundColor:
                pathname === path ? "action.selected" : "inherit",
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          >
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText
              primary={label}
              sx={{
                opacity: open ? 1 : 0,
                transition: "opacity 0.2s",
              }}
            />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};
