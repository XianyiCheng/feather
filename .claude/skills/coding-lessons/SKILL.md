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

## open-thread + set-draft Is Unreliable — Use Gmail Drafts API
**Problem:** `open-thread` via SSE/polling frequently fails to open the thread in the browser, making subsequent `set-draft` calls silently drop. The pipeline is fragile due to SSE disconnects, HMR, and timing issues.

**Fix:** For replies to threads not currently open, bypass `open-thread` + `set-draft` entirely. Save drafts directly to Gmail via `POST /api/drafts` with `threadId`. Only use `set-draft` when the user already has the thread open in the browser (verified via `GET /api/cli/state`).

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

**Reply threading requires two things:**
1. `threadId` (Gmail thread ID) — passed to `messages.send` so Gmail threads it on sender's side
2. `replyToMessageId` (Gmail message ID of the last message) — used to fetch the original `Message-ID` header and set `In-Reply-To`/`References` in the outgoing email so the *recipient's* mail client threads it

`DraftReply.tsx` must pass `openThread.messages[last].id` as `replyToMessageId` (not `openThread.id` which is the thread ID). `buildRawMessage` adds `In-Reply-To` and `References` headers.

## Multi-Draft Per-Thread Cache
DraftReply has a `draftCacheRef` (Map<threadId, DraftState>) that saves/restores draft fields on thread switch. A `fieldsRef` tracks current values to avoid stale closures. Navigation actions (`setOpenThread`, `setActiveFolder`, keyboard shortcuts) must NOT clear compose fields — DraftReply's cache handles persistence. Only `clearDraft()`, `closeCompose()`, and `triggerRefresh()` should reset drafts.

## Gmail threads.list Sort Order
`threads.list` sorts by thread creation, not latest message. Use `messages.list` (date-sorted) → deduplicate by threadId → fetch threads. See `listThreads()` in `gmail.ts`.

**Over-fetch to avoid missed threads:** `messages.list` with a folder query (e.g. `in:inbox`) only returns messages with that label. A thread's latest message may have a different label (e.g. SENT), making the thread appear newer by thread date than by its matching-message date. Fetch `maxResults * 4` messages, collect ALL unique threads (don't cap during dedup), then sort by thread `latestDate` and slice to page size.

## Subject-Based Thread Splitting
Gmail threads messages by References/In-Reply-To headers regardless of subject changes. `splitThreadBySubject()` creates virtual thread IDs (`realThreadId:firstMessageId`). All thread actions resolve via `resolveThreadId()`. `cleanSubject()` strips `[*EXTERNAL*]` tags.

## Outlook \r\n in Quote Detection
`PLAIN_QUOTE_RE` must use `\r?\n` (not `\n`) to match both Unix and Windows line endings in `From:...\r\nSent:` patterns.

## Multiple New Emails — Use Gmail Drafts API, Not set-draft
**Problem:** Multiple `set-draft` calls for new emails (no open thread) overwrite each other — the compose panel only holds one draft. Attempting to queue them via Zustand store fails because the compose field pipeline (`composeDraft` → useEffect → local state) loses intermediate values when events arrive rapidly.

**Fix:** For batch new emails, save each directly to Gmail via `POST /api/drafts` (requires session token). User views them in the Drafts folder (`g d`). `set-draft` is only for single drafts or replies to an open thread.

## set-draft Must Not Use Compose Queue
**Problem:** Routing single `set-draft` events into `composeQueue` (for new compose with `to` field) broke the compose box — the queue effect loaded the draft but the compose fields weren't set, so the draft box appeared empty.

**Fix:** `set-draft` always sets compose fields directly (`composeDraft`, `composeToEmail`, etc.). Only `set-drafts` (plural, batch action) populates the `composeQueue`. Single new emails work via the normal compose field pipeline.

## Event Bus Supports Queued Events
`emitEvent()` now appends to a JSON array in `.cli-events.json` instead of overwriting. `pollEvents()` returns all events newer than `since` (non-destructive read; events expire after 30s). This prevents rapid-fire CLI calls from dropping events. The SSE endpoint delivers all queued events per poll cycle.

## Search API Searches All Mail
**Problem:** `GET /api/emails/search?q=...` only searched inbox because `searchEmails()` called `listEmails()` which defaulted `folderToQuery()` to `"in:inbox -category:promotions"`. Emails in sent, archive, or other labels were invisible to search.

**Fix:** `searchEmails()` now queries Gmail directly with no folder restriction (`q: query` only). The `folderToQuery()` default is only for folder-based listing, not search.

## Send Button Fails with Split Thread IDs
**Problem:** Sending a reply from the drafts folder fails because `openThread.id` can be a split thread ID (`realThreadId:firstMessageId`), which the Gmail API rejects as an invalid `threadId`.

**Fix:** `sendEmail()` in `gmail.ts` now passes `replyToMessageId` through `resolveThreadId()` before sending to Gmail.

## Drafts Folder: Show Thread for Reply Drafts
**Problem:** Opening a reply draft in the drafts folder showed only the compose box with no thread context — user couldn't see what they were replying to.

**Fix:** `isDraftOpen` in `AppShell.tsx` now checks `messageCount <= 1`. Reply drafts (thread has >1 message) render with `ThreadView` + `DraftReply` like normal folders. Standalone drafts (1 message) still get full-height compose.

## set-draft Body: Use \n, Not HTML
**Problem:** `set-draft` body is rendered in a `<textarea>` (plain text). Sending `<br>` tags shows them as literal text instead of line breaks.

**Fix:** `handleCliEvent` in `useCliEvents.ts` now auto-converts `<br>` → `\n` and strips other HTML tags before setting `composeDraft`. Use `\n` (not `<br>`) in set-draft bodies. `<br>` is for `POST /api/drafts` (Gmail API) only.

## SWR Cache Must Include refreshCounter
**Problem:** CLI `refresh` action incremented `refreshCounter` in the store and cleared `openThread`, but the SWR key in `useThreads` didn't include it. Thread list stayed stale after refresh because SWR served its cached response.

**Fix:** Subscribe to `refreshCounter` in `useThreads` and append `&_r=${refreshCounter}` to the SWR key. Any store state that should trigger a refetch must be part of the SWR key.

## NextAuth Re-Auth Doesn't Update Tokens
**Problem:** When user re-signs in with Google, NextAuth PrismaAdapter only calls `linkAccount` for NEW accounts. Existing accounts keep stale tokens. If Google revokes the refresh token (e.g. after `prompt: "consent"`), the stored token becomes permanently invalid — token refresh returns `invalid_grant`.

**Fix:** Added `signIn` callback in `auth.ts` that calls `prisma.account.updateMany()` to overwrite `access_token`, `refresh_token`, and `expires_at` on every sign-in. If the account doesn't exist yet (first sign-in), the update is a no-op and the adapter creates it normally.

## SSE + Polling Fallback for CLI Events
**Problem:** SSE connection drops during Next.js HMR (hot reload), causing `set-draft` and other CLI events to be silently lost. Browser requires hard refresh to reconnect.

**Fix:** `useCliEvents` now has dual channels: SSE (primary) + REST polling fallback (`GET /api/cli/poll?since=<ts>`) every 2 seconds. Polling only activates when SSE appears unhealthy (`readyState !== OPEN`). Events are kept in the file for 30s so both channels can read them independently.
