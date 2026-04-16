"use client";

import { useEffect, useRef } from "react";

export function TerminalPanel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<any>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const fitAddonRef = useRef<any>(null);
  const initedRef = useRef(false);

  useEffect(() => {
    if (initedRef.current || !containerRef.current) return;
    initedRef.current = true;

    let disposed = false;

    async function init() {
      const { Terminal } = await import("@xterm/xterm");
      const { FitAddon } = await import("@xterm/addon-fit");

      // Import CSS — use require to avoid TS module resolution error
      // @ts-expect-error CSS import handled by bundler
      await import("@xterm/xterm/css/xterm.css");

      if (disposed || !containerRef.current) return;

      const fitAddon = new FitAddon();
      fitAddonRef.current = fitAddon;

      const term = new Terminal({
        cursorBlink: true,
        fontSize: 13,
        fontFamily: "var(--font-mono), 'Menlo', 'Monaco', 'Courier New', monospace",
        theme: {
          background: "#030712",
          foreground: "#e5e7eb",
          cursor: "#e5e7eb",
          selectionBackground: "#374151",
          black: "#030712",
          red: "#ef4444",
          green: "#22c55e",
          yellow: "#eab308",
          blue: "#3b82f6",
          magenta: "#a855f7",
          cyan: "#06b6d4",
          white: "#e5e7eb",
          brightBlack: "#6b7280",
          brightRed: "#f87171",
          brightGreen: "#4ade80",
          brightYellow: "#facc15",
          brightBlue: "#60a5fa",
          brightMagenta: "#c084fc",
          brightCyan: "#22d3ee",
          brightWhite: "#f9fafb",
        },
      });

      term.loadAddon(fitAddon);
      term.open(containerRef.current);
      fitAddon.fit();
      termRef.current = term;

      // Connect WebSocket
      const ws = new WebSocket("ws://localhost:3001");
      wsRef.current = ws;

      ws.onopen = () => {
        // Send initial size
        ws.send(JSON.stringify({ type: "resize", cols: term.cols, rows: term.rows }));
      };

      ws.onmessage = (e) => {
        term.write(e.data);
      };

      ws.onclose = () => {
        term.write("\r\n\x1b[33m[Terminal disconnected. Refresh to reconnect.]\x1b[0m\r\n");
      };

      // Terminal → WebSocket
      term.onData((data: string) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(data);
        }
      });

      // Handle resize
      term.onResize(({ cols, rows }: { cols: number; rows: number }) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: "resize", cols, rows }));
        }
      });

      // Observe container size changes
      const ro = new ResizeObserver(() => {
        fitAddon.fit();
      });
      ro.observe(containerRef.current);
    }

    init();

    return () => {
      disposed = true;
      wsRef.current?.close();
      termRef.current?.dispose();
    };
  }, []);

  return (
    <div className="h-full flex flex-col bg-gray-950">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-gray-800 flex-shrink-0">
        <span className="text-xs text-gray-400 font-medium">Claude Terminal</span>
      </div>
      <div ref={containerRef} className="flex-1 min-h-0 overflow-hidden px-1 py-1" />
    </div>
  );
}
