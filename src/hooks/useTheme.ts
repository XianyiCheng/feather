"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store";

export function useTheme() {
  const theme = useAppStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;

    function applyTheme(t: "dark" | "light") {
      root.classList.remove("dark", "light");
      root.classList.add(t);
    }

    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      applyTheme(mq.matches ? "dark" : "light");

      const handler = (e: MediaQueryListEvent) => applyTheme(e.matches ? "dark" : "light");
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    } else {
      applyTheme(theme);
    }
  }, [theme]);
}
