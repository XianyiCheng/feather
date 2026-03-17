"use client";

import { useAppStore, type Theme } from "@/store";

const icons: Record<Theme, string> = {
  dark: "🌙",
  light: "☀️",
  system: "💻",
};

const labels: Record<Theme, string> = {
  dark: "Dark",
  light: "Light",
  system: "System",
};

export function ThemeToggle() {
  const theme = useAppStore((s) => s.theme);
  const cycleTheme = useAppStore((s) => s.cycleTheme);

  return (
    <button
      onClick={cycleTheme}
      className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-gray-800 transition-colors text-xs text-gray-400"
      title={`Theme: ${labels[theme]} (press t to toggle)`}
    >
      <span>{icons[theme]}</span>
      <span>{labels[theme]}</span>
      <kbd className="ml-0.5 text-gray-600">t</kbd>
    </button>
  );
}
