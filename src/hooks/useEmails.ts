import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useSWR from "swr";
import { useAppStore } from "@/store";
import type { ThreadListResult, EmailThread } from "@/lib/email/types";

const EMPTY_THREADS: EmailThread[] = [];
const PAGE_SIZE = 10;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useThreads() {
  const activeFolder = useAppStore((s) => s.activeFolder);

  const { data, error, isLoading, mutate } = useSWR<ThreadListResult>(
    `/api/emails?folder=${activeFolder}&maxResults=${PAGE_SIZE}`,
    fetcher,
    {
      revalidateOnFocus: true,
      dedupingInterval: 5000,
    }
  );

  const [extraThreads, setExtraThreads] = useState<EmailThread[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>(undefined);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadingMoreRef = useRef(false);
  const prevFolderRef = useRef(activeFolder);

  // Reset when folder changes
  if (activeFolder !== prevFolderRef.current) {
    prevFolderRef.current = activeFolder;
    setExtraThreads([]);
    setNextPageToken(undefined);
  }

  // Sync nextPageToken from initial SWR data
  useEffect(() => {
    if (data?.nextPageToken) {
      setNextPageToken(data.nextPageToken);
    }
  }, [data?.nextPageToken]);

  const baseThreads = useMemo(() => data?.threads ?? EMPTY_THREADS, [data?.threads]);
  const threads = useMemo(() => {
    if (extraThreads.length === 0) return baseThreads;
    const seen = new Set(baseThreads.map((t) => t.id));
    const unique = extraThreads.filter((t) => !seen.has(t.id));
    return [...baseThreads, ...unique];
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
  const { data, error, isLoading } = useSWR<EmailThread>(
    threadId ? `/api/emails/${threadId}` : null,
    fetcher
  );

  return { thread: data, isLoading, error };
}
