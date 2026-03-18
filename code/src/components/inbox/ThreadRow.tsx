"use client";

import { useState } from "react";
import { useAppStore } from "@/store";
import type { EmailThread } from "@/lib/email/types";

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
}

function participantNames(thread: EmailThread, showRecipients: boolean): string {
  const seen = new Set<string>();
  const names: string[] = [];
  for (const msg of thread.messages) {
    const addrs = showRecipients ? msg.to : [msg.from];
    for (const addr of addrs) {
      const display = addr.name || addr.email.split("@")[0];
      if (!seen.has(display)) {
        seen.add(display);
        names.push(display);
      }
    }
  }
  if (names.length === 0) return thread.participants.map((p) => p.name || p.email.split("@")[0]).join(", ");
  if (names.length <= 3) return names.join(", ");
  return `${names.slice(0, 2).join(", ")} +${names.length - 2}`;
}

export function ThreadRow({
  thread,
  index,
  isSelected,
  onDiscard,
}: {
  thread: EmailThread;
  index: number;
  isSelected: boolean;
  onDiscard?: (threadId: string) => void;
}) {
  const setSelectedIndex = useAppStore((s) => s.setSelectedIndex);
  const setOpenThread = useAppStore((s) => s.setOpenThread);
  const activeFolder = useAppStore((s) => s.activeFolder);
  const [discarding, setDiscarding] = useState(false);

  const isDrafts = activeFolder === "drafts";

  async function handleDiscard(e: React.MouseEvent) {
    e.stopPropagation();
    if (discarding) return;
    setDiscarding(true);

    try {
      // The thread in drafts folder — find the draft message ID to delete
      // Gmail drafts: the thread contains a draft message. We need the draft ID.
      // We'll use the thread ID to find and delete the draft via the API.
      const res = await fetch(`/api/drafts/thread?threadId=${thread.id}`);
      const data = await res.json();
      if (data.draft?.id) {
        await fetch(`/api/drafts?draftId=${data.draft.id}`, { method: "DELETE" });
      }
      onDiscard?.(thread.id);
    } catch (err) {
      console.error("Failed to discard draft:", err);
    } finally {
      setDiscarding(false);
    }
  }

  return (
    <div className="relative group">
      <button
        onClick={() => {
          setSelectedIndex(index);
          setOpenThread(thread);
        }}
        className={`w-full text-left px-3 py-2.5 border-b border-gray-800/50 transition-colors ${
          isSelected
            ? "bg-[var(--btn)] border-l-2 border-l-[var(--btn-hover)]"
            : "hover:bg-gray-800/30 border-l-2 border-l-transparent"
        } ${!thread.isRead ? "font-medium" : ""}`}
      >
        <div className="flex items-center justify-between gap-2">
          <span className={`text-sm truncate ${isSelected ? "text-[var(--btn-text)]" : !thread.isRead ? "text-white" : "text-gray-300"}`}>
            {participantNames(thread, activeFolder === "drafts" || activeFolder === "sent")}
          </span>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {thread.messageCount > 1 && (
              <span className={`text-xs px-1.5 rounded ${isSelected ? "text-[var(--btn-text)] bg-[var(--btn-hover)]" : "text-gray-500 bg-gray-800"}`}>
                {thread.messageCount}
              </span>
            )}
            <span className={`text-xs ${isSelected ? "text-[var(--btn-text)] opacity-70" : "text-gray-500"}`}>
              {formatDate(thread.latestDate)}
            </span>
          </div>
        </div>
        <div className={`text-sm truncate mt-0.5 ${isSelected ? "text-[var(--btn-text)]" : !thread.isRead ? "text-gray-200" : "text-gray-400"}`}>
          {thread.subject}
        </div>
        <div className={`text-xs truncate mt-0.5 ${isSelected ? "text-[var(--btn-text)] opacity-60" : "text-gray-600"}`}>
          {thread.snippet}
        </div>
      </button>

      {isDrafts && (
        <button
          onClick={handleDiscard}
          disabled={discarding}
          title="Discard draft"
          className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity
            p-1.5 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-red-500 text-gray-500 dark:text-gray-400 hover:text-white"
        >
          {discarding ? (
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3" />
              <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}
