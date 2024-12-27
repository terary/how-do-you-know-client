"use client";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import type { ReactNode } from "react";
import { StoreProvider } from "./StoreProvider";
import { Nav } from "./components/Nav";
// import { LanguageSelector } from "./components/LanguageSelector";
import { LanguageSelector } from "./components/LanguageSelector";
// import "./lib/i18n";
import "../lib/i18n";

import "./styles/globals.css";
import styles from "./styles/layout.module.css";

interface Props {
  readonly children: ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <StoreProvider>
      <html lang="en">
        <body>
          <AppRouterCacheProvider>
            <section className={styles.container}>
              <div className={styles.languageSelector}>
                <LanguageSelector />
              </div>
              <Nav />

              <main className={styles.main}>{children}</main>

              <footer className={styles.footer}>
                <span>Learn </span>
                <a
                  className={styles.link}
                  href="https://reactjs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  React
                </a>
                <span>, </span>
                <a
                  className={styles.link}
                  href="https://redux.js.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Redux
                </a>
                <span>, </span>
                <a
                  className={styles.link}
                  href="https://redux-toolkit.js.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Redux Toolkit
                </a>
                <span>, </span>
                <a
                  className={styles.link}
                  href="https://react-redux.js.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  React Redux
                </a>
                ,<span> and </span>
                <a
                  className={styles.link}
                  href="https://reselect.js.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Reselect
                </a>
              </footer>
            </section>
          </AppRouterCacheProvider>
        </body>
      </html>
    </StoreProvider>
  );
}
