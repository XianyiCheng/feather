"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useAppStore } from "@/store";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useCliEvents } from "@/hooks/useCliEvents";
import { useTheme } from "@/hooks/useTheme";
import { useStateSync } from "@/hooks/useStateSync";
import { useThreads } from "@/hooks/useEmails";
import { Sidebar } from "./Sidebar";
import { ThreadList } from "../inbox/ThreadList";
import { ThreadView } from "../email/ThreadView";
import { DraftReply } from "../email/DraftReply";
import { ComposeModal } from "../email/ComposeModal";
import { ShortcutHelp } from "./ShortcutHelp";
import { ThemeToggle } from "./ThemeToggle";
import { TerminalPanel } from "./TerminalPanel";
import { PanelHeader } from "./PanelHeader";

function loadSize(key: string, fallback: number): number {
  if (typeof window === "undefined") return fallback;
  const saved = localStorage.getItem(key);
  return saved ? parseInt(saved, 10) : fallback;
}

function saveSize(key: string, value: number) {
  if (typeof window !== "undefined") localStorage.setItem(key, String(Math.round(value)));
}

export function AppShell() {
  useKeyboardShortcuts();
  useCliEvents();
  useTheme();
  useStateSync();

  const { threads: fetchedThreads, isLoading, loadingMore, hasMore, loadMore, error } = useThreads();
  const openThread = useAppStore((s) => s.openThread);
  const activeFolder = useAppStore((s) => s.activeFolder);
  const isComposeOpen = useAppStore((s) => s.isComposeOpen);
  const showShortcutHelp = useAppStore((s) => s.showShortcutHelp);
  const focusedPanel = useAppStore((s) => s.focusedPanel);
  // In drafts folder, show full-height compose only for standalone drafts (1 message).
  // Reply drafts (>1 message) show thread view + compose like normal folders.
  const isDraftOpen = activeFolder === "drafts" && !!openThread && (openThread.messageCount || openThread.messages?.length || 0) <= 1;

  useEffect(() => {
    const { discardedThreadIds, markedReadIds, setThreads } = useAppStore.getState();
    const threads = fetchedThreads
      .filter((t) => !discardedThreadIds.has(t.id))
      .map((t) => markedReadIds.has(t.id) ? { ...t, isRead: true } : t);
    setThreads(threads);
  }, [fetchedThreads]);

  // Thread list width in px (resizable)
  const [threadListW, setThreadListW] = useState(() => loadSize("threadlist-w", 320));
  // Draft reply height as percentage of the email column
  const [draftPct, setDraftPct] = useState(() => loadSize("draft-pct", 35));
  // Terminal panel width in px (resizable, 0 = collapsed)
  const [terminalW, setTerminalW] = useState(() => loadSize("terminal-w", 500));
  const [isDragging, setIsDragging] = useState(false);
  const terminalCollapsed = terminalW < 60;
  const toggleTerminal = useCallback(() => {
    const next = terminalCollapsed ? (loadSize("terminal-w-last", 500) || 500) : terminalW;
    if (terminalCollapsed) {
      setTerminalW(next);
      saveSize("terminal-w", next);
    } else {
      saveSize("terminal-w-last", terminalW);
      setTerminalW(0);
      saveSize("terminal-w", 0);
    }
  }, [terminalCollapsed, terminalW]);

  const containerRef = useRef<HTMLDivElement>(null);
  const emailColRef = useRef<HTMLDivElement>(null);

  const startDrag = useCallback(
    (
      setter: (v: number) => void,
      storageKey: string,
      axis: "x" | "y",
      getBase: () => number,
      min: number,
      max: number,
      asPct?: boolean,
      refEl?: React.RefObject<HTMLDivElement | null>,
      reverse?: boolean,
      snapThreshold?: number, // if set, values below this snap to 0
    ) => {
      return (e: React.MouseEvent) => {
        e.preventDefault();
        const startPos = axis === "x" ? e.clientX : e.clientY;
        const startVal = getBase();

        function clampAndSnap(raw: number): number {
          if (snapThreshold !== undefined && raw < snapThreshold) return 0;
          return Math.max(min, Math.min(max, raw));
        }

        function onMove(ev: MouseEvent) {
          const rawDelta = (axis === "x" ? ev.clientX : ev.clientY) - startPos;
          const delta = reverse ? -rawDelta : rawDelta;
          if (asPct && refEl?.current) {
            const total = axis === "x" ? refEl.current.offsetWidth : refEl.current.offsetHeight;
            const deltaPct = (delta / total) * 100;
            const newVal = clampAndSnap(startVal - deltaPct);
            setter(newVal);
            saveSize(storageKey, newVal);
          } else {
            const newVal = clampAndSnap(startVal + delta);
            setter(newVal);
            saveSize(storageKey, newVal);
          }
        }

        function onUp() {
          document.removeEventListener("mousemove", onMove);
          document.removeEventListener("mouseup", onUp);
          document.body.style.cursor = "";
          document.body.style.userSelect = "";
          setIsDragging(false);
        }

        setIsDragging(true);
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
        document.body.style.cursor = axis === "x" ? "col-resize" : "row-resize";
        document.body.style.userSelect = "none";
      };
    },
    []
  );

  const isAuthError = error?.status === 403 || error?.status === 401;

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-gray-100">
      {/* Draggable title bar region for Electron (macOS traffic lights) */}
      <div className="h-8 flex-shrink-0 bg-gray-950" style={{ WebkitAppRegion: "drag" } as React.CSSProperties} />
      {isDragging && (
        <div
          className="fixed inset-0 z-50"
          style={{ cursor: "col-resize" }}
        />
      )}
      {isAuthError && (
        <div className="px-4 py-2 bg-yellow-900/80 border-b border-yellow-700 text-yellow-200 text-sm flex items-center justify-between">
          <span>Google session expired. Please sign in again to refresh your token.</span>
          <a
            href="/api/auth/signin?callbackUrl=/"
            className="ml-4 px-3 py-1 bg-yellow-700 hover:bg-yellow-600 rounded text-white text-xs font-medium"
          >
            Sign In
          </a>
        </div>
      )}
      <div ref={containerRef} className="flex-1 flex min-h-0">
        {/* Col 1: Sidebar (fixed width) */}
        <div className="w-44 flex-shrink-0 h-full overflow-hidden">
          <Sidebar />
        </div>

        {/* Col 2: Thread list */}
        <div
          style={{ width: threadListW }}
          className="flex-shrink-0 h-full overflow-hidden"
          onClick={() => useAppStore.getState().setFocusedPanel("threads")}
        >
          <div className="flex flex-col h-full">
            <PanelHeader title="Threads" active={focusedPanel === "threads"} />
            <SearchBar />
            <ThreadList isLoading={isLoading} loadingMore={loadingMore} hasMore={hasMore} onLoadMore={loadMore} />
          </div>
        </div>

        <DragHandle
          direction="col"
          onMouseDown={startDrag(setThreadListW, "threadlist-w", "x", () => threadListW, 200, 500)}
        />

        {/* Col 3: Email + Draft — fills remaining space */}
        <div
          ref={emailColRef}
          className="flex-1 min-w-0 h-full overflow-hidden flex flex-col"
          onClick={() => useAppStore.getState().setFocusedPanel("email")}
        >
          <PanelHeader title="Email" active={focusedPanel === "email"} />
          {isDraftOpen ? (
            /* Draft folder: full-height compose, no thread above */
            <DraftReply />
          ) : (
            <>
              {/* Thread view */}
              <div style={{ flex: `${100 - draftPct} 0 0%` }} className="overflow-auto min-h-0">
                {openThread ? (
                  <ThreadView />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-600">
                    <div className="text-center">
                      <p className="text-lg">Select a conversation</p>
                      <p className="text-sm mt-1">
                        <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400">j</kbd>/
                        <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400">k</kbd> navigate ·{" "}
                        <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400">Enter</kbd> open
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <DragHandle
                direction="row"
                onMouseDown={startDrag(setDraftPct, "draft-pct", "y", () => draftPct, 10, 70, true, emailColRef)}
              />

              {/* Draft reply */}
              <div style={{ flex: `${draftPct} 0 0%` }} className="overflow-hidden border-t border-gray-800 min-h-0">
                <DraftReply />
              </div>
            </>
          )}
        </div>

        {/* Col 4: Terminal panel */}
        <DragHandle
          direction="col"
          onMouseDown={startDrag(
            (v: number) => {
              setTerminalW(v);
              if (v >= 60) saveSize("terminal-w-last", v);
            },
            "terminal-w",
            "x",
            () => terminalW,
            200,
            900,
            false,
            undefined,
            true,
            200, // anything narrower than 200px snaps closed
          )}
        />
        {terminalCollapsed && (
          <button
            onClick={toggleTerminal}
            className="flex-shrink-0 h-full w-6 border-l border-gray-800 bg-gray-900 hover:bg-gray-800 text-gray-500 hover:text-gray-200 text-xs flex items-center justify-center transition-colors"
            title="Show terminal"
          >
            ‹
          </button>
        )}
        <div
          style={{
            width: terminalCollapsed ? 0 : terminalW,
            visibility: terminalCollapsed ? "hidden" : "visible",
          }}
          className="flex-shrink-0 h-full overflow-hidden border-l border-gray-800"
          onClick={() => useAppStore.getState().setFocusedPanel("terminal")}
        >
          <TerminalPanel onCollapse={toggleTerminal} />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-gray-900 border-t border-gray-800 text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <span><kbd className="text-gray-400">j/k</kbd> navigate</span>
          <span><kbd className="text-gray-400">Enter</kbd> open</span>
          <span><kbd className="text-gray-400">e</kbd> archive</span>
          <span><kbd className="text-gray-400">d</kbd> done/inbox</span>
          <span><kbd className="text-gray-400">u</kbd> read/unread</span>
          <span><kbd className="text-gray-400">r</kbd> reply</span>
          <span><kbd className="text-gray-400">c</kbd> compose</span>
          <span><kbd className="text-gray-400">/</kbd> search</span>
          <span><kbd className="text-gray-400">?</kbd> help</span>
        </div>
      </div>

      {isComposeOpen && <ComposeModal />}
      {showShortcutHelp && <ShortcutHelp />}
    </div>
  );
}

function DragHandle({
  onMouseDown,
  direction,
}: {
  onMouseDown: (e: React.MouseEvent) => void;
  direction: "col" | "row";
}) {
  const isCol = direction === "col";
  return (
    <div
      onMouseDown={onMouseDown}
      className={`flex-shrink-0 flex items-center justify-center
        ${isCol ? "w-2 cursor-col-resize" : "h-2 cursor-row-resize"}
        bg-gray-800 hover:bg-gray-600 active:bg-gray-500 transition-colors`}
    >
      <div className={`rounded-full bg-gray-600 ${isCol ? "w-0.5 h-8" : "h-0.5 w-8"}`} />
    </div>
  );
}

function SearchBar() {
  const searchQuery = useAppStore((s) => s.searchQuery);
  const setSearchQuery = useAppStore((s) => s.setSearchQuery);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setSearchQuery("");
      (e.target as HTMLInputElement).blur();
      e.preventDefault();
    }
  }

  return (
    <div className="p-2 border-b border-gray-800">
      <input
        id="search-input"
        type="text"
        placeholder="Search emails... (press /)"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-md text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
      />
    </div>
  );
}
