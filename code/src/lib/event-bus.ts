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
 * Poll the shared file for new events. Returns all events newer than `since`.
 */
export function pollEvents(since: number): Array<CliEvent & { _ts: number }> {
  try {
    if (!fs.existsSync(EVENT_FILE)) return [];
    const raw = fs.readFileSync(EVENT_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    const queue: Array<CliEvent & { _ts: number }> = Array.isArray(parsed) ? parsed : [parsed];
    const results = queue.filter((e) => e._ts > since);
    // Clean up consumed events
    if (results.length > 0) {
      const remaining = queue.filter((e) => e._ts > results[results.length - 1]._ts);
      fs.writeFileSync(EVENT_FILE, JSON.stringify(remaining), "utf-8");
    }
    return results;
  } catch {
    return [];
  }
}

/** @deprecated Use pollEvents instead */
export function pollEvent(since: number): (CliEvent & { _ts: number }) | null {
  const events = pollEvents(since);
  return events.length > 0 ? events[events.length - 1] : null;
}
