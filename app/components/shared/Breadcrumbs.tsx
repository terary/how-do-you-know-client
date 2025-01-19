"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs as MuiBreadcrumbs, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export const Breadcrumbs = () => {
  const pathname = usePathname() || "/";
  const { t } = useTranslation();

  const pathSegments = pathname
    .split("/")
    .filter((segment) => segment !== "")
    .map((segment) => ({
      name: t(`navigation.${segment}`, { defaultValue: segment }),
      path: segment,
    }));

  return (
    <MuiBreadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
      <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
        {t("navigation.home")}
      </Link>
      {pathSegments.map((segment, index) => {
        const isLast = index === pathSegments.length - 1;
        const href = `/${pathSegments
          .slice(0, index + 1)
          .map((s) => s.path)
          .join("/")}`;

        return isLast ? (
          <Typography key={segment.path} color="text.primary">
            {segment.name}
          </Typography>
        ) : (
          <Link
            key={segment.path}
            href={href}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            {segment.name}
          </Link>
        );
      })}
    </MuiBreadcrumbs>
  );
};
