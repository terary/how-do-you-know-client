"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

import styles from "../styles/layout.module.css";

export const Nav = () => {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <nav className={styles.nav}>
      <Link
        className={`${styles.link} ${pathname === "/" ? styles.active : ""}`}
        href="/"
      >
        {t("nav.home")}
      </Link>
      <Link
        className={`${styles.link} ${
          pathname === "/verify" ? styles.active : ""
        }`}
        href="/verify"
      >
        {t("nav.verify")}
      </Link>
      <Link
        className={`${styles.link} ${
          pathname === "/quotes" ? styles.active : ""
        }`}
        href="/quotes"
      >
        {t("nav.quotes")}
      </Link>
      <Link
        className={`${styles.link} ${
          pathname === "/questionnaires" ? styles.active : ""
        }`}
        href="/questionnaires"
      >
        {t("nav.questionnaires")}
      </Link>
    </nav>
  );
};
