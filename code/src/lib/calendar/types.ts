export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: string;
  end: string;
  allDay: boolean;
  attendees: { name?: string; email: string; responseStatus?: string }[];
  htmlLink?: string;
}

export interface CreateEventParams {
  summary: string;
  description?: string;
  location?: string;
  start: string; // ISO 8601
  end: string;   // ISO 8601
  allDay?: boolean;
  attendees?: { email: string }[];
}

export interface ListEventsParams {
  timeMin?: string; // ISO 8601
  timeMax?: string; // ISO 8601
  maxResults?: number;
  query?: string;
}
