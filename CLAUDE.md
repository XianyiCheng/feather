# Email Helper — Claude Code Integration

Browser-based Gmail client at `http://localhost:3000`. Controls Gmail and Google Calendar via local API.

**Start dev server:** `cd /Users/xianyi/ai_projects/email_helper/code && npm run dev`

## Skills (auto-loaded when relevant)

- **`email-assistant`** — drafting rules, workflow, curl syntax, critical rules. Reads `assistant_agent/profile.md` for identity/tone.
- **`contacts`** — looks up email addresses. Reads `assistant_agent/contacts.md`.
- **`coding-lessons`** — dev gotchas and fixes. Read before making code changes.

## Key Rules

- **Keep answers concise** — short and direct, no unnecessary explanation.

- **NEVER send emails directly** — use `set-draft`. User reviews and clicks Send.
- **Always CC YOUR_PRIMARY_EMAIL@example.com** on all outgoing email.
- **Before code changes:** the `coding-lessons` skill has documented fixes — use it.
- **Summarize new takeaways** into `assistant_agent/` or `coding_agent/` when something genuinely reusable is discovered.

## API Reference

All endpoints at `http://localhost:3000`.

- **`/api/cli` and `/api/cli/state`** — no auth required
- **All email/calendar endpoints** — require a session cookie:
  ```bash
  TOKEN=$(sqlite3 /Users/xianyi/ai_projects/email_helper/code/prisma/dev.db \
    "SELECT sessionToken FROM Session ORDER BY expires DESC LIMIT 1;")
  # Use with: curl -s -b "authjs.session-token=$TOKEN" http://localhost:3000/api/...
  ```

### Browser State & Control

**GET /api/cli/state** — current open thread, active folder, draft state.
- `openThread` is `null` if no thread is open. Check this first for "this email" questions.

**POST /api/cli** — push commands to browser:
| Action | Required params | Effect |
|--------|----------------|--------|
| `set-draft` | `body` | Put text in draft reply box |
| `open-thread` | `threadId` | Open thread in viewer |
| `move-to-done` | `threadId` | Move to Done label |
| `refresh` | — | Reset UI |
| `set-theme` | `theme` | `"dark"` \| `"light"` \| `"system"` |

Optional `set-draft` params: `subject`, `to`, `cc`, `bcc`, `attachments`

### Email Endpoints

**GET /api/emails?folder=inbox** — list threads (`inbox`, `sent`, `drafts`, `archive`, `done`)
**GET /api/emails/{threadId}** — full thread with message bodies
**GET /api/emails/search?q=...** — Gmail search syntax (`from:x`, `subject:y`, `has:attachment`)
**POST /api/emails/{threadId}** — actions: `archive`, `markAsRead`, `moveToDone`, `moveToInbox`
**POST /api/emails/send** — direct send (DO NOT USE — use `set-draft` instead)

### Calendar Endpoints

**GET /api/calendar** — upcoming events (`timeMin`, `timeMax`, `q` params)
**POST /api/calendar/events** — create event (`summary`, `start`, `end`, `location`, `attendees`)
**PATCH /api/calendar/events/{eventId}** — update event
**DELETE /api/calendar/events/{eventId}** — delete event

### Drafts

**GET /api/drafts/thread?threadId=...** — find draft for a thread
**DELETE /api/drafts?draftId=...** — delete a draft

## CLI State Response Shape

```json
{
  "openThread": {
    "id": "...", "subject": "...", "messageCount": 3,
    "messages": [{"from": {}, "to": [], "cc": [], "body": "<html>", "date": "..."}]
  },
  "activeFolder": "inbox",
  "draft": {"to": "", "subject": "", "body": ""}
}
```

## Keyboard Shortcuts (reference)

`j/k` navigate · `Enter` open · `Escape` close · `e` archive · `d` done · `r` reply · `c` compose · `/` search · `t` theme · `g i/s/d/a/n` go to folder · `?` help
