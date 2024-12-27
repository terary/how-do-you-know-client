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
  ChevronLeft,
} from "@mui/icons-material";

const DRAWER_WIDTH = 240;

export const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();
  const { t } = useTranslation();

  const menuItems = [
    { text: t("nav.home"), icon: <Home />, path: "/" },
    { text: t("nav.verify"), icon: <Verified />, path: "/verify" },
    { text: t("nav.quotes"), icon: <FormatQuote />, path: "/quotes" },
    {
      text: t("nav.questionnaires"),
      icon: <QuestionAnswer />,
      path: "/questionnaires",
    },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? DRAWER_WIDTH : 65,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? DRAWER_WIDTH : 65,
          transition: (theme) =>
            theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          overflowX: "hidden",
          borderRight: 1,
          borderColor: "divider",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "flex-end" : "center",
          p: 1,
        }}
      >
        <IconButton onClick={() => setOpen(!open)}>
          {open ? <ChevronLeft /> : <MenuIcon />}
        </IconButton>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.path}
            component={Link}
            href={item.path}
            selected={pathname === item.path}
            sx={{
              minHeight: 48,
              px: 2.5,
              "&.Mui-selected": {
                backgroundColor: "action.selected",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : "auto",
                justifyContent: "center",
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};
