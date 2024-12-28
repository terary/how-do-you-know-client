import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { IconButton } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

export const ThemeSwitcher: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <IconButton onClick={toggleTheme} color="inherit" aria-label="toggle theme">
      {theme === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
    </IconButton>
  );
};
