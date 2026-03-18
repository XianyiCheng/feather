import { NextRequest, NextResponse } from "next/server";
import { auth, getValidAccessToken } from "@/lib/auth";
import { emailClient } from "@/lib/email";

/**
 * DELETE /api/drafts?draftId=xxx — Delete a Gmail draft.
 */
export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accessToken = await getValidAccessToken(session.user.id, "google");
  if (!accessToken) {
    return NextResponse.json({ error: "No access token" }, { status: 403 });
  }

  const draftId = request.nextUrl.searchParams.get("draftId");
  if (!draftId) {
    return NextResponse.json({ error: "draftId is required" }, { status: 400 });
  }

  try {
    await emailClient.deleteDraft(accessToken, draftId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting draft:", error);
    return NextResponse.json({ error: "Failed to delete draft" }, { status: 500 });
  }
}

/**
 * POST /api/drafts — Create or update a Gmail draft.
 * Body: { to, cc?, bcc?, subject, body, threadId?, draftId? }
 * If draftId is provided, updates the existing draft. Otherwise creates a new one.
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accessToken = await getValidAccessToken(session.user.id, "google");
  if (!accessToken) {
    return NextResponse.json({ error: "No access token" }, { status: 403 });
  }

  let parsedBody: any;
  try {
    parsedBody = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const { to, cc, bcc, subject, body, threadId, draftId, attachments } = parsedBody;

  try {
    const params = {
      to: to || [],
      cc: cc || [],
      bcc: bcc || [],
      subject: subject || "",
      body: body || "",
      threadId,
      attachments,
    };

    let draft;
    if (draftId) {
      draft = await emailClient.updateDraft(accessToken, draftId, params);
    } else {
      draft = await emailClient.createDraft(accessToken, params);
    }
    return NextResponse.json(draft);
  } catch (error) {
    console.error("Error saving draft:", error);
    return NextResponse.json({ error: "Failed to save draft" }, { status: 500 });
  }
}
