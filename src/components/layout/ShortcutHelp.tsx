"use client";

import { useAppStore } from "@/store";

const shortcuts = [
  { keys: "j / k", desc: "Navigate up/down" },
  { keys: "Enter", desc: "Open selected email" },
  { keys: "Escape", desc: "Close email / modal" },
  { keys: "e", desc: "Archive email" },
  { keys: "u", desc: "Toggle read/unread" },
  { keys: "r", desc: "Reply to email" },
  { keys: "c", desc: "Compose new email" },
  { keys: "/", desc: "Focus search" },
  { keys: "t", desc: "Toggle theme" },
  { keys: "g i", desc: "Go to Inbox" },
  { keys: "g s", desc: "Go to Sent" },
  { keys: "g d", desc: "Go to Drafts" },
  { keys: "g a", desc: "Go to Archive" },
  { keys: "?", desc: "Toggle this help" },
];

export function ShortcutHelp() {
  const { toggleShortcutHelp } = useAppStore();

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={toggleShortcutHelp}
    >
      <div
        className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-white mb-4">
          Keyboard Shortcuts
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {shortcuts.map((s) => (
            <div key={s.keys} className="flex items-center gap-3">
              <kbd className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm text-gray-300 font-mono min-w-[4rem] text-center">
                {s.keys}
              </kbd>
              <span className="text-sm text-gray-400">{s.desc}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-600 mt-4 text-center">
          Press <kbd className="text-gray-400">?</kbd> or <kbd className="text-gray-400">Escape</kbd> to close
        </p>
      </div>
    </div>
  );
}
