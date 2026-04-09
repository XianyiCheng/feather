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

export interface DraftPayload {
  body: string;
  subject?: string;
  to?: string;
  cc?: string;
  bcc?: string;
  attachments?: CliAttachment[];
}

export type CliEvent =
  | { type: "set-draft"; body: string; subject?: string; to?: string; cc?: string; bcc?: string; attachments?: CliAttachment[] }
  | { type: "set-drafts"; drafts: DraftPayload[] }
  | { type: "open-thread"; threadId: string }
  | { type: "move-to-done"; threadId: string }
  | { type: "refresh" }
  | { type: "set-theme"; theme: "dark" | "light" | "system" };

const EVENT_FILE = path.join(process.cwd(), ".cli-events.json");

/**
 * Write an event to the shared file. Appends to an array so rapid-fire
 * events (e.g. multiple set-draft calls) are never lost.
 */
export function emitEvent(event: CliEvent) {
  const entry = { ...event, _ts: Date.now() };
  try {
    let queue: Array<CliEvent & { _ts: number }> = [];
    if (fs.existsSync(EVENT_FILE)) {
      try {
        const raw = fs.readFileSync(EVENT_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        queue = Array.isArray(parsed) ? parsed : [parsed];
      } catch { /* corrupt file, start fresh */ }
    }
    queue.push(entry);
    fs.writeFileSync(EVENT_FILE, JSON.stringify(queue), "utf-8");
  } catch (err) {
    console.error("[event-bus] Failed to write event file:", err);
    throw err;
  }
}

/**
 * Read events newer than `since`. Does NOT remove them — events expire by age.
 */
export function pollEvents(since: number): Array<CliEvent & { _ts: number }> {
  try {
    if (!fs.existsSync(EVENT_FILE)) return [];
    const raw = fs.readFileSync(EVENT_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    const queue: Array<CliEvent & { _ts: number }> = Array.isArray(parsed) ? parsed : [parsed];
    // Prune events older than 30 seconds to prevent unbounded growth
    const cutoff = Date.now() - 30_000;
    const live = queue.filter((e) => e._ts > cutoff);
    if (live.length !== queue.length) {
      fs.writeFileSync(EVENT_FILE, JSON.stringify(live), "utf-8");
    }
    return live.filter((e) => e._ts > since);
  } catch {
    return [];
  }
}
