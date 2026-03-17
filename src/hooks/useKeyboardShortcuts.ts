"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "@/store";

export function useKeyboardShortcuts() {
  const store = useAppStore();
  const pendingKey = useRef<string | null>(null);
  const pendingTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement).isContentEditable) {
        if (e.key === "Escape") {
          (e.target as HTMLElement).blur();
          e.preventDefault();
        }
        return;
      }

      // Handle 'g' prefix sequences
      if (pendingKey.current === "g") {
        pendingKey.current = null;
        if (pendingTimeout.current) clearTimeout(pendingTimeout.current);
        switch (e.key) {
          case "i": store.setActiveFolder("inbox"); break;
          case "s": store.setActiveFolder("sent"); break;
          case "d": store.setActiveFolder("drafts"); break;
          case "a": store.setActiveFolder("archive"); break;
        }
        e.preventDefault();
        return;
      }

      switch (e.key) {
        case "j":
          store.selectNext();
          { const s = useAppStore.getState(); if (s.threads[s.selectedIndex]) s.setOpenThread(s.threads[s.selectedIndex]); }
          e.preventDefault();
          break;
        case "k":
          store.selectPrevious();
          { const s = useAppStore.getState(); if (s.threads[s.selectedIndex]) s.setOpenThread(s.threads[s.selectedIndex]); }
          e.preventDefault();
          break;
        case "Enter":
          if (store.threads[store.selectedIndex]) {
            store.setOpenThread(store.threads[store.selectedIndex]);
          }
          e.preventDefault();
          break;
        case "Escape":
          if (store.isComposeOpen) {
            store.closeCompose();
          } else if (store.openThread) {
            store.setOpenThread(null);
          }
          e.preventDefault();
          break;
        case "e":
          if (store.openThread) {
            archiveThread(store.openThread.id);
            store.setOpenThread(null);
          }
          e.preventDefault();
          break;
        case "r":
          if (store.openThread) {
            const latest = store.openThread.messages[store.openThread.messages.length - 1];
            store.setDraft({
              body: "",
              subject: `Re: ${store.openThread.subject}`,
              to: latest.from.email,
            });
            // Focus the draft textarea
            setTimeout(() => document.getElementById("draft-body")?.focus(), 50);
          }
          e.preventDefault();
          break;
        case "c":
          store.openCompose({ mode: "new" });
          e.preventDefault();
          break;
        case "/":
          document.getElementById("search-input")?.focus();
          e.preventDefault();
          break;
        case "t":
          store.cycleTheme();
          e.preventDefault();
          break;
        case "u": {
          const currentThread = useAppStore.getState().openThread;
          if (currentThread) {
            toggleReadUnread(currentThread.id, currentThread.isRead);
            useAppStore.setState({
              openThread: { ...currentThread, isRead: !currentThread.isRead },
            });
            // Also update the thread in the list so the bold styling reflects
            const threads = useAppStore.getState().threads;
            useAppStore.setState({
              threads: threads.map((t) =>
                t.id === currentThread.id ? { ...t, isRead: !currentThread.isRead } : t
              ),
            });
          }
          e.preventDefault();
          break;
        }
        case "?":
          store.toggleShortcutHelp();
          e.preventDefault();
          break;
        case "g":
          pendingKey.current = "g";
          pendingTimeout.current = setTimeout(() => { pendingKey.current = null; }, 1000);
          e.preventDefault();
          break;
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [store]);
}

async function toggleReadUnread(threadId: string, isCurrentlyRead: boolean) {
  try {
    await fetch(`/api/emails/${threadId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: isCurrentlyRead ? "markAsUnread" : "markAsRead" }),
    });
  } catch (error) {
    console.error("Failed to toggle read/unread:", error);
  }
}

async function archiveThread(threadId: string) {
  try {
    await fetch(`/api/emails/${threadId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "archive" }),
    });
  } catch (error) {
    console.error("Failed to archive:", error);
  }
}
