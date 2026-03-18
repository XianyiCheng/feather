import { NextRequest, NextResponse } from "next/server";
import { auth, getValidAccessToken } from "@/lib/auth";
import { getDoc } from "@/lib/docs/google-docs";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accessToken = await getValidAccessToken(session.user.id, "google");
  if (!accessToken) {
    return NextResponse.json({ error: "No Google access token" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing ?id=DOC_ID" }, { status: 400 });
  }

  try {
    const doc = await getDoc(accessToken, id);
    return NextResponse.json(doc);
  } catch (error) {
    console.error("Error fetching Google Doc:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: "Failed to fetch doc", detail: message }, { status: 500 });
  }
}
