"use client";

import { useTheme as useNextTheme } from "next-themes";

type Theme = "dark" | "light";

export function useTheme() {
  const { resolvedTheme, setTheme } = useNextTheme();
  const theme = (resolvedTheme === "light" ? "light" : "dark") as Theme;

  return {
    theme,
    toggle: () => setTheme(theme === "dark" ? "light" : "dark"),
  };
}
