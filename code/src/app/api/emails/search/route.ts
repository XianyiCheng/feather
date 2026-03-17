import { NextRequest, NextResponse } from "next/server";
import { auth, getValidAccessToken } from "@/lib/auth";
import { emailClient } from "@/lib/email";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  if (!query) {
    return NextResponse.json({ error: "Query required" }, { status: 400 });
  }

  const accessToken = await getValidAccessToken(session.user.id, "google");
  if (!accessToken) {
    return NextResponse.json({ error: "No access token" }, { status: 403 });
  }

  try {
    const result = await emailClient.searchEmails(accessToken, query);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error searching emails:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
