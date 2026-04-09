import { NextRequest, NextResponse } from "next/server";
import { auth, getValidAccessToken } from "@/lib/auth";
import { emailClient } from "@/lib/email";

/**
 * POST /api/emails/[id]/forward — Forward an email as a draft, including attachments.
 * Body: { to, cc?, bcc?, body? }
 * Fetches the source message's attachments and creates a Gmail draft with them.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: messageId } = await params;
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

  const { to, cc, bcc, body } = parsedBody;

  if (!to || !Array.isArray(to) || to.length === 0) {
    return NextResponse.json({ error: "to is required" }, { status: 400 });
  }

  try {
    // Fetch the source thread to get the message and its attachments
    const thread = await emailClient.getThread(accessToken, messageId);
    // Find the specific message (for split threads, messageId may differ from threadId)
    const sourceMsg = thread.messages.find((m: any) => m.id === messageId)
      || thread.messages[thread.messages.length - 1];

    // Build forwarded body
    const from = sourceMsg.from;
    const fwdHeader = [
      "---------- Forwarded message ----------",
      `From: ${from.name ? from.name + " &lt;" + from.email + "&gt;" : from.email}`,
      `Date: ${sourceMsg.date}`,
      `Subject: ${sourceMsg.subject}`,
      `To: ${(sourceMsg.to || []).map((t: any) => t.email).join(", ")}`,
      "",
    ].join("<br>");

    const userBody = body ? body + "<br><br>" : "";
    const fullBody = userBody + fwdHeader + "<br>" + (sourceMsg.body || "");

    // Map attachments to ForwardedAttachment format
    const attachments = (sourceMsg.attachments || []).map((att: any) => ({
      id: att.id,
      messageId: att.messageId || messageId,
      filename: att.filename,
      mimeType: att.mimeType,
      size: att.size,
    }));

    const draft = await emailClient.createDraft(accessToken, {
      to,
      cc: cc || [],
      bcc: bcc || [],
      subject: `Fwd: ${sourceMsg.subject}`,
      body: fullBody,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    return NextResponse.json({
      ...draft,
      attachments: attachments.map(({ id, filename, mimeType, size }) => ({
        id, filename, mimeType, size,
      })),
    });
  } catch (error) {
    console.error("Error forwarding email:", error);
    return NextResponse.json({ error: "Failed to forward email" }, { status: 500 });
  }
}
