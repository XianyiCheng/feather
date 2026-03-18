---
name: email-assistant
description: Use this skill whenever helping draft, reply to, forward, or compose emails. Triggers on any email-related task — "reply to this", "draft an email", "email John", "help me respond", "summarize this email", "add to my calendar", "schedule a meeting", or when the user asks about the current email open in the browser.
---

# Email Assistant

Read `assistant_agent/profile.md` for the user's identity, email tone, and drafting rules.

## Core Workflow

**Reply to current email:**
1. `GET /api/cli/state` — read `openThread` and its `messages`
2. Compose reply using style from `assistant_agent/profile.md`
3. `POST /api/cli` → `set-draft` with the body

**Reply to a specific thread:**
1. `GET /api/emails?folder=inbox` — find the thread, note its `id`
2. `POST /api/cli` → `open-thread` with the `threadId`
3. `GET /api/cli/state` — verify the thread is open
4. `POST /api/cli` → `set-draft` with the reply

**New email (no thread):**
1. Look up recipient in `assistant_agent/contacts.md` if needed
2. `POST /api/cli` → `set-draft` with `body`, `subject`, and `to`

## set-draft curl Syntax
```bash
printf '{"action":"set-draft","body":"Hello\\nWorld","subject":"Hi","to":"x@y.com"}' \
  | curl -s -X POST http://localhost:3000/api/cli -H "Content-Type: application/json" -d @-
```
Use `printf` with double-escaped `\\n` — never `curl -d '...\n...'` (literal `\n` breaks JSON parsing).

## Critical Rules
- **NEVER use `/api/emails/send`** — always `set-draft` so user reviews before sending
- **Always CC YOUR_PRIMARY_EMAIL@example.com** on all outgoing email
- **open-thread → verify state → set-draft** — never skip the `GET /api/cli/state` verification step
- Clicking a folder clears the draft box — warn the user if there's an unsaved draft

## Session Token (for direct curl calls to email/calendar endpoints)
```bash
TOKEN=$(sqlite3 /Users/xianyi/ai_projects/email_helper/code/prisma/dev.db \
  "SELECT sessionToken FROM Session ORDER BY expires DESC LIMIT 1;")
curl -s -b "authjs.session-token=$TOKEN" http://localhost:3000/api/emails?folder=inbox
```
`/api/cli` and `/api/cli/state` need no auth. All email/calendar endpoints do.

## Complex CLI Payloads
For payloads with apostrophes or nested objects, use `python3 -c` with `json.dumps`:
```python
python3 -c "
import subprocess, json
payload = json.dumps({'action': 'set-draft', 'body': body, 'subject': subj})
subprocess.run(['curl','-s','-X','POST','http://localhost:3000/api/cli',
    '-H','Content-Type: application/json','-d',payload], capture_output=True, text=True)
"
```

## Calendar
Check calendar before suggesting times: `GET /api/calendar`. Default: 30-minute meetings, 9am–5pm ET.
**Always append `Z` to timestamps** (e.g. `"2026-03-20T14:00:00Z"`).

## Reading PDFs
Run `python3 /Users/xianyi/ai_projects/email_helper/code/pdf2txt.py` to convert PDFs to `.txt`, then read the `.txt`.

## Google Docs

**Credentials:** `assistant_agent/client_secret.json` + `assistant_agent/token.json` (auto-refreshes).

**Read a doc:**
```python
python3 /Users/xianyi/ai_projects/email_helper/assistant_agent/read_doc.py DOC_ID
```
Extract Doc ID from URL: `https://docs.google.com/document/d/DOC_ID/edit`

**If body appears empty, use Drive export instead:**
```python
python3 -c "
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
creds = Credentials.from_authorized_user_file('assistant_agent/token.json')
if creds.expired: creds.refresh(Request())
drive = build('drive', 'v3', credentials=creds)
data = drive.files().export(fileId='DOC_ID', mimeType='text/plain').execute()
print(data.decode('utf-8'))
"
```

**Write / format a doc** (token already has `drive` + `documents` scopes):
1. Insert all text first in one `insertText` call, then apply styles in a separate `batchUpdate`
2. Use `updateParagraphStyle` for headings (`TITLE`, `HEADING_1`, `HEADING_2`, `NORMAL_TEXT`)
3. Use `updateTextStyle` for bold/italic — exclude trailing `\n` from the range
4. Send all style requests in one `batchUpdate` — never interleave inserts and styles (index drift)
5. **Always format** — never insert plain unformatted text into a Google Doc

**Create a new doc and share:**
```python
doc = docs.documents().create(body={'title': 'Title'}).execute()
drive.permissions().create(fileId=doc['documentId'], body={'role': 'reader', 'type': 'anyone'}).execute()
print(f"https://docs.google.com/document/d/{doc['documentId']}/edit")
```
