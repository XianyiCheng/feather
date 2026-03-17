import { NextRequest, NextResponse } from "next/server";
import { auth, getValidAccessToken } from "@/lib/auth";
import { emailClient } from "@/lib/email";

/**
 * GET /api/drafts/thread?threadId=xxx — Get the saved draft for a thread.
 */
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accessToken = await getValidAccessToken(session.user.id, "google");
  if (!accessToken) {
    return NextResponse.json({ error: "No access token" }, { status: 403 });
  }

  const threadId = request.nextUrl.searchParams.get("threadId");
  if (!threadId) {
    return NextResponse.json({ error: "threadId required" }, { status: 400 });
  }

  try {
    const draft = await emailClient.getDraftsForThread(accessToken, threadId);
    return NextResponse.json({ draft });
  } catch (error) {
    console.error("Error fetching draft:", error);
    return NextResponse.json({ draft: null });
  }
}
