"use client";

import { signOut } from "next-auth/react";
import { useAppStore, type Folder } from "@/store";

const folders: { key: Folder; label: string; shortcut: string }[] = [
  { key: "inbox", label: "Inbox", shortcut: "g i" },
  { key: "promotions", label: "Promotions", shortcut: "g p" },
  { key: "done", label: "Done", shortcut: "g n" },
  { key: "sent", label: "Sent", shortcut: "g s" },
  { key: "drafts", label: "Drafts", shortcut: "g d" },
  { key: "archive", label: "Archive", shortcut: "g a" },
];

export function Sidebar() {
  const activeFolder = useAppStore((s) => s.activeFolder);
  const setActiveFolder = useAppStore((s) => s.setActiveFolder);

  return (
    <aside className="w-44 bg-gray-900 border-r border-gray-800 flex flex-col py-2 h-full">
      <div className="px-3 pb-2 mb-2 border-b border-gray-800">
        <h1 className="text-sm font-semibold text-gray-300 tracking-wide">
          Email Helper
        </h1>
      </div>
      <nav className="flex-1">
        {folders.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFolder(f.key)}
            className={`w-full flex items-center justify-between px-3 py-2 text-sm transition-colors ${
              activeFolder === f.key
                ? "bg-gray-800 text-white font-medium"
                : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"
            }`}
          >
            <span>{f.label}</span>
            <span className="text-xs text-gray-600">{f.shortcut}</span>
          </button>
        ))}
      </nav>
      <div className="px-3 py-2 border-t border-gray-800 space-y-2">
        <button
          onClick={() => useAppStore.getState().openCompose({ mode: "new" })}
          className="w-full py-2 btn-accent text-sm font-medium rounded-md transition-colors"
        >
          Compose (c)
        </button>
        <button
          onClick={() => signOut({ callbackUrl: "/api/auth/signin" })}
          className="w-full py-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
