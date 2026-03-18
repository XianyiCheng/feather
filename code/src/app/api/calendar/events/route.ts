import { NextRequest, NextResponse } from "next/server";
import { auth, getValidAccessToken } from "@/lib/auth";
import { createEvent } from "@/lib/calendar/google-calendar";
import type { CreateEventParams } from "@/lib/calendar/types";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accessToken = await getValidAccessToken(session.user.id, "google");
  if (!accessToken) {
    return NextResponse.json({ error: "No Google access token" }, { status: 403 });
  }

  let body: CreateEventParams;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!body.summary || !body.start || !body.end) {
    return NextResponse.json(
      { error: "summary, start, and end are required" },
      { status: 400 }
    );
  }

  try {
    const event = await createEvent(accessToken, body);
    return NextResponse.json({ event });
  } catch (error) {
    console.error("Error creating calendar event:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
