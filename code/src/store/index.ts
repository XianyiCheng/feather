import { create } from "zustand";
import type { EmailThread, ForwardedAttachment } from "@/lib/email/types";

export type Folder = "inbox" | "sent" | "drafts" | "archive" | "done" | "promotions";
export type Theme = "dark" | "light" | "system";

export interface QueuedDraft {
  to: string;
  cc: string;
  bcc: string;
  subject: string;
  body: string;
  attachments: ForwardedAttachment[];
}

interface AppState {
  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;
  cycleTheme: () => void;

  // Folder
  activeFolder: Folder;
  setActiveFolder: (folder: Folder) => void;

  // Thread list
  threads: EmailThread[];
  selectedIndex: number;
  setThreads: (threads: EmailThread[]) => void;
  selectNext: () => void;
  selectPrevious: () => void;
  setSelectedIndex: (index: number) => void;

  // Open thread
  openThread: EmailThread | null;
  setOpenThread: (thread: EmailThread | null) => void;

  // Draft reply (controlled by CLI API)
  composeDraft: string;
  composeSubject: string;
  composeToEmail: string | null;
  composeCc: string;
  composeBcc: string;
  composeDraftId: string; // Gmail draft ID for updates
  composeAttachments: ForwardedAttachment[];
  setDraft: (opts: { body?: string; subject?: string; to?: string; cc?: string; bcc?: string; draftId?: string; attachments?: ForwardedAttachment[] }) => void;
  clearDraft: () => void;

  // Compose modal (for 'c' new email)
  isComposeOpen: boolean;
  openCompose: (opts?: { mode?: "new" | "reply"; draft?: string; subject?: string; to?: string; cc?: string; bcc?: string }) => void;
  closeCompose: () => void;

  // Compose queue (for multiple new emails from CLI)
  composeQueue: QueuedDraft[];
  activeComposeIndex: number;
  setActiveComposeIndex: (index: number) => void;
  updateQueueEntry: (index: number, draft: QueuedDraft) => void;
  removeQueueEntry: (index: number) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Shortcut help
  showShortcutHelp: boolean;
  toggleShortcutHelp: () => void;

  // Threads optimistically removed (moved to done/archived) — filtered from SWR results until Gmail catches up
  discardedThreadIds: Set<string>;
  discardThread: (id: string) => void;

  // Threads optimistically marked as read — prevents SWR revalidation from reverting to unread
  markedReadIds: Set<string>;
  markThreadRead: (id: string) => void;

  // CLI push event counter — incremented to trigger refetches
  refreshCounter: number;
  triggerRefresh: () => void;

  // Thread detail refresh counter — incremented after sending to reload current thread
  threadRefreshCounter: number;
  triggerThreadRefresh: () => void;

  // Focused panel — which panel has keyboard focus
  focusedPanel: "threads" | "email" | "terminal";
  cycleFocusedPanel: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Theme
  theme: (typeof window !== "undefined"
    ? (localStorage.getItem("theme") as Theme) || "dark"
    : "dark") as Theme,
  setTheme: (theme) => {
    set({ theme });
    if (typeof window !== "undefined") localStorage.setItem("theme", theme);
  },
  cycleTheme: () => {
    const order: Theme[] = ["dark", "light", "system"];
    const { theme } = get();
    const next = order[(order.indexOf(theme) + 1) % order.length];
    get().setTheme(next);
  },

  // Folder
  activeFolder: "inbox",
  setActiveFolder: (folder) => {
    set({ activeFolder: folder, selectedIndex: -1, openThread: null });
  },

  // Thread list
  threads: [],
  selectedIndex: -1,
  setThreads: (threads) => set({ threads }),
  selectNext: () => {
    const { selectedIndex, threads } = get();
    if (selectedIndex < threads.length - 1) set({ selectedIndex: selectedIndex + 1 });
  },
  selectPrevious: () => {
    const { selectedIndex } = get();
    if (selectedIndex > 0) set({ selectedIndex: selectedIndex - 1 });
  },
  setSelectedIndex: (index) => set({ selectedIndex: index }),

  // Open thread
  openThread: null,
  setOpenThread: (thread) => {
    set({ openThread: thread });
  },

  // Draft reply
  composeDraft: "",
  composeSubject: "",
  composeToEmail: null,
  composeCc: "",
  composeBcc: "",
  composeDraftId: "",
  composeAttachments: [],
  setDraft: (opts) =>
    set({
      composeDraft: opts.body !== undefined ? opts.body : get().composeDraft,
      composeSubject: opts.subject !== undefined ? opts.subject : get().composeSubject,
      composeToEmail: opts.to !== undefined ? opts.to : get().composeToEmail,
      composeCc: opts.cc !== undefined ? opts.cc : get().composeCc,
      composeBcc: opts.bcc !== undefined ? opts.bcc : get().composeBcc,
      composeDraftId: opts.draftId !== undefined ? opts.draftId : get().composeDraftId,
      composeAttachments: opts.attachments !== undefined ? opts.attachments : get().composeAttachments,
    }),
  clearDraft: () => set({ composeDraft: "", composeSubject: "", composeToEmail: null, composeCc: "", composeBcc: "", composeDraftId: "", composeAttachments: [] }),

  // Compose modal
  isComposeOpen: false,
  openCompose: (opts) =>
    set({
      isComposeOpen: true,
      composeDraft: opts?.draft || "",
      composeSubject: opts?.subject || "",
      composeToEmail: opts?.to ?? null,
      composeCc: opts?.cc || "",
      composeBcc: opts?.bcc || "",
    }),
  closeCompose: () =>
    set({ isComposeOpen: false, composeDraft: "", composeSubject: "", composeToEmail: null, composeCc: "", composeBcc: "", composeDraftId: "", composeAttachments: [] }),

  // Compose queue
  composeQueue: [],
  activeComposeIndex: 0,
  setActiveComposeIndex: (index) => set({ activeComposeIndex: index }),
  updateQueueEntry: (index, draft) => {
    const updated = [...get().composeQueue];
    if (index >= 0 && index < updated.length) {
      updated[index] = draft;
      set({ composeQueue: updated });
    }
  },
  removeQueueEntry: (index) => {
    const { composeQueue, activeComposeIndex } = get();
    if (composeQueue.length <= 1) {
      set({ composeQueue: [], activeComposeIndex: 0 });
      return;
    }
    const updated = composeQueue.filter((_, i) => i !== index);
    let newIndex = activeComposeIndex;
    if (index < activeComposeIndex) newIndex--;
    else if (index === activeComposeIndex) newIndex = Math.min(newIndex, updated.length - 1);
    set({ composeQueue: updated, activeComposeIndex: newIndex });
  },

  // Search
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Shortcut help
  showShortcutHelp: false,
  toggleShortcutHelp: () =>
    set((state) => ({ showShortcutHelp: !state.showShortcutHelp })),

  // CLI refresh
  refreshCounter: 0,
  triggerRefresh: () =>
    set((state) => ({
      refreshCounter: state.refreshCounter + 1,
      openThread: null,
      composeDraft: "",
      composeSubject: "",
      composeToEmail: null,
      composeCc: "",
      composeBcc: "",
      composeDraftId: "",
      composeAttachments: [],
    })),

  threadRefreshCounter: 0,
  triggerThreadRefresh: () => set((state) => ({ threadRefreshCounter: state.threadRefreshCounter + 1 })),

  focusedPanel: "threads",
  cycleFocusedPanel: () => set((state) => {
    const order: Array<"threads" | "email" | "terminal"> = ["threads", "email", "terminal"];
    const idx = order.indexOf(state.focusedPanel);
    return { focusedPanel: order[(idx + 1) % order.length] };
  }),

  discardedThreadIds: new Set<string>(),
  discardThread: (id) => {
    set((state) => ({ discardedThreadIds: new Set([...state.discardedThreadIds, id]) }));
    // Clear after 30s — by then Gmail will have processed the label change
    setTimeout(() => {
      set((state) => {
        const next = new Set(state.discardedThreadIds);
        next.delete(id);
        return { discardedThreadIds: next };
      });
    }, 30_000);
  },

  markedReadIds: new Set<string>(),
  markThreadRead: (id) => {
    set((state) => ({ markedReadIds: new Set([...state.markedReadIds, id]) }));
    setTimeout(() => {
      set((state) => {
        const next = new Set(state.markedReadIds);
        next.delete(id);
        return { markedReadIds: next };
      });
    }, 30_000);
  },
}));

