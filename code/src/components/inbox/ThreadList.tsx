"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAppStore } from "@/store";
import { ThreadRow } from "./ThreadRow";

export function ThreadList({
  isLoading,
  loadingMore,
  hasMore,
  onLoadMore,
}: {
  isLoading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}) {
  const threads = useAppStore((s) => s.threads);
  const selectedIndex = useAppStore((s) => s.selectedIndex);
  const setThreads = useAppStore((s) => s.setThreads);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = listRef.current?.children[selectedIndex] as HTMLElement;
    if (el) el.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  // Infinite scroll: load more when near bottom
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    function handleScroll() {
      if (!el || loadingMore || !hasMore) return;
      const { scrollTop, scrollHeight, clientHeight } = el;
      if (scrollHeight - scrollTop - clientHeight < 100) {
        onLoadMore();
      }
    }

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [loadingMore, hasMore, onLoadMore]);

  // When threads are removed (e.g. marked done), the list may shrink below the
  // viewport — trigger loadMore if there's more to fetch and content doesn't fill.
  useEffect(() => {
    const el = listRef.current;
    if (!el || loadingMore || !hasMore) return;
    const { scrollHeight, clientHeight } = el;
    if (scrollHeight <= clientHeight + 100) {
      onLoadMore();
    }
  }, [threads.length, hasMore, loadingMore, onLoadMore]);

  const handleDiscard = useCallback(
    (threadId: string) => {
      setThreads(threads.filter((t) => t.id !== threadId));
    },
    [threads, setThreads]
  );

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500 text-sm">Loading emails...</div>
      </div>
    );
  }

  if (threads.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-600 text-sm">No emails found</div>
      </div>
    );
  }

  return (
    <div ref={listRef} className="flex-1 overflow-y-auto">
      {threads.map((thread, index) => (
        <ThreadRow
          key={thread.id}
          thread={thread}
          index={index}
          isSelected={index === selectedIndex}
          onDiscard={handleDiscard}
        />
      ))}
      {loadingMore && (
        <div className="py-3 text-center text-xs text-gray-500">Loading more...</div>
      )}
    </div>
  );
}
