# feather — Claude Code Integration

Gmail client with integrated Claude terminal. Two run modes:

**Browser:** `cd code && npm run terminal & npm run dev` → `http://localhost:3000`
**Desktop app:** `cd code && npm run electron:dev` (uses standalone server on port 3100; run `npm run electron:rebuild` after code changes)

## User Data (Private — Not in Git)

All user-specific files live in `user_data/`. This folder is gitignored and **must never be committed**. It contains:

| File | Purpose |
|------|---------|
| `profile.md` | Your name, role, email style, tone preferences |
| `contacts.md` | Contact list (names, emails, roles) for address lookup |
| `instructions.md` | AI behavior rules, email drafting preferences, calendar rules |
| `client_secret.json` | Google OAuth credentials |
| `token.json` | Google API token (auto-generated) |

**First-time setup:** Copy from `user_data.example/` and fill in your info:
```bash
cp -r user_data.example/ user_data/
# Edit profile.md, contacts.md, instructions.md with your info
# Add your Google OAuth client_secret.json
```

Symlinks in `assistant_agent/` point to `user_data/` so all existing code paths work.

## Skills (auto-loaded when relevant)

- **`email-assistant`** — drafting rules, workflow, critical rules. Reads `user_data/profile.md` for identity/tone.
- **`contacts`** — looks up email addresses. Reads `user_data/contacts.md`.
- **`coding-lessons`** — dev gotchas and fixes. Read before making code changes.

## MANDATORY: Read Before Acting

**You MUST complete these reads before doing anything else. No exceptions.**

- **Before drafting/sending ANY email:** read `user_data/instructions.md` (via `assistant_agent/instructions.md`), then load the `email-assistant` skill.
- **Before making ANY code change:** load the `coding-lessons` skill and read it fully. It contains documented gotchas and fixes that prevent repeat mistakes.
- **Before ANY task:** scan your memory files in `your Claude Code memory files (MEMORY.md)` for relevant feedback.

Skipping these reads has repeatedly caused wasted round-trips rediscovering known solutions. This is the single most important rule.

## Key Rules

- **Trace the full pipeline before coding** — when a change spans API → data → UI, read all relevant layers first. Verify the data is actually available at each layer before writing code. Don't add UI for a field without confirming the data source provides it.
- **Verify results after creating** — after creating a draft, event, or any resource, fetch it back to confirm it's correct. Don't trust creation responses alone.
- **Keep answers concise** — short and direct, no unnecessary explanation.
- **NEVER use `/api/emails/send`** — user must always review and click Send themselves.
- **Always CC the user's primary email** (from `user_data/profile.md`) on all outgoing email.
- **Use python3 subprocess for API calls** — never use `curl -d "$(python3 -c "...")"`. The nested quoting always breaks. Use the python3 + `subprocess.run(['curl', ...])` pattern.
- **Summarize new takeaways** into `assistant_agent/` or `coding_agent/` when something genuinely reusable is discovered.
- **Never commit `user_data/`** — it contains private information (emails, contacts, OAuth tokens). Only `user_data.example/` templates belong in git.

## API Reference

**Port selection:** There are two possible servers — browser dev (`3000`) and Electron standalone (`3100`). Before any CLI call (`/api/cli`, `/api/cli/state`), detect which is active and use that port. Don't hardcode 3000.

```bash
# Pick the active port — whichever responds to /api/cli/state
for P in 3100 3000; do
  if curl -s -f -m 1 "http://localhost:$P/api/cli/state" >/dev/null; then PORT=$P; break; fi
done
```

Email/calendar/drafts endpoints can typically run on either port (both share the same Session DB); use the same active port for consistency.

- **`/api/cli` and `/api/cli/state`** — no auth required
- **All email/calendar/drafts endpoints** — require a session cookie:
  ```bash
  TOKEN=$(sqlite3 code/prisma/dev.db \
    "SELECT sessionToken FROM Session ORDER BY expires DESC LIMIT 1;")
  # Use with: curl -s -b "authjs.session-token=$TOKEN" http://localhost:3000/api/...
  ```

### Browser State & Control

**GET /api/cli/state** — current open thread, active folder, draft state.

**POST /api/cli** — push commands to browser:
| Action | Required params | Effect |
|--------|----------------|--------|
| `set-draft` | `body` | Put text in draft reply box |
| `move-to-done` | `threadId` | Move to Done label |
| `refresh` | — | Reset UI |
| `set-theme` | `theme` | `"dark"` \| `"light"` \| `"system"` |

### Email Endpoints

**GET /api/emails?folder=inbox** — list threads (`inbox`, `sent`, `drafts`, `archive`, `done`)
**GET /api/emails/{threadId}** — full thread with message bodies
**GET /api/emails/search?q=...** — Gmail search syntax, searches all mail
**POST /api/emails/{threadId}** — actions: `archive`, `markAsRead`, `moveToDone`, `moveToInbox`
**POST /api/emails/{messageId}/forward** — forward with attachments (`to`, `cc?`, `bcc?`, `body?`). Auto-includes source message's attachments.

### Drafts

**POST /api/drafts** — create a Gmail draft (`to`, `cc`, `subject`, `body`, `threadId?`)
**GET /api/drafts/thread?threadId=...** — find draft for a thread
**DELETE /api/drafts?draftId=...** — delete a draft

### Calendar Endpoints

**GET /api/calendar** — upcoming events (`timeMin`, `timeMax`, `q` params)
**POST /api/calendar/events** — create event (`summary`, `start`, `end`, `location`, `attendees`)
**PATCH /api/calendar/events/{eventId}** — update event
**DELETE /api/calendar/events/{eventId}** — delete event

## Keyboard Shortcuts (reference)

`j/k` navigate · `Enter` open · `Escape` close · `e` archive · `d` done · `r` reply · `c` compose · `/` search · `t` theme · `g i/s/d/a/n` go to folder · `?` help
