import { NextRequest, NextResponse } from "next/server";
import { pollEvents } from "@/lib/event-bus";

export const dynamic = "force-dynamic";

/**
 * GET /api/cli/poll?since=<timestamp>
 * Polling fallback for when SSE connection drops.
 * Returns any events newer than the given timestamp.
 */
export async function GET(request: NextRequest) {
  const since = Number(request.nextUrl.searchParams.get("since") || "0");
  const events = pollEvents(since);
  // Strip internal _ts from response but include lastTs for next poll
  const lastTs = events.length > 0 ? events[events.length - 1]._ts : since;
  const cleaned = events.map(({ _ts, ...rest }) => rest);
  return NextResponse.json({ events: cleaned, lastTs });
}
