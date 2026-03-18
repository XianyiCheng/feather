import { google } from "googleapis";
import type { CalendarEvent, CreateEventParams, ListEventsParams } from "./types";

function getCalendarClient(accessToken: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });
  return google.calendar({ version: "v3", auth });
}

export async function listEvents(
  accessToken: string,
  params: ListEventsParams = {}
): Promise<CalendarEvent[]> {
  const calendar = getCalendarClient(accessToken);

  const now = new Date();
  const timeMin = params.timeMin || now.toISOString();
  const timeMax =
    params.timeMax ||
    new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(); // default: next 7 days

  const res = await calendar.events.list({
    calendarId: "primary",
    timeMin,
    timeMax,
    maxResults: params.maxResults || 50,
    singleEvents: true,
    orderBy: "startTime",
    q: params.query || undefined,
  });

  return (res.data.items || []).map(eventToCalendarEvent);
}

export async function getEvent(
  accessToken: string,
  eventId: string
): Promise<CalendarEvent> {
  const calendar = getCalendarClient(accessToken);
  const res = await calendar.events.get({
    calendarId: "primary",
    eventId,
  });
  return eventToCalendarEvent(res.data);
}

export async function createEvent(
  accessToken: string,
  params: CreateEventParams
): Promise<CalendarEvent> {
  const calendar = getCalendarClient(accessToken);

  const event: any = {
    summary: params.summary,
    description: params.description,
    location: params.location,
    attendees: params.attendees?.map((a) => ({ email: a.email })),
  };

  if (params.allDay) {
    // All-day events use date (not dateTime)
    event.start = { date: params.start.split("T")[0] };
    event.end = { date: params.end.split("T")[0] };
  } else {
    event.start = { dateTime: params.start, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone };
    event.end = { dateTime: params.end, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone };
  }

  const res = await calendar.events.insert({
    calendarId: "primary",
    requestBody: event,
  });

  return eventToCalendarEvent(res.data);
}

export async function updateEvent(
  accessToken: string,
  eventId: string,
  params: Partial<CreateEventParams>
): Promise<CalendarEvent> {
  const calendar = getCalendarClient(accessToken);

  const patch: any = {};
  if (params.summary) patch.summary = params.summary;
  if (params.description !== undefined) patch.description = params.description;
  if (params.location !== undefined) patch.location = params.location;
  if (params.attendees) patch.attendees = params.attendees.map((a) => ({ email: a.email }));
  if (params.start) patch.start = { dateTime: params.start, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone };
  if (params.end) patch.end = { dateTime: params.end, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone };

  const res = await calendar.events.patch({
    calendarId: "primary",
    eventId,
    requestBody: patch,
    sendUpdates: "all",
  });

  return eventToCalendarEvent(res.data);
}

export async function acceptEvent(
  accessToken: string,
  eventId: string,
  userEmail: string,
  response: "accepted" | "declined" | "tentative" = "accepted"
): Promise<CalendarEvent> {
  const calendar = getCalendarClient(accessToken);

  // Fetch current attendees to preserve them, then update just ours
  const current = await calendar.events.get({ calendarId: "primary", eventId });
  const attendees = (current.data.attendees || []).map((a: any) =>
    a.email === userEmail ? { ...a, responseStatus: response } : a
  );

  const res = await calendar.events.patch({
    calendarId: "primary",
    eventId,
    requestBody: { attendees },
    sendUpdates: "all",
  });

  return eventToCalendarEvent(res.data);
}

export async function deleteEvent(
  accessToken: string,
  eventId: string
): Promise<void> {
  const calendar = getCalendarClient(accessToken);
  await calendar.events.delete({
    calendarId: "primary",
    eventId,
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function eventToCalendarEvent(event: any): CalendarEvent {
  const start = event.start?.dateTime || event.start?.date || "";
  const end = event.end?.dateTime || event.end?.date || "";
  const allDay = !event.start?.dateTime;

  return {
    id: event.id || "",
    summary: event.summary || "(No title)",
    description: event.description,
    location: event.location,
    start,
    end,
    allDay,
    attendees: (event.attendees || []).map((a: any) => ({
      name: a.displayName,
      email: a.email,
      responseStatus: a.responseStatus,
    })),
    htmlLink: event.htmlLink,
  };
}
