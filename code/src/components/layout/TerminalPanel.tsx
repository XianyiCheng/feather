"use client";

import { useState } from "react";

export function TerminalPanel() {
  const [reloadKey, setReloadKey] = useState(0);

  return (
    <div className="h-full flex flex-col bg-gray-950">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-gray-800 flex-shrink-0">
        <span className="text-xs text-gray-400 font-medium">Claude Terminal</span>
        <button
          onClick={() => setReloadKey((k) => k + 1)}
          className="text-xs text-gray-500 hover:text-gray-200 transition-colors"
          title="Reload terminal"
        >
          ↻
        </button>
      </div>
      <div className="flex-1 min-h-0 overflow-hidden bg-gray-950">
        <iframe
          key={reloadKey}
          src="http://localhost:3001"
          className="w-full h-full border-0"
          title="Terminal"
        />
      </div>
    </div>
  );
}
