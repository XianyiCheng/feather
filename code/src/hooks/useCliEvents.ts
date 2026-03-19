"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store";

/**
 * Listens to SSE events from /api/cli/events and updates the store.
 * This is how Claude Code CLI pushes changes to the browser.
 */
export function useCliEvents() {
  useEffect(() => {
    const es = new EventSource("/api/cli/events");

    es.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case "set-draft": {
            const state = useAppStore.getState();
            const isNewCompose = !!data.to && !state.openThread;

            if (isNewCompose) {
              // Append to compose queue — DraftReply reads from queue directly
              const newDraft = {
                to: data.to || "",
                cc: data.cc || "",
                bcc: data.bcc || "",
                subject: data.subject || "",
                body: data.body || "",
                attachments: data.attachments || [],
              };
              const queue = [...state.composeQueue, newDraft];
              useAppStore.setState({
                composeQueue: queue,
                activeComposeIndex: queue.length - 1,
              });
            } else {
              // Reply or update current draft (thread open)
              useAppStore.setState({
                composeDraft: data.body,
                composeSubject: data.subject || state.composeSubject,
                composeToEmail: data.to || state.composeToEmail,
                composeCc: data.cc || state.composeCc,
                composeBcc: data.bcc || state.composeBcc,
                composeAttachments: data.attachments || state.composeAttachments,
              });
            }
            break;
          }

          case "set-drafts": {
            // Batch: set entire compose queue at once (avoids timing issues with multiple set-draft calls)
            const drafts = (data.drafts || []).map((d: any) => ({
              to: d.to || "",
              cc: d.cc || "",
              bcc: d.bcc || "",
              subject: d.subject || "",
              body: d.body || "",
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
            // Fetch the thread data and open it
            const res = await fetch(`/api/emails/${data.threadId}`);
            if (res.ok) {
              const thread = await res.json();
              useAppStore.setState({ openThread: thread });
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
      } catch (e) {
        console.error("CLI event parse error:", e);
      }
    };

    es.onerror = () => {
      // EventSource will auto-reconnect
    };

    return () => es.close();
  }, []);
}
