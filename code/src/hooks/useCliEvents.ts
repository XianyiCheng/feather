"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "@/store";

/**
 * Process a single CLI event and update the store.
 */
async function handleCliEvent(data: any) {
  switch (data.type) {
    case "set-draft": {
      const state = useAppStore.getState();
      // Convert HTML to plain text for textarea display
      const plainBody = (data.body || "")
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<[^>]*>/g, "");
      // Always set compose fields directly — single drafts don't use the queue
      useAppStore.setState({
        composeDraft: plainBody,
        composeSubject: data.subject || state.composeSubject,
        composeToEmail: data.to || state.composeToEmail,
        composeCc: data.cc || state.composeCc,
        composeBcc: data.bcc || state.composeBcc,
        composeAttachments: data.attachments || state.composeAttachments,
      });
      break;
    }

    case "set-drafts": {
      const drafts = (data.drafts || []).map((d: any) => ({
        to: d.to || "",
        cc: d.cc || "",
        bcc: d.bcc || "",
        subject: d.subject || "",
        body: (d.body || "").replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]*>/g, ""),
        attachments: d.attachments || [],
      }));
      if (drafts.length > 0) {
        useAppStore.setState({
          composeQueue: drafts,
          activeComposeIndex: drafts.length - 1,
        });
      }
      break;
    }

    case "open-thread": {
      const res = await fetch(`/api/emails/${data.threadId}`);
      if (res.ok) {
        const thread = await res.json();
        // Clear selected index to prevent keyboard shortcuts from overriding
        useAppStore.setState({ openThread: thread, selectedIndex: -1 });
      }
      break;
    }

    case "move-to-done": {
      const res = await fetch(`/api/emails/${data.threadId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "moveToDone" }),
      });
      if (res.ok) {
        const state = useAppStore.getState();
        state.discardThread(data.threadId);
        useAppStore.setState({
          threads: state.threads.filter((t) => t.id !== data.threadId),
          openThread: state.openThread?.id === data.threadId ? null : state.openThread,
        });
      }
      break;
    }

    case "refresh":
      useAppStore.getState().triggerRefresh();
      break;

    case "set-theme":
      useAppStore.getState().setTheme(data.theme);
      break;

    case "connected":
    case "ping":
      break;
  }
}

/**
 * Listens to SSE events from /api/cli/events and updates the store.
 * Also polls /api/cli/poll as a fallback in case SSE drops (e.g. during HMR).
 */
export function useCliEvents() {
  const pollTsRef = useRef(Date.now());

  useEffect(() => {
    let sseAlive = false;

    // --- SSE primary channel ---
    const es = new EventSource("/api/cli/events");

    es.onmessage = async (event) => {
      sseAlive = true;
      try {
        const data = JSON.parse(event.data);
        await handleCliEvent(data);
      } catch (e) {
        console.error("CLI event parse error:", e);
      }
    };

    es.onerror = () => {
      sseAlive = false;
    };

    // --- Polling fallback (catches events missed during SSE disconnects) ---
    const pollInterval = setInterval(async () => {
      // Only poll if SSE seems unhealthy
      if (sseAlive && es.readyState === EventSource.OPEN) return;

      try {
        const res = await fetch(`/api/cli/poll?since=${pollTsRef.current}`);
        if (!res.ok) return;
        const { events, lastTs } = await res.json();
        if (lastTs) pollTsRef.current = lastTs;
        for (const evt of events) {
          await handleCliEvent(evt);
        }
      } catch {
        // Network error — ignore, will retry next interval
      }
    }, 2000);

    return () => {
      es.close();
      clearInterval(pollInterval);
    };
  }, []);
}
