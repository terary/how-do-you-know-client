"use client";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Box, CssBaseline } from "@mui/material";
import type { ReactNode } from "react";
import { StoreProvider } from "./StoreProvider";
import { Sidebar } from "./components/layout/Sidebar";
import { TopBar } from "./components/layout/TopBar";
import { ErrorBoundary } from "./components/shared/ErrorBoundary";
import { useTranslation } from "react-i18next";
import "../lib/i18n";
import "./styles/globals.css";
import { ThemeProvider } from "./context/ThemeContext";
import "./styles/theme.css";
import { Provider } from "react-redux";
import store from "./redux/store";
import { ToastProvider } from "./components/shared/ToastProvider";

interface Props {
  readonly children: ReactNode;
}

export default function RootLayout({ children }: Props) {
  const { i18n } = useTranslation();

  return (
    <html
      lang={i18n.language}
      dir={["ar", "ar-MA"].includes(i18n.language) ? "rtl" : "ltr"}
    >
      <body>
        <Provider store={store}>
          <StoreProvider>
            <ThemeProvider>
              <ErrorBoundary>
                <AppRouterCacheProvider>
                  <CssBaseline />
                  <ToastProvider>
                    <Box sx={{ display: "flex" }}>
                      <Sidebar />
                      <Box
                        sx={{ flexGrow: 1, height: "100vh", overflow: "auto" }}
                      >
                        <TopBar />
                        <Box component="main" sx={{ p: 3 }}>
                          {children}
                        </Box>
                      </Box>
                    </Box>
                  </ToastProvider>
                </AppRouterCacheProvider>
              </ErrorBoundary>
            </ThemeProvider>
          </StoreProvider>
        </Provider>
      </body>
    </html>
  );
}
