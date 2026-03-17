"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store";

/**
 * Syncs the browser's UI state to the server so the CLI can read it
 * via GET /api/cli/state.
 */
export function useStateSync() {
  const openThread = useAppStore((s) => s.openThread);
  const activeFolder = useAppStore((s) => s.activeFolder);
  const selectedIndex = useAppStore((s) => s.selectedIndex);
  const theme = useAppStore((s) => s.theme);

  useEffect(() => {
    const state = {
      openThread: openThread
        ? {
            id: openThread.id,
            subject: openThread.subject,
            messageCount: openThread.messageCount,
            latestDate: openThread.latestDate,
            participants: openThread.participants,
            messages: openThread.messages.map((m) => ({
              id: m.id,
              from: m.from,
              to: m.to,
              cc: m.cc,
              subject: m.subject,
              snippet: m.snippet,
              body: m.body,
              date: m.date,
            })),
          }
        : null,
      activeFolder,
      selectedIndex,
      theme,
    };

    fetch("/api/cli/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state),
    }).catch(() => {});
  }, [openThread, activeFolder, selectedIndex, theme]);
}
