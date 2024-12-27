"use client";

import { useTranslation } from "react-i18next";
import { Select, MenuItem } from "@mui/material";

export const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (event: any) => {
    const language = event.target.value;
    i18n.changeLanguage(language);
  };

  return (
    <Select
      value={i18n.language}
      onChange={changeLanguage}
      size="small"
      sx={{ minWidth: 100 }}
    >
      <MenuItem value="en">English</MenuItem>
      <MenuItem value="es">Español</MenuItem>
      <MenuItem value="th">ไทย</MenuItem>
    </Select>
  );
};
