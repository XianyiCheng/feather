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
          case "set-draft":
            useAppStore.setState({
              composeDraft: data.body,
              composeSubject: data.subject || useAppStore.getState().composeSubject,
              composeToEmail: data.to || useAppStore.getState().composeToEmail,
              composeCc: data.cc || useAppStore.getState().composeCc,
              composeBcc: data.bcc || useAppStore.getState().composeBcc,
              composeAttachments: data.attachments || useAppStore.getState().composeAttachments,
            });
            break;

          case "open-thread": {
            // Fetch the thread data and open it
            const res = await fetch(`/api/emails/${data.threadId}`);
            if (res.ok) {
              const thread = await res.json();
              useAppStore.setState({ openThread: thread });
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
