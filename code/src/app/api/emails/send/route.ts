import { NextRequest, NextResponse } from "next/server";
import { auth, getValidAccessToken } from "@/lib/auth";
import { emailClient } from "@/lib/email";

const PRIMARY_EMAIL = "YOUR_PRIMARY_EMAIL@example.com";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const { to, cc, bcc, subject, body: emailBody, replyToMessageId, attachments } = body;

  const accessToken = await getValidAccessToken(session.user.id, "google");
  if (!accessToken) {
    return NextResponse.json({ error: "No access token" }, { status: 403 });
  }

  // Always CC primary email on every outgoing email (reply, new, forward)
  const ccList: { name: string; email: string }[] = Array.isArray(cc) ? [...cc] : [];
  const allRecipients = [
    ...(to || []).map((a: any) => a.email?.toLowerCase()),
    ...ccList.map((a: any) => a.email?.toLowerCase()),
    ...(bcc || []).map((a: any) => a.email?.toLowerCase()),
  ];
  if (!allRecipients.includes(PRIMARY_EMAIL.toLowerCase())) {
    ccList.push({ name: "", email: PRIMARY_EMAIL });
  }

  try {
    await emailClient.sendEmail(accessToken, {
      to, cc: ccList.length ? ccList : undefined, bcc, subject,
      body: emailBody, replyToMessageId, attachments,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: "Send failed" }, { status: 500 });
  }
}
