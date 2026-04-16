"use client";

import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/store";
import { PanelHeader } from "./PanelHeader";

function resolveTheme(theme: "dark" | "light" | "system"): "dark" | "light" {
  if (theme === "system") {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: light)").matches) {
      return "light";
    }
    return "dark";
  }
  return theme;
}

// Terminal server ports — electron can override via window.__TERMINAL_CONFIG
function getTerminalPorts() {
  const cfg = typeof window !== "undefined" ? (window as any).__TERMINAL_CONFIG : null;
  return {
    ttyd: cfg?.ttydPort || 3001,
    ctrl: cfg?.ctrlPort || 3002,
  };
}

export function TerminalPanel({ onCollapse }: { onCollapse?: () => void } = {}) {
  const theme = useAppStore((s) => s.theme);
  const focusedPanel = useAppStore((s) => s.focusedPanel);
  const [reloadKey, setReloadKey] = useState(0);
  const currentTerminalTheme = useRef<"dark" | "light">("dark");
  const initedRef = useRef(false);
  const ports = getTerminalPorts();

  // Push theme to the terminal server — on mount AND on change
  useEffect(() => {
    const resolved = resolveTheme(theme);
    if (currentTerminalTheme.current === resolved && initedRef.current) return;
    initedRef.current = true;
    currentTerminalTheme.current = resolved;

    fetch(`http://localhost:${ports.ctrl}/theme`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme: resolved }),
    })
      .then((r) => r.json())
      .then((result) => {
        if (result.restarted) {
          setTimeout(() => setReloadKey((k) => k + 1), 500);
        }
      })
      .catch(() => {
        // Terminal server not running — ignore
      });
  }, [theme]);

  return (
    <div className="h-full flex flex-col bg-gray-950">
      <PanelHeader title="Terminal" active={focusedPanel === "terminal"}>
        <button
          onClick={() => setReloadKey((k) => k + 1)}
          className="text-xs text-gray-500 hover:text-gray-200 transition-colors"
          title="Reload terminal"
        >
          ↻
        </button>
        {onCollapse && (
          <button
            onClick={onCollapse}
            className="text-xs text-gray-500 hover:text-gray-200 transition-colors"
            title="Collapse terminal"
          >
            ›
          </button>
        )}
      </PanelHeader>
      <div className="flex-1 min-h-0 overflow-hidden bg-gray-950">
        <iframe
          key={reloadKey}
          src={`http://localhost:${ports.ttyd}`}
          className="w-full h-full border-0"
          title="Terminal"
        />
      </div>
    </div>
  );
}
