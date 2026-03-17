import { NextRequest, NextResponse } from "next/server";
import { emitEvent } from "@/lib/event-bus";
import type { CliEvent } from "@/lib/event-bus";

/**
 * CLI API endpoint — Claude Code calls this to control the browser UI.
 *
 * POST /api/cli
 * Body: { action: string, ...params }
 *
 * Actions:
 *   set-draft    { body, subject?, to? }   — Put text in the draft reply box
 *   open-thread  { threadId }              — Open an email thread in the viewer
 *   move-to-done { threadId }             — Move a thread to Done (removes from inbox)
 *   refresh      {}                        — Reset the UI to a fresh state
 *   set-theme    { theme: "dark"|"light"|"system" }
 */
export async function POST(request: NextRequest) {
  let body: any;
  try {
    body = await request.json();
  } catch (err) {
    console.error("[cli] Failed to parse request body:", err);
    return NextResponse.json({ error: "Invalid JSON body", detail: String(err) }, { status: 400 });
  }
  const { action, ...params } = body;

  let event: CliEvent;

  switch (action) {
    case "set-draft":
      if (!params.body) {
        return NextResponse.json({ error: "body is required" }, { status: 400 });
      }
      event = {
        type: "set-draft",
        body: params.body,
        subject: params.subject,
        to: params.to,
        cc: params.cc,
        bcc: params.bcc,
        attachments: params.attachments,
      };
      break;

    case "open-thread":
      if (!params.threadId) {
        return NextResponse.json({ error: "threadId is required" }, { status: 400 });
      }
      event = { type: "open-thread", threadId: params.threadId };
      break;

    case "refresh":
      event = { type: "refresh" };
      break;

    case "move-to-done":
      if (!params.threadId) {
        return NextResponse.json({ error: "threadId is required" }, { status: 400 });
      }
      event = { type: "move-to-done", threadId: params.threadId };
      break;

    case "set-theme":
      if (!["dark", "light", "system"].includes(params.theme)) {
        return NextResponse.json({ error: "theme must be dark, light, or system" }, { status: 400 });
      }
      event = { type: "set-theme", theme: params.theme };
      break;

    default:
      return NextResponse.json(
        { error: `Unknown action: ${action}. Valid: set-draft, open-thread, move-to-done, refresh, set-theme` },
        { status: 400 }
      );
  }

  try {
    emitEvent(event);
  } catch (err) {
    console.error("[cli] emitEvent failed:", err);
    return NextResponse.json({ error: "Failed to emit event", detail: String(err) }, { status: 500 });
  }
  return NextResponse.json({ ok: true, action });
}
