"use client";

import { signOut } from "next-auth/react";
import { useAppStore, type Folder } from "@/store";

const folders: { key: Folder; label: string; icon: string; shortcut: string }[] = [
  { key: "inbox", label: "Inbox", icon: "I", shortcut: "g i" },
  { key: "promotions", label: "Promotions", icon: "P", shortcut: "g p" },
  { key: "done", label: "Done", icon: "✓", shortcut: "g n" },
  { key: "sent", label: "Sent", icon: "→", shortcut: "g s" },
  { key: "drafts", label: "Drafts", icon: "✎", shortcut: "g d" },
  { key: "archive", label: "Archive", icon: "A", shortcut: "g a" },
];

export function Sidebar() {
  const activeFolder = useAppStore((s) => s.activeFolder);
  const setActiveFolder = useAppStore((s) => s.setActiveFolder);

  return (
    <aside className="w-12 bg-gray-900 border-r border-gray-800 flex flex-col py-2 h-full">
      <nav className="flex-1">
        {folders.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFolder(f.key)}
            title={`${f.label} (${f.shortcut})`}
            className={`w-full flex items-center justify-center py-2 text-sm transition-colors ${
              activeFolder === f.key
                ? "bg-gray-800 text-white font-medium"
                : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"
            }`}
          >
            <span>{f.icon}</span>
          </button>
        ))}
      </nav>
      <div className="px-1.5 py-2 border-t border-gray-800 space-y-2">
        <button
          onClick={() => useAppStore.getState().openCompose({ mode: "new" })}
          title="Compose (c)"
          className="w-full py-2 btn-accent text-sm font-medium rounded-md transition-colors"
        >
          +
        </button>
        <button
          onClick={() => signOut({ callbackUrl: "/api/auth/signin" })}
          title="Sign Out"
          className="w-full py-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          ⏻
        </button>
      </div>
    </aside>
  );
}
