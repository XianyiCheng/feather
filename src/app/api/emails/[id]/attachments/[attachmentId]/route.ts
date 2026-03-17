import { NextRequest, NextResponse } from "next/server";
import { auth, getValidAccessToken } from "@/lib/auth";
import { emailClient } from "@/lib/email";

/**
 * GET /api/emails/{messageId}/attachments/{attachmentId}
 * Returns the attachment binary data with correct Content-Type.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; attachmentId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: messageId, attachmentId } = await params;
  const accessToken = await getValidAccessToken(session.user.id, "google");
  if (!accessToken) {
    return NextResponse.json({ error: "No access token" }, { status: 403 });
  }

  try {
    const { data } = await emailClient.getAttachment(accessToken, messageId, attachmentId);
    const buffer = Buffer.from(data, "base64url");

    // Try to determine content type from the request's filename query param
    const filename = request.nextUrl.searchParams.get("filename") || "attachment";
    const mimeType = request.nextUrl.searchParams.get("mimeType") || "application/octet-stream";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(buffer.length),
      },
    });
  } catch (error) {
    console.error("Error fetching attachment:", error);
    return NextResponse.json({ error: "Failed to fetch attachment" }, { status: 500 });
  }
}
