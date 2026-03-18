---
name: coding-lessons
description: Use this skill BEFORE making any code changes to the email helper app. Triggers when editing TypeScript, React, or Next.js files in this project, or when debugging API issues, curl commands, SWR behavior, or Zustand state. Contains documented gotchas and fixes discovered during development — reading this prevents repeating known mistakes.
---

# Coding Lessons — Email Helper App

## curl JSON Escaping
**Problem:** `curl -d '{"body":"line1\nline2"}'` sends literal `\n` → `SyntaxError: Bad escaped character` from Next.js.

**Fix:** Use `printf` with double-escaped newlines piped to `curl -d @-`:
```bash
printf '{"action":"set-draft","body":"Hello\\nWorld"}' \
  | curl -s -X POST http://localhost:3000/api/cli -H "Content-Type: application/json" -d @-
```

## Complex JSON with curl
**Problem:** Apostrophes or nested objects break `printf | curl`.

**Fix:** Use `python3 -c` with `json.dumps` to construct the payload.

## Zustand Stale Closures in Handlers
**Problem:** Reading `store.openThread` inside a `useEffect` keyboard handler gives stale values.

**Fix:** Use `useAppStore.getState()` at the top of the handler. Use `[]` deps and never subscribe to the full store:
```typescript
useEffect(() => {
  function handleKeyDown(e: KeyboardEvent) {
    const s = useAppStore.getState(); // Always fresh
  }
  document.addEventListener("keydown", handleKeyDown);
  return () => document.removeEventListener("keydown", handleKeyDown);
}, []); // Empty deps
```
Also applies to `useCallback` — use `getState()` inside instead of depending on `openThread?.id`.

## Infinite Scroll with SWR
**Problem:** `useRef` for `nextPageToken` means `hasMore` never triggers re-renders.

**Fix:** Use `useState` for `nextPageToken`. Use a separate `loadingMoreRef` to guard double-fetches.

## SSE Event Bus
`POST /api/cli` uses a file-based event bus (`.cli-events.json`), polled every 200ms. Silent write failures drop events — error handling added to `src/lib/event-bus.ts`.

## Session Cookie for curl
Email/calendar API endpoints require NextAuth session cookie. CLI endpoints (`/api/cli`, `/api/cli/state`) have no auth.

**Fix:**
```bash
TOKEN=$(sqlite3 prisma/dev.db "SELECT sessionToken FROM Session ORDER BY expires DESC LIMIT 1;")
curl -s -b "authjs.session-token=$TOKEN" http://localhost:3000/api/emails?folder=inbox
```

## Calendar Event Update API
No PATCH existed — added:
- `updateEvent()` in `src/lib/calendar/google-calendar.ts` (uses `calendar.events.patch` with `sendUpdates: "all"`)
- `PATCH /api/calendar/events/[eventId]` route
- `DELETE` on the same route

## open-thread → Verify State → set-draft
**Rule:** Always call `GET /api/cli/state` after `open-thread` and verify `openThread.id` matches the intended thread before calling `set-draft`. Never skip verification.

## Attachment Forwarding
`set-draft` supports `attachments` array:
1. Read source email for attachment metadata (`id`, `messageId`, `filename`, `mimeType`, `size`)
2. Pass `attachments` array in the `set-draft` call
3. On send, `buildRawMessage` fetches attachment data from Gmail API and constructs multipart/mixed MIME

## setDraft `!== undefined` vs `??`
**Problem:** `??` operator keeps old value when new value is `""` (empty string is falsy to `??`).

**Fix:** All `setDraft` fields use `!== undefined` checks so empty strings can explicitly clear fields.

## composeToEmail null vs empty string
`composeToEmail: string | null` — `null` = not set, `""` = explicitly clear.
- `openCompose` uses `opts?.to ?? null` (not `opts?.to || ""`)
- `setDraft` uses `!== undefined` checks

## discardedThreadIds Set
`discardedThreadIds: Set<string>` with 30s TTL filters threads from SWR updates after move-to-done/archive. 30s aligns with Gmail eventual consistency. Never use JSON-serialize this Set.

## API Error Handling
Always wrap API route handlers with try/catch around `request.json()` and return useful error messages instead of silent 500s.

## DOMPurify Strips id Attributes
`splitQuote()` must run on raw HTML BEFORE DOMPurify sanitization. DOMPurify strips `id` attrs (not in ALLOWED_ATTR), which breaks Outlook quote detection (`divRplyFwdMsg`, `appendonsend`, etc.).

## RFC 2047 for Non-ASCII Headers
Email headers must be ASCII. Use `encodeRfc2047()` for Subject and display names in To/Cc/Bcc. Without this, non-ASCII chars (em dashes, accented names) become mojibake.

## Thread Matching on Send
Only set `replyToMessageId`/`threadId` when the draft subject (cleaned) matches the open thread's subject. Different subject = new thread. Otherwise emails get attached to wrong threads.
