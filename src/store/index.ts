import { create } from "zustand";
import type { EmailThread, ForwardedAttachment } from "@/lib/email/types";

export type Folder = "inbox" | "sent" | "drafts" | "archive";
export type Theme = "dark" | "light" | "system";

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
  composeToEmail: string;
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

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Shortcut help
  showShortcutHelp: boolean;
  toggleShortcutHelp: () => void;

  // CLI push event counter — incremented to trigger refetches
  refreshCounter: number;
  triggerRefresh: () => void;
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
    set({ activeFolder: folder, selectedIndex: 0, openThread: null, composeDraft: "", composeSubject: "", composeToEmail: "", composeCc: "", composeBcc: "", composeDraftId: "", composeAttachments: [] });
  },

  // Thread list
  threads: [],
  selectedIndex: 0,
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
    set({
      openThread: thread,
      composeDraft: "",
      composeSubject: "",
      composeToEmail: "",
      composeCc: "",
      composeBcc: "",
      composeDraftId: "",
      composeAttachments: [],
    });
  },

  // Draft reply
  composeDraft: "",
  composeSubject: "",
  composeToEmail: "",
  composeCc: "",
  composeBcc: "",
  composeDraftId: "",
  composeAttachments: [],
  setDraft: (opts) =>
    set({
      composeDraft: opts.body ?? get().composeDraft,
      composeSubject: opts.subject ?? get().composeSubject,
      composeToEmail: opts.to ?? get().composeToEmail,
      composeCc: opts.cc ?? get().composeCc,
      composeBcc: opts.bcc ?? get().composeBcc,
      composeDraftId: opts.draftId ?? get().composeDraftId,
      composeAttachments: opts.attachments ?? get().composeAttachments,
    }),
  clearDraft: () => set({ composeDraft: "", composeSubject: "", composeToEmail: "", composeCc: "", composeBcc: "", composeDraftId: "", composeAttachments: [] }),

  // Compose modal
  isComposeOpen: false,
  openCompose: (opts) =>
    set({
      isComposeOpen: true,
      composeDraft: opts?.draft || "",
      composeSubject: opts?.subject || "",
      composeToEmail: opts?.to || "",
      composeCc: opts?.cc || "",
      composeBcc: opts?.bcc || "",
    }),
  closeCompose: () =>
    set({ isComposeOpen: false, composeDraft: "", composeSubject: "", composeToEmail: "", composeCc: "", composeBcc: "", composeDraftId: "", composeAttachments: [] }),

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
      composeToEmail: "",
      composeCc: "",
      composeBcc: "",
      composeDraftId: "",
      composeAttachments: [],
    })),
}));
