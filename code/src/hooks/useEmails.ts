import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useSWR from "swr";
import { useAppStore } from "@/store";
import type { ThreadListResult, EmailThread } from "@/lib/email/types";

const EMPTY_THREADS: EmailThread[] = [];
const PAGE_SIZE = 10;

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (res.status === 403) {
    const body = await res.json().catch(() => ({}));
    const err = new Error(body?.error || "Forbidden");
    (err as any).status = 403;
    throw err;
  }
  if (res.status === 401) {
    const err = new Error("Unauthorized");
    (err as any).status = 401;
    throw err;
  }
  return res.json();
};

export function useThreads() {
  const activeFolder = useAppStore((s) => s.activeFolder);
  const searchQuery = useAppStore((s) => s.searchQuery);
  const refreshCounter = useAppStore((s) => s.refreshCounter);

  // Debounce search query so we don't fire on every keystroke
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Include refreshCounter in the SWR key so CLI refresh busts the cache
  const swrKey = debouncedQuery
    ? `/api/emails?folder=${activeFolder}&maxResults=${PAGE_SIZE}&q=${encodeURIComponent(debouncedQuery)}&_r=${refreshCounter}`
    : `/api/emails?folder=${activeFolder}&maxResults=${PAGE_SIZE}&_r=${refreshCounter}`;

  const { data, error, isLoading, mutate } = useSWR<ThreadListResult>(
    swrKey,
    fetcher,
    {
      revalidateOnFocus: true,
      refreshInterval: 15000,
      dedupingInterval: 3000,
    }
  );

  const [extraThreads, setExtraThreads] = useState<EmailThread[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>(undefined);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadingMoreRef = useRef(false);
  const prevFolderRef = useRef(activeFolder);
  const prevQueryRef = useRef(debouncedQuery);

  // Reset when folder or search query changes
  if (activeFolder !== prevFolderRef.current || debouncedQuery !== prevQueryRef.current) {
    prevFolderRef.current = activeFolder;
    prevQueryRef.current = debouncedQuery;
    setExtraThreads([]);
    setNextPageToken(undefined);
  }

  // Sync nextPageToken from initial SWR data, and clear stale extra threads
  // when the first page changes (new emails arrived, pagination shifted)
  const prevFirstPageIds = useRef<string>("");
  useEffect(() => {
    if (!data) return;
    if (data.nextPageToken) setNextPageToken(data.nextPageToken);
    const ids = (data.threads || []).map((t) => t.id).join(",");
    if (prevFirstPageIds.current && ids !== prevFirstPageIds.current && extraThreads.length > 0) {
      setExtraThreads([]);
    }
    prevFirstPageIds.current = ids;
  }, [data]);

  const baseThreads = useMemo(() => data?.threads ?? EMPTY_THREADS, [data?.threads]);
  const threads = useMemo(() => {
    // Deduplicate all threads by ID to prevent React key collisions
    // (can happen with virtual thread IDs from subject splitting + extraThreads overlap)
    const seen = new Set<string>();
    const dedup = (list: EmailThread[]) => list.filter((t) => {
      if (seen.has(t.id)) return false;
      seen.add(t.id);
      return true;
    });
    if (extraThreads.length === 0) return dedup(baseThreads);
    return dedup([...baseThreads, ...extraThreads]);
  }, [baseThreads, extraThreads]);

  const hasMore = !!nextPageToken;

  const loadMore = useCallback(async () => {
    if (loadingMoreRef.current || !nextPageToken) return;
    loadingMoreRef.current = true;
    setLoadingMore(true);
    try {
      const res = await fetch(
        `/api/emails?folder=${activeFolder}&maxResults=${PAGE_SIZE}&pageToken=${nextPageToken}`
      );
      const result: ThreadListResult = await res.json();
      setNextPageToken(result.nextPageToken || undefined);
      setExtraThreads((prev) => [...prev, ...(result.threads || [])]);
    } catch (err) {
      console.error("Failed to load more threads:", err);
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, [activeFolder, nextPageToken]);

  return {
    threads,
    isLoading,
    loadingMore,
    hasMore,
    loadMore,
    error,
    refresh: mutate,
  };
}

export function useThreadDetail(threadId: string | null) {
  const threadRefreshCounter = useAppStore((s) => s.threadRefreshCounter);
  const { data, error, isLoading, mutate } = useSWR<EmailThread>(
    threadId ? `/api/emails/${threadId}?_r=${threadRefreshCounter}` : null,
    fetcher
  );

  return { thread: data, isLoading, error, mutate };
}
