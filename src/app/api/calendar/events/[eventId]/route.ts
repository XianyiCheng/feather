import { NextRequest, NextResponse } from "next/server";
import { auth, getValidAccessToken } from "@/lib/auth";
import { updateEvent, deleteEvent } from "@/lib/calendar/google-calendar";
import type { CreateEventParams } from "@/lib/calendar/types";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accessToken = await getValidAccessToken(session.user.id, "google");
  if (!accessToken) {
    return NextResponse.json({ error: "No Google access token" }, { status: 403 });
  }

  const { eventId } = await params;
  const body: Partial<CreateEventParams> = await request.json();

  try {
    const event = await updateEvent(accessToken, eventId, body);
    return NextResponse.json({ event });
  } catch (error) {
    console.error("Error updating calendar event:", error);
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accessToken = await getValidAccessToken(session.user.id, "google");
  if (!accessToken) {
    return NextResponse.json({ error: "No Google access token" }, { status: 403 });
  }

  const { eventId } = await params;

  try {
    await deleteEvent(accessToken, eventId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting calendar event:", error);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
