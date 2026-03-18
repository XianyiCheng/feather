# Coding Agent — Lessons Learned

## curl JSON Escaping (2026-03-17)

**Problem:** `curl -d '{"body":"line1\nline2"}'` sends literal `\n` which causes `SyntaxError: Bad escaped character in JSON` from Next.js `request.json()`.

**Fix:** Use `printf` with double-escaped newlines piped to `curl -d @-`:
```bash
printf '{"action":"set-draft","body":"Hello\\nWorld"}' | curl -s -X POST http://localhost:3000/api/cli -H "Content-Type: application/json" -d @-
```

**Why:** In bash single quotes, `\n` is two literal characters (`\` and `n`). JSON expects `\\n` to represent a newline. `printf` interprets `\\n` as literal `\n` which is valid JSON.

## API Error Handling (2026-03-17)

**Problem:** The `POST /api/cli` route returned silent 500 errors with no response body, making debugging impossible.

**Fix:** Added try/catch around `request.json()` and `emitEvent()` in `src/app/api/cli/route.ts` to return descriptive error messages.

**Rule:** Always wrap API route handlers with error handling that returns useful error details.

## Zustand Stale Closures in Keyboard Handlers (2026-03-17)

**Problem:** Reading `store.openThread` (data) inside a `useEffect` keyboard handler gives stale values because the closure captures an old snapshot.

**Fix:** Use `useAppStore.getState()` at call time to read fresh state:
```typescript
case "u": {
  const currentThread = useAppStore.getState().openThread;
  // ...
}
```

**Rule:** In keyboard shortcut handlers, always read data via `useAppStore.getState()`, not from the closure's `store` variable. Store *functions* (like `store.setOpenThread`) are stable and safe to use from closures.

## Infinite Scroll with SWR (2026-03-17)

**Problem:** Using `useRef` for `nextPageToken` meant `hasMore` never triggered re-renders after the initial load, so infinite scroll appeared broken.

**Fix:** Use `useState` for `nextPageToken` so changes trigger re-renders. Use a separate `loadingMoreRef` to guard against double-fetches (since state updates are async).

## SSE Event Bus (2026-03-17)

**Architecture note:** The CLI-to-browser communication uses a file-based event bus (`.cli-events.json`). The SSE endpoint polls this file every 200ms. If the file write fails, events silently disappear. Error handling was added to `src/lib/event-bus.ts` to log failures.

## Session Cookie for curl (2026-03-17)

**Problem:** Email API endpoints return `401 Unauthorized` from curl because NextAuth requires a session cookie. CLI endpoints (`/api/cli`, `/api/cli/state`) have no auth check but all email/calendar endpoints do.

**Fix:** Read session token from SQLite and pass with `-b`:
```bash
TOKEN=$(sqlite3 prisma/dev.db "SELECT sessionToken FROM Session ORDER BY expires DESC LIMIT 1;")
curl -s -b "authjs.session-token=$TOKEN" http://localhost:3000/api/emails?folder=inbox
```

## Complex JSON with curl (2026-03-17)

**Problem:** Sending JSON with special characters (apostrophes, nested objects) via `printf | curl` breaks in bash.

**Fix:** Use `python3 -c` with `subprocess` and `json.dumps` to construct and send the payload.

## Calendar Event Update API (2026-03-17)

**Pattern:** No PATCH endpoint existed for calendar events. Added:
- `updateEvent()` in `src/lib/calendar/google-calendar.ts` (uses `calendar.events.patch` with `sendUpdates: "all"`)
- `PATCH /api/calendar/events/[eventId]` route at `src/app/api/calendar/events/[eventId]/route.ts`
- Also added `DELETE` on the same route for completeness.

**Use:** `PATCH /api/calendar/events/{eventId}` with any subset of `CreateEventParams` to update attendees, time, location, etc.

## Always Verify Thread After open-thread (2026-03-17)

**Problem:** Calling `open-thread` then immediately `set-draft` can place the draft on the wrong thread if the browser hasn't switched yet (or the previous thread was still active).

**Fix:** Always call `GET /api/cli/state` after `open-thread` and verify the returned `openThread.id` and `subject` match the intended thread before calling `set-draft`.

**Rule:** open-thread → verify state → set-draft. Never skip the verification step.

## Attachment Forwarding (2026-03-17)

**Feature:** `set-draft` supports an `attachments` array for forwarding files from existing emails.
1. Read source email to get attachment metadata (`id`, `messageId`, `filename`, `mimeType`, `size`)
2. Pass `attachments` array in the `set-draft` CLI call
3. UI shows attachment chips with X buttons to remove
4. On send, `buildRawMessage` constructs multipart/mixed MIME; attachment data fetched from Gmail API
