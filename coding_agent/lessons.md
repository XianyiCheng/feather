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

## Zustand Stale Closures in Keyboard Handlers (2026-03-17, updated 2026-03-18)

**Problem:** Reading `store.openThread` (data) inside a `useEffect` keyboard handler gives stale values because the closure captures an old snapshot.

**Fix:** Use `useAppStore.getState()` at call time to read fresh state. The entire `useKeyboardShortcuts` hook should use `[]` as its dependency array and call `getState()` at the top of the handler:
```typescript
useEffect(() => {
  function handleKeyDown(e: KeyboardEvent) {
    const s = useAppStore.getState(); // Always fresh
    // use s.openThread, s.threads, etc.
  }
  document.addEventListener("keydown", handleKeyDown);
  return () => document.removeEventListener("keydown", handleKeyDown);
}, []); // Empty deps — getState() is always current
```

**Rule:** Never subscribe to the full store object (`const store = useAppStore()`) just to use it in an effect. Use `getState()` inside the handler instead. This also avoids re-registering the event listener on every render.

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

## DOMPurify Strips id Attributes (2026-03-18)

**Problem:** `splitQuote()` in `ThreadView.tsx` was running on DOMPurify-sanitized HTML. Since `id` is NOT in `ALLOWED_ATTR`, all Outlook quote markers (`divRplyFwdMsg`, `appendonsend`, `mail-editor-reference-message-container`) were stripped before pattern matching. Quoted email text rendered inline instead of being collapsed.

**Fix:** Run `splitQuote()` on raw HTML BEFORE sanitizing. Then sanitize each part (`main` and `quoted`) separately. This preserves `id` attributes for pattern matching while still sanitizing the output.

**Rule:** Any function that needs to inspect email HTML structure (ids, classes, attributes) must run before DOMPurify sanitization, not after.

## RFC 2047 Encoding for Email Headers (2026-03-18)

**Problem:** `buildRawMessage` wrote non-ASCII characters (em dashes, accented names, CJK) directly into Subject and To/Cc/Bcc headers. RFC 2822 headers must be ASCII. Gmail re-encoded these, creating mojibake (e.g., `—` → `â€"`).

**Fix:** Added `encodeRfc2047()` that base64-encodes non-ASCII strings as `=?UTF-8?B?...?=`. Applied to both Subject and display names in address headers via `formatAddr()`.

**Rule:** All email header values with potential non-ASCII content must be RFC 2047 encoded.

## Emails Sent From DraftReply Get Wrong Thread (2026-03-18)

**Problem:** `handleSend` always passed `replyToMessageId: openThread?.id`, so any email composed while viewing a thread was threaded with it — even with a completely different subject.

**Fix:** Compare the cleaned draft subject against the open thread's subject (stripping Re:/Fwd:/[tags]). Only set `replyToMessageId` when they match. Same logic applied to `saveDraftToGmail`.

**Rule:** Before threading an email, verify the subject matches the thread. Different subject = new thread.

## Gmail Thread Detach Procedure (2026-03-18)

**Problem:** Gmail doesn't allow moving messages between threads. A message sent with the wrong `threadId` is permanently attached.

**Workaround:**
**Update:** Physical thread detachment via `messages.import` is unreliable (Gmail re-threads by subject, adds SENT label if From matches account, loses INBOX label on untrash). Instead, we split threads **in the UI by subject**: `splitThreadBySubject()` groups messages by `cleanSubject()` and creates virtual thread IDs (`realThreadId:firstMessageId`). All thread actions resolve virtual IDs via `resolveThreadId()`.

## Gmail threads.list Sort Order (2026-03-19)

**Problem:** `threads.list` sorts by thread ID (creation time), not by latest message. Old threads with new replies get buried in pagination.

**Fix:** Use `messages.list` (sorts by date) → deduplicate by threadId → fetch thread details. This ensures threads with recent activity appear first.

## cleanSubject and [EXTERNAL] Tags (2026-03-19)

**Problem:** Email gateways prepend `[WARNING - EXTERNAL]` or `[EXTERNAL]` to subjects. This causes subject-based thread splitting to create extra groups for the same conversation.

**Fix:** `cleanSubject()` now strips `[*EXTERNAL*]` tags before removing Re:/Fwd: prefixes.

## Multi-Draft Per-Thread Cache (2026-03-19)

**Problem:** Switching threads or navigating away lost the in-progress draft. The store (`setOpenThread`, `setActiveFolder`, Escape/Done keyboard shortcuts) cleared all compose fields on every navigation, and DraftReply held a single set of `useState` fields with no persistence across thread switches.

**Fix:** Added a `draftCacheRef` (Map keyed by thread ID) in DraftReply that saves/restores draft state on thread switches. A `fieldsRef` tracks current field values so the effect always reads fresh state (avoids stale closures since the fields aren't in the deps array). Removed compose field clearing from `setOpenThread`, `setActiveFolder`, and keyboard shortcuts (Escape, Done) — DraftReply's cache handles persistence independently.

**Key details:**
- Cache saves when switching **away** from a thread with non-empty body
- Cache restores when switching **back** — skips Gmail draft fetch and default reply init
- Cache entry deleted on send (prevent stale restore) and when body is empty
- `clearDraft()`, `closeCompose()`, and `triggerRefresh()` still clear compose fields (intentional resets)
- Store compose fields (`composeDraft`, etc.) are now only a one-shot signal channel from CLI → DraftReply; they are not cleared by navigation

**Rule:** Never clear compose fields in navigation actions. DraftReply owns its own state via the per-thread cache. Only explicit user/CLI actions (clear, close, refresh) should reset drafts.

## Outlook \r\n Line Endings in Quote Detection (2026-03-19)

**Problem:** `PLAIN_QUOTE_RE` in `splitQuote()` used `\n` for line breaks, but Outlook emails use `\r\n`. The `From:...\nSent:` pattern didn't match `From:...\r\nSent:`, so quoted text wasn't collapsed.

**Fix:** Changed all `\n` in the regex to `\r?\n` to match both Unix and Windows line endings.
