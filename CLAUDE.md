# Email Helper — Claude Code Integration

This is a browser-based Gmail client running at `http://localhost:3000`. You can control the browser UI and access the user's Gmail and Google Calendar through the API endpoints below.

## Quick Start

Start the dev server: `cd /Users/xianyi/ai_projects/email_helper && npm run dev`

## Agent Folders

This project has two agent knowledge folders:

- **`assistant_agent/`** — Email assistant context: user profile, identity, tone, contacts, drafting rules, and calendar preferences.
  - `profile.md` — user's name (Dr. Xianyi Cheng), role (Duke professor), email style, signature, common contacts
  - `instructions.md` — drafting rules, calendar preferences, custom rules
- **`coding_agent/`** — Coding knowledge base: lessons learned, bug fixes, gotchas, and patterns.
  - `lessons.md` — documented issues and solutions discovered during development

## Important Rules

1. **At the START of every conversation, read `assistant_agent/profile.md` and `assistant_agent/instructions.md` once.** Do not re-read them for subsequent email tasks in the same session.
2. **ALWAYS read `coding_agent/lessons.md` before making code changes** to avoid repeating known issues.
3. **NEVER send emails directly** via the send API. Always use `set-draft` to put drafts in the browser's reply box. The user reviews and clicks Send.
4. **Always CC YOUR_PRIMARY_EMAIL@example.com on replies** (per instructions.md).
5. The draft reply box works both for replies (when a thread is open) and new emails (when no thread is selected). Use `set-draft` for both cases.
6. Clicking a folder button (Inbox, Sent, etc.) clears the draft box. Warn the user if they might lose an unsaved draft.
7. **When calling `set-draft` via curl**, use `printf` with double-escaped newlines piped to `curl -d @-` (see `coding_agent/lessons.md`).
8. **Summarize takeaways** into agent folders only when something genuinely reusable was discovered (new pattern, bug fix, user preference). Skip if nothing new was learned.
## API Endpoints

All endpoints are at `http://localhost:3000`. No authentication needed for local requests.

### Read Current Browser State

**GET /api/cli/state** — Returns what the user is currently looking at in the browser.

Response:
```json
{
  "openThread": {
    "id": "18e1a2b3c4d5e6f7",
    "subject": "Project Update",
    "messageCount": 3,
    "latestDate": "2026-03-16T10:00:00",
    "participants": [{"name": "John", "email": "john@example.com"}],
    "messages": [
      {
        "id": "msg1",
        "from": {"name": "John", "email": "john@example.com"},
        "to": [{"name": "Xianyi", "email": "YOUR_PRIMARY_EMAIL@example.com"}],
        "cc": [],
        "subject": "Project Update",
        "snippet": "Here's the latest...",
        "body": "<p>HTML body</p>",
        "date": "2026-03-16T10:00:00"
      }
    ]
  },
  "activeFolder": "inbox",
  "selectedIndex": 0,
  "draft": {"to": "", "subject": "", "body": ""},
  "theme": "dark"
}
```

If `openThread` is `null`, no thread is currently open. **Always check this first** when the user asks about "this email" or "the current email".

### Control the Browser UI

**POST /api/cli** — Push commands to the browser in real-time via SSE.

Actions:

| Action | Params | Description |
|--------|--------|-------------|
| `set-draft` | `body` (required), `subject`, `to` | Put text in the draft reply box. Works with or without a thread open. |
| `open-thread` | `threadId` (required) | Open an email thread in the viewer. |
| `refresh` | none | Reset the UI — clears open thread, draft, selections. |
| `set-theme` | `theme`: `"dark"` \| `"light"` \| `"system"` | Change the color theme. |

```bash
# Draft a new email (no thread open) — use printf to properly escape newlines
printf '{"action":"set-draft","body":"Hi John,\\n\\nThanks for the update!\\n\\nBest,\\nXianyi","subject":"Re: Project Status","to":"john@example.com"}' \
  | curl -s -X POST http://localhost:3000/api/cli -H "Content-Type: application/json" -d @-

# Open a thread then draft a reply
printf '{"action":"open-thread","threadId":"18e1a2b3c4d5e6f7"}' \
  | curl -s -X POST http://localhost:3000/api/cli -H "Content-Type: application/json" -d @-
# Then set the draft (to/subject auto-fill from thread):
printf '{"action":"set-draft","body":"Sounds good, thanks!"}' \
  | curl -s -X POST http://localhost:3000/api/cli -H "Content-Type: application/json" -d @-

# Reset UI
printf '{"action":"refresh"}' \
  | curl -s -X POST http://localhost:3000/api/cli -H "Content-Type: application/json" -d @-
```

### Read Emails

**GET /api/emails?folder=inbox** — List email threads (grouped conversations, not individual messages).
- `folder`: `inbox` (default), `sent`, `drafts`, `archive`
- `pageToken`: for pagination
- Returns: `{ threads: EmailThread[] }` — each thread has `id`, `subject`, `snippet`, `participants`, `messageCount`, `latestDate`, `isRead`

**GET /api/emails/{threadId}** — Get full thread with all message bodies.
- Returns: `EmailThread` with `messages[]`, each containing `from`, `to`, `cc`, `subject`, `body` (HTML), `date`

**GET /api/emails/search?q=...** — Search using Gmail search syntax.
- `q`: e.g., `from:john`, `subject:meeting`, `after:2026/03/01`, `has:attachment`, `is:unread`
- Returns: `{ emails: Email[] }` — individual messages (use `threadId` to then fetch full thread)

### Send Emails (use set-draft instead!)

**POST /api/emails/send** — Send an email directly (DO NOT use unless user explicitly asks).
```json
{
  "to": [{"name": "John", "email": "john@example.com"}],
  "cc": [{"name": "", "email": "YOUR_PRIMARY_EMAIL@example.com"}],
  "subject": "Hello",
  "body": "<p>HTML body here</p>",
  "replyToMessageId": "threadId-for-replies"
}
```

### Email Actions

**POST /api/emails/{threadId}** — Perform actions on a thread.
```json
{"action": "archive"}
{"action": "markAsRead"}
```

### Calendar

**GET /api/calendar** — Get upcoming events.
- `timeMin`: ISO 8601 start (default: now)
- `timeMax`: ISO 8601 end (default: 7 days from now)
- `q`: search query
- Returns: `{ events: CalendarEvent[] }` — each has `id`, `summary`, `start`, `end`, `location`, `attendees`

**POST /api/calendar/events** — Create a calendar event.
```json
{
  "summary": "Team Meeting",
  "start": "2026-03-17T14:00:00",
  "end": "2026-03-17T15:00:00",
  "description": "Discuss roadmap",
  "location": "Zoom",
  "attendees": [{"email": "john@example.com"}]
}
```

## Workflow Examples

### Reply to the currently open email
1. `GET /api/cli/state` — check what's open (read `openThread` and its `messages`)
2. Read `assistant_agent/profile.md` for tone/style
3. `POST /api/cli` → `set-draft` with your composed reply body

### Draft a reply to a specific email
1. `GET /api/emails?folder=inbox` — list threads
2. Find the relevant thread, note its `id`
3. `POST /api/cli` → `open-thread` with the `threadId` — opens it in browser
4. `GET /api/cli/state` — read the full thread content from `openThread.messages`
5. Read `assistant_agent/profile.md` for tone/style
6. `POST /api/cli` → `set-draft` with your composed reply body

### Compose a new email (no thread)
1. Read `assistant_agent/profile.md` for tone/style
2. `POST /api/cli` → `set-draft` with `body`, `subject`, and `to`
3. The draft appears in the browser for the user to review and send

### Search and summarize
1. `GET /api/emails/search?q=from:boyuan.chen subject:robotics`
2. For each result, `GET /api/emails/{threadId}` to read full content
3. Summarize findings to the user

### Check calendar and schedule
1. `GET /api/calendar?timeMin=2026-03-17T00:00:00&timeMax=2026-03-21T00:00:00`
2. Find free slots
3. `POST /api/calendar/events` to create the event

## UI Keyboard Shortcuts (for reference)

| Key | Action |
|-----|--------|
| `j/k` | Navigate thread list |
| `Enter` | Open selected thread |
| `Escape` | Close thread / modal |
| `e` | Archive thread |
| `r` | Reply (focuses draft box) |
| `c` | Compose new email (modal) |
| `/` | Focus search |
| `t` | Cycle theme (dark → light → system) |
| `g i/s/d/a` | Go to Inbox/Sent/Drafts/Archive |
| `?` | Show shortcut help |
