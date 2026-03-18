# Assistant Agent Skills

> **Note:** This file is the original reference. Its content has been migrated to project Claude Code skills at `.claude/skills/` (email-assistant, contacts, coding-lessons). Those skills are auto-loaded when relevant. Keep this file as a detailed backup / extended reference.

Step-by-step procedures for common tasks.

---

## Common Patterns

### Session Token
Required for all email/calendar API calls. Get it once per script:
```bash
TOKEN=$(sqlite3 /Users/xianyi/ai_projects/email_helper/code/prisma/dev.db "SELECT sessionToken FROM Session ORDER BY expires DESC LIMIT 1;")
```

### CLI Action (set-draft, open-thread, etc.)
Always use `python3 -c` with `json.dumps` — never raw bash string interpolation (special characters break escaping).
```python
python3 -c "
import subprocess, json
payload = json.dumps({'action': 'ACTION', 'key': 'value'})
subprocess.run(['curl', '-s', '-X', 'POST', 'http://localhost:3000/api/cli',
    '-H', 'Content-Type: application/json', '-d', payload], capture_output=True, text=True)
"
```

---

## Skill 1: Reply to the Currently Open Email

1. `GET /api/cli/state` — confirm a thread is open and read its content.
2. Compose reply (see `profile.md` for tone/style).
3. Send draft:
```python
payload = json.dumps({'action': 'set-draft', 'body': body})
```

---

## Skill 2: Reply to a Specific Email (not currently open)

1. Search for the thread (see Skill 5).
2. Open it in the browser:
```python
payload = json.dumps({'action': 'open-thread', 'threadId': 'THREAD_ID'})
```
3. **Verify the correct thread is open — never skip:**
```bash
curl -s http://localhost:3000/api/cli/state | python3 -c "import sys,json; d=json.load(sys.stdin); t=d['openThread']; print(t['id'], t['subject'])"
```
4. Confirm `id` and `subject` match, then set the draft (Skill 1, step 3).

---

## Skill 3: Forward an Email

1. Get the thread via `GET /api/cli/state` or by ID (see Skill 5).
2. Set draft with `to`, `subject` prefixed `Fwd: `, and forwarded body:
```python
body = 'FYI\n\n---------- Forwarded message ----------\nFrom: SENDER\nSubject: SUBJECT\n\nORIGINAL BODY'
payload = json.dumps({'action': 'set-draft', 'to': 'recipient@example.com', 'subject': 'Fwd: SUBJECT', 'body': body})
```

---

## Skill 4: Compose a New Email

1. Look up recipient in `contacts.md` if needed.
2. Set draft with `to`, `subject`, and `body`:
```python
body = 'Hi NAME,\n\nMESSAGE\n\nBest,\nXianyi'
payload = json.dumps({'action': 'set-draft', 'to': 'recipient@example.com', 'subject': 'SUBJECT', 'body': body})
```

---

## Skill 5: Search & Browse Emails

```bash
TOKEN=...  # see Common Patterns

# Search (Gmail syntax: from:name, subject:topic, is:unread, after:2026/03/01, has:attachment)
curl -s -b "authjs.session-token=$TOKEN" "http://localhost:3000/api/emails/search?q=QUERY"

# List a folder (inbox, sent, drafts, archive, done)
curl -s -b "authjs.session-token=$TOKEN" "http://localhost:3000/api/emails?folder=inbox"

# Fetch full thread with message bodies
curl -s -b "authjs.session-token=$TOKEN" "http://localhost:3000/api/emails/THREAD_ID"
```

---

## Skill 6: Calendar

Always append `Z` to timestamps.

```bash
TOKEN=...  # see Common Patterns

# View events
curl -s -b "authjs.session-token=$TOKEN" \
  "http://localhost:3000/api/calendar?timeMin=2026-03-17T00:00:00Z&timeMax=2026-03-21T23:59:59Z"

# Create event
curl -s -b "authjs.session-token=$TOKEN" -X POST "http://localhost:3000/api/calendar/events" \
  -H "Content-Type: application/json" \
  -d '{"summary":"Meeting Title","start":"2026-03-20T14:00:00Z","end":"2026-03-20T14:30:00Z","attendees":[{"email":"person@duke.edu"}]}'

# Accept / decline invite (values: accepted, declined, tentative)
curl -s -b "authjs.session-token=$TOKEN" -X PATCH "http://localhost:3000/api/calendar/events/EVENT_ID" \
  -H "Content-Type: application/json" \
  -d '{"attendeeResponse":"accepted"}'
```

---

## Skill 7: Move Email to Done

```bash
TOKEN=...  # see Common Patterns
curl -s -b "authjs.session-token=$TOKEN" -X POST "http://localhost:3000/api/emails/THREAD_ID" \
  -H "Content-Type: application/json" \
  -d '{"action":"moveToDone"}'
```
To move back: `{"action":"moveToInbox"}`.

---

## Skill 8: Google Docs (Read & Write)

**Setup** — uses its own OAuth, independent of the email app.

Files:
- `assistant_agent/client_secret.json` — OAuth credentials
- `assistant_agent/token.json` — saved token (auto-refreshes; **do not commit to git**)

Packages (install once): `pip3 install google-auth google-auth-oauthlib google-api-python-client`

### Auth & Token

Writing requires `drive` + `documents` scopes. If the token is missing or read-only, re-authorize (opens browser once):
```python
import os
from google_auth_oauthlib.flow import InstalledAppFlow
TOKEN = '/Users/xianyi/ai_projects/email_helper/assistant_agent/token.json'
CREDS = '/Users/xianyi/ai_projects/email_helper/assistant_agent/client_secret.json'
if os.path.exists(TOKEN): os.remove(TOKEN)
flow = InstalledAppFlow.from_client_secrets_file(CREDS,
    ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/documents'])
open(TOKEN, 'w').write(flow.run_local_server(port=0).to_json())
```

### Load Credentials (boilerplate for all operations)
```python
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from googleapiclient.discovery import build

creds = Credentials.from_authorized_user_file('/Users/xianyi/ai_projects/email_helper/assistant_agent/token.json')
if creds.expired and creds.refresh_token:
    creds.refresh(Request())
service = build('docs', 'v1', credentials=creds)
```
Get the Doc ID from its URL: `https://docs.google.com/document/d/DOC_ID/edit`

### Read a Doc
Plain text (simplest):
```python
drive = build('drive', 'v3', credentials=creds)
text = drive.files().export(fileId='DOC_ID', mimeType='text/plain').execute().decode('utf-8')
```
Structured (Docs API — parse `doc['body']['content']` → paragraphs → `textRun.content`):
```python
doc = service.documents().get(documentId='DOC_ID').execute()
```

### Clear All Content
```python
doc = service.documents().get(documentId='DOC_ID').execute()
end = doc['body']['content'][-1]['endIndex']
if end > 2:
    service.documents().batchUpdate(documentId='DOC_ID', body={'requests': [
        {'deleteContentRange': {'range': {'startIndex': 1, 'endIndex': end - 1}}}
    ]}).execute()
```

### Write & Format — Full Workflow
1. Clear existing content (above).
2. Define segments as `(text, paragraph_style, bold)` tuples.
   Paragraph styles: `TITLE`, `HEADING_1`, `HEADING_2`, `NORMAL_TEXT`.
3. Insert all text in one call:
```python
full_text = ''.join(s[0] for s in segments)
service.documents().batchUpdate(documentId='DOC_ID', body={'requests': [
    {'insertText': {'location': {'index': 1}, 'text': full_text}}
]}).execute()
```
4. Walk segments, track character positions, build style requests, then send all at once:
```python
style_requests = []
idx = 1
for text, para_style, bold in segments:
    end = idx + len(text)
    if para_style != 'NORMAL_TEXT':
        style_requests.append({'updateParagraphStyle': {
            'range': {'startIndex': idx, 'endIndex': end},
            'paragraphStyle': {'namedStyleType': para_style},
            'fields': 'namedStyleType'
        }})
    if bold:
        style_requests.append({'updateTextStyle': {
            'range': {'startIndex': idx, 'endIndex': end - 1},  # exclude trailing \n
            'textStyle': {'bold': True}, 'fields': 'bold'
        }})
    idx = end
service.documents().batchUpdate(documentId='DOC_ID', body={'requests': style_requests}).execute()
```

**Gotchas:**
- Insert all text first — styles reference indices that only exist after insertion.
- Exclude trailing `\n` from bold/italic ranges (styling the newline causes unexpected paragraph formatting).
- Send all style requests in one `batchUpdate` — interleaving inserts and styles shifts indices.

---

## Key Rules

- **CLI calls**: always use `python3 -c` with `json.dumps` — never raw bash string interpolation.
- **After `open-thread`**: always verify with `GET /api/cli/state` before calling `set-draft`.
- **Calendar timestamps**: always append `Z`.
- **Never send email directly**: always use `set-draft`; never call `/api/emails/send`.
- **Session token**: required for all email/calendar endpoints; get from SQLite (see Common Patterns).
- **Google Docs**: always format with headings and styles — never plain text.
