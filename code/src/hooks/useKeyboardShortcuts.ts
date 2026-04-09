"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "@/store";

export function useKeyboardShortcuts() {
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

      // All data reads must use getState() to avoid stale closures
      const s = useAppStore.getState();

      // Handle 'g' prefix sequences
      if (pendingKey.current === "g") {
        pendingKey.current = null;
        if (pendingTimeout.current) clearTimeout(pendingTimeout.current);
        switch (e.key) {
          case "i": s.setActiveFolder("inbox"); break;
          case "s": s.setActiveFolder("sent"); break;
          case "d": s.setActiveFolder("drafts"); break;
          case "a": s.setActiveFolder("archive"); break;
          case "n": s.setActiveFolder("done"); break;
          case "p": s.setActiveFolder("promotions"); break;
        }
        e.preventDefault();
        return;
      }

      switch (e.key) {
        case "j":
          s.selectNext();
          { const fresh = useAppStore.getState(); if (fresh.threads[fresh.selectedIndex]) fresh.setOpenThread(fresh.threads[fresh.selectedIndex]); }
          e.preventDefault();
          break;
        case "k":
          s.selectPrevious();
          { const fresh = useAppStore.getState(); if (fresh.threads[fresh.selectedIndex]) fresh.setOpenThread(fresh.threads[fresh.selectedIndex]); }
          e.preventDefault();
          break;
        case "Enter":
          if (s.threads[s.selectedIndex]) {
            s.setOpenThread(s.threads[s.selectedIndex]);
          }
          e.preventDefault();
          break;
        case "Escape":
          if (s.isComposeOpen) {
            s.closeCompose();
          } else if (s.searchQuery) {
            s.setSearchQuery("");
          } else {
            useAppStore.setState({ openThread: null, selectedIndex: -1 });
          }
          e.preventDefault();
          break;
        case "e":
          if (s.openThread) {
            s.discardThread(s.openThread.id);
            archiveThread(s.openThread.id);
            s.setOpenThread(null);
          }
          e.preventDefault();
          break;
        case "d": {
          if (s.openThread) {
            if (s.activeFolder === "done") {
              moveToInboxThread(s.openThread.id);
            } else {
              s.discardThread(s.openThread.id);
              moveToDoneThread(s.openThread.id);
            }
            const currentIndex = s.threads.findIndex((t) => t.id === s.openThread!.id);
            const newThreads = s.threads.filter((t) => t.id !== s.openThread!.id);
            const nextIndex = newThreads.length === 0 ? -1 : Math.min(currentIndex, newThreads.length - 1);
            const nextThread = nextIndex >= 0 ? newThreads[nextIndex] : null;
            useAppStore.setState({ threads: newThreads, selectedIndex: nextIndex, openThread: nextThread });
          }
          e.preventDefault();
          break;
        }
        case "r":
          if (s.openThread) {
            const latest = s.openThread.messages[s.openThread.messages.length - 1];
            s.setDraft({
              body: "",
              subject: `Re: ${s.openThread.subject}`,
              to: latest.from.email,
            });
            setTimeout(() => document.getElementById("draft-body")?.focus(), 50);
          }
          e.preventDefault();
          break;
        case "c":
          if (e.metaKey || e.ctrlKey) break;
          s.openCompose({ mode: "new" });
          e.preventDefault();
          break;
        case "/":
          document.getElementById("search-input")?.focus();
          e.preventDefault();
          break;
        case "t":
          s.cycleTheme();
          e.preventDefault();
          break;
        case "u": {
          if (s.openThread) {
            toggleReadUnread(s.openThread.id, s.openThread.isRead);
            useAppStore.setState({
              openThread: { ...s.openThread, isRead: !s.openThread.isRead },
              threads: s.threads.map((t) =>
                t.id === s.openThread!.id ? { ...t, isRead: !s.openThread!.isRead } : t
              ),
            });
          }
          e.preventDefault();
          break;
        }
        case "?":
          s.toggleShortcutHelp();
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
  }, []);
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

async function moveToDoneThread(threadId: string) {
  try {
    await fetch(`/api/emails/${threadId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "moveToDone" }),
    });
  } catch (error) {
    console.error("Failed to move to done:", error);
  }
}

async function moveToInboxThread(threadId: string) {
  try {
    await fetch(`/api/emails/${threadId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "moveToInbox" }),
    });
  } catch (error) {
    console.error("Failed to move to inbox:", error);
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
