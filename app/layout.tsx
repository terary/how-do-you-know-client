"use client";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Box, CssBaseline } from "@mui/material";
import type { ReactNode } from "react";
import { StoreProvider } from "./StoreProvider";
import { Sidebar } from "./components/layout/Sidebar";
import { TopBar } from "./components/layout/TopBar";
import "../lib/i18n";
import "./styles/globals.css";

interface Props {
  readonly children: ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <StoreProvider>
      <html lang="en">
        <body>
          <AppRouterCacheProvider>
            <CssBaseline />
            <Box sx={{ display: "flex" }}>
              <Sidebar />
              <Box sx={{ flexGrow: 1, height: "100vh", overflow: "auto" }}>
                <TopBar />
                <Box component="main" sx={{ p: 3 }}>
                  {children}
                </Box>
              </Box>
            </Box>
          </AppRouterCacheProvider>
        </body>
      </html>
    </StoreProvider>
  );
}
