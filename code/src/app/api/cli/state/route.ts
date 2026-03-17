import { NextRequest, NextResponse } from "next/server";
import { uiState, updateUiState } from "@/lib/ui-state";
import type { UiState } from "@/lib/ui-state";

/**
 * GET /api/cli/state — Read current browser UI state.
 * Returns the currently open thread (with full message bodies), active folder,
 * draft content, theme, etc.
 */
export async function GET() {
  return NextResponse.json(uiState);
}

/**
 * POST /api/cli/state — Browser pushes its state here on every change.
 */
export async function POST(request: NextRequest) {
  const body: Partial<UiState> = await request.json();
  updateUiState(body);
  return NextResponse.json({ ok: true });
}
