import { NextRequest, NextResponse } from "next/server";
import { auth, getValidAccessToken } from "@/lib/auth";
import { emailClient } from "@/lib/email";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const accessToken = await getValidAccessToken(session.user.id, "google");
  if (!accessToken) {
    return NextResponse.json({ error: "No access token" }, { status: 403 });
  }

  try {
    // Fetch the full thread (all messages with bodies)
    const thread = await emailClient.getThread(accessToken, id);
    return NextResponse.json(thread);
  } catch (error) {
    console.error("Error fetching thread:", error);
    return NextResponse.json({ error: "Failed to fetch thread" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { action } = body as { action: "archive" | "markAsRead" | "markAsUnread" | "moveToDone" | "moveToInbox" };

  const accessToken = await getValidAccessToken(session.user.id, "google");
  if (!accessToken) {
    return NextResponse.json({ error: "No access token" }, { status: 403 });
  }

  try {
    if (action === "archive") {
      await emailClient.archiveThread(accessToken, id);
    } else if (action === "markAsRead") {
      await emailClient.markThreadAsRead(accessToken, id);
    } else if (action === "markAsUnread") {
      await emailClient.markThreadAsUnread(accessToken, id);
    } else if (action === "moveToDone") {
      await emailClient.moveToDone(accessToken, id);
    } else if (action === "moveToInbox") {
      await emailClient.moveToInbox(accessToken, id);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error performing action:", error);
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
