/**
 * Server-side event bus for pushing CLI commands to the browser via SSE.
 *
 * Uses a temp file as a shared signaling channel because Next.js may
 * evaluate route modules in isolated contexts where `globalThis` singletons
 * are not actually shared.
 */

import fs from "fs";
import path from "path";

export interface CliAttachment {
  id: string;
  messageId: string;
  filename: string;
  mimeType: string;
  size: number;
}

export type CliEvent =
  | { type: "set-draft"; body: string; subject?: string; to?: string; cc?: string; bcc?: string; attachments?: CliAttachment[] }
  | { type: "open-thread"; threadId: string }
  | { type: "move-to-done"; threadId: string }
  | { type: "refresh" }
  | { type: "set-theme"; theme: "dark" | "light" | "system" };

const EVENT_FILE = path.join(process.cwd(), ".cli-events.json");

/**
 * Write an event to the shared file. The SSE poller picks it up.
 */
export function emitEvent(event: CliEvent) {
  const entry = { ...event, _ts: Date.now() };
  try {
    fs.writeFileSync(EVENT_FILE, JSON.stringify(entry), "utf-8");
  } catch (err) {
    console.error("[event-bus] Failed to write event file:", err);
    throw err;
  }
}

/**
 * Poll the shared file for new events. Returns the event if newer than `since`.
 */
export function pollEvent(since: number): (CliEvent & { _ts: number }) | null {
  try {
    if (!fs.existsSync(EVENT_FILE)) return null;
    const raw = fs.readFileSync(EVENT_FILE, "utf-8");
    const entry = JSON.parse(raw);
    if (entry._ts > since) return entry;
    return null;
  } catch {
    return null;
  }
}
