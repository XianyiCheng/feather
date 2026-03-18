import { NextRequest, NextResponse } from "next/server";
import { auth, getValidAccessToken } from "@/lib/auth";
import { listEvents } from "@/lib/calendar/google-calendar";

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
  const timeMinRaw = searchParams.get("timeMin");
  const timeMaxRaw = searchParams.get("timeMax");
  // Ensure timestamps are valid ISO 8601 with timezone for Google Calendar API
  const timeMin = timeMinRaw ? (timeMinRaw.endsWith("Z") || timeMinRaw.includes("+") ? timeMinRaw : timeMinRaw + "Z") : undefined;
  const timeMax = timeMaxRaw ? (timeMaxRaw.endsWith("Z") || timeMaxRaw.includes("+") ? timeMaxRaw : timeMaxRaw + "Z") : undefined;
  const query = searchParams.get("q") || undefined;

  try {
    const events = await listEvents(accessToken, { timeMin, timeMax, query });
    return NextResponse.json({ events });
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: "Failed to fetch events", detail: message }, { status: 500 });
  }
}
