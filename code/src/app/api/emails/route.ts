import { NextRequest, NextResponse } from "next/server";
import { auth, getValidAccessToken } from "@/lib/auth";
import { emailClient } from "@/lib/email";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const folder = searchParams.get("folder") || "inbox";
  const pageToken = searchParams.get("pageToken") || undefined;
  const maxResults = parseInt(searchParams.get("maxResults") || "30", 10);
  const query = searchParams.get("q") || undefined;

  const accessToken = await getValidAccessToken(session.user.id, "google");
  if (!accessToken) {
    return NextResponse.json(
      { error: "No access token. Please sign in with Google." },
      { status: 403 }
    );
  }

  try {
    const result = await emailClient.listThreads(accessToken, { folder, pageToken, maxResults, query });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching threads:", error);
    return NextResponse.json({ error: "Failed to fetch emails" }, { status: 500 });
  }
}
