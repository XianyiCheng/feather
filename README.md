# Email Helper

A browser-based Gmail client with an integrated AI assistant, built for a keyboard-driven, [Superhuman](https://superhuman.com)-style email workflow. Powered by [Claude Code](https://claude.ai/claude-code).

![Stack](https://img.shields.io/badge/Next.js_16-black?logo=next.js) ![React](https://img.shields.io/badge/React_19-blue?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white) ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)

> **Best with [Claude Code](https://claude.ai/claude-code):** Open a terminal in this project and run `claude`. Then just say *"check my unread emails"*, *"reply to John's email"*, *"add this to my calendar"*, or *"create a Google Doc for the meeting notes"*. Claude reads your inbox, drafts emails in your voice, manages your calendar, and pushes everything to the browser for you to review. See [Using with Claude Code](#using-with-claude-code) for more.

## What is this?

Email Helper is a local-first email client that connects to your Gmail account and gives you:

- **Keyboard-driven inbox** -- navigate with `j`/`k`, open with `Enter`, archive with `e`, reply with `r`, compose with `c`, and more
- **AI assistant via Claude Code** -- draft replies, triage your inbox, search emails, manage calendar, create Google Docs -- all through natural language in the terminal
- **CLI-to-browser bridge** -- Claude Code pushes drafts, opens threads, and controls the UI in real-time through a local API
- **Gmail drafts integration** -- drafts sync to Gmail so you can review and send from the browser. The AI never sends directly
- **Google Calendar** -- create, update, and delete events through the API or by asking the AI
- **Dark/light theme** -- toggleable with `t`, follows system preference by default
- **File attachments** -- upload files from your computer or forward emails with their original attachments

## Architecture

```
You (browser)          Claude Code (terminal)
     |                        |
     |   localhost:3000       |
     +--------+---------------+
              |
         Next.js App
              |
     +--------+--------+
     |        |        |
   Gmail    Calendar  Google
    API      API      Docs API
```

The app runs locally on `localhost:3000`. The browser shows your inbox, and Claude Code talks to the same app through REST APIs and a CLI event bus (SSE + polling). When Claude drafts an email, it appears in your compose box instantly -- you review and click Send.

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| State | Zustand |
| Data fetching | SWR |
| Auth | NextAuth v5 (Google OAuth) |
| Database | SQLite (Prisma + better-sqlite3) |
| Email | Gmail API (googleapis) |
| Calendar | Google Calendar API |
| AI | Claude Code (CLI) |

## Getting Started

### Prerequisites

- Node.js 18+
- A Google Cloud project with OAuth 2.0 credentials
- Gmail API, Google Calendar API, and Google Docs API enabled
- [Claude Code](https://claude.ai/claude-code) installed (for the AI assistant features)

### 1. Clone and install

```bash
git clone https://github.com/XianyiCheng/email_helper.git
cd email_helper/code
npm install
```

### 2. Set up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use an existing one)
3. Enable the **Gmail API**, **Google Calendar API**, and **Google Docs API**
4. Create **OAuth 2.0 Client ID** credentials (Web application type)
5. Add `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI
6. Copy the Client ID and Client Secret

### 3. Set up your user data (private)

The `user_data/` folder holds your personal configuration. It is **gitignored** and never shared. Copy the templates and fill in your info:

```bash
cp -r user_data.example/ user_data/
```

Then edit:
- **`user_data/profile.md`** -- your name, role, email tone/style preferences
- **`user_data/contacts.md`** -- your contacts (names and email addresses)
- **`user_data/instructions.md`** -- rules for the AI (drafting style, calendar preferences, etc.)

If you want Google Docs integration, also place your `client_secret.json` in `user_data/`.

### 4. Configure environment

```bash
cp .env.example .env.local  # or create .env.local manually
```

Add to `.env.local`:

```env
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="run: openssl rand -base64 32"
```

### 5. Set up the database

```bash
npx prisma generate
npx prisma db push
```

### 6. Run

```bash
npm run dev
```

Open `http://localhost:3000` and sign in with Google.

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `j` / `k` | Navigate down / up |
| `Enter` | Open thread |
| `Escape` | Close thread |
| `e` | Archive |
| `d` | Move to Done / back to Inbox |
| `u` | Toggle read / unread |
| `r` | Reply |
| `c` | Compose new email |
| `/` | Focus search |
| `t` | Cycle theme (dark / light / system) |
| `g i` | Go to Inbox |
| `g s` | Go to Sent |
| `g d` | Go to Drafts |
| `g a` | Go to Archive |
| `g n` | Go to Done |
| `?` | Show shortcut help |
| `Cmd+Enter` | Send |

## Using with Claude Code

The real power of Email Helper comes from pairing it with Claude Code. Open a terminal in the project directory and run `claude`. Then you can say things like:

- *"Check my unread emails and tell me what needs my attention"*
- *"Reply to John's email -- tell him I'm available next Tuesday at 2pm"*
- *"Forward this to my lab students"*
- *"Add this event to my calendar"*
- *"Draft an email to Dr. Smith about the paper review"*
- *"Create a Google Doc with an employer letter for a visiting scholar"*
- *"Search for emails from last week about the robotics seminar"*

Claude reads the `CLAUDE.md` file and skill files in `.claude/skills/` to understand the project's APIs and conventions. It uses the CLI bridge to push drafts into your browser and read what thread you have open.

### How the AI-browser bridge works

```
Claude Code                          Browser
    |                                   |
    |  POST /api/cli {set-draft}        |
    +---------------------------------->|  Draft appears in compose box
    |                                   |
    |  GET /api/cli/state               |
    |<----------------------------------+  Returns open thread, folder, etc.
    |                                   |
    |  GET /api/emails/{threadId}       |
    |<----------------------------------+  Full thread content
    |                                   |
    |  POST /api/drafts                 |
    +---------------------------------->|  Saved to Gmail drafts
```

## API Reference

All endpoints at `http://localhost:3000`. Email/calendar/draft endpoints require authentication (session cookie). CLI endpoints (`/api/cli`, `/api/cli/state`) have no auth requirement.

### CLI Bridge
- `GET /api/cli/state` -- current open thread, active folder, draft state
- `POST /api/cli` -- push commands: `set-draft`, `move-to-done`, `refresh`, `set-theme`

### Emails
- `GET /api/emails?folder=inbox` -- list threads (inbox, sent, drafts, archive, done, promotions)
- `GET /api/emails/{threadId}` -- full thread with message bodies
- `GET /api/emails/search?q=...` -- Gmail search syntax
- `POST /api/emails/{threadId}` -- actions: archive, markAsRead, moveToDone, moveToInbox
- `POST /api/emails/{messageId}/forward` -- forward with attachments
- `POST /api/emails/send` -- send email

### Drafts
- `POST /api/drafts` -- create Gmail draft
- `GET /api/drafts/thread?threadId=...` -- find draft for a thread
- `DELETE /api/drafts?draftId=...` -- delete draft

### Calendar
- `GET /api/calendar` -- upcoming events
- `POST /api/calendar/events` -- create event
- `PATCH /api/calendar/events/{eventId}` -- update event
- `DELETE /api/calendar/events/{eventId}` -- delete event

## Project Structure

```
email_helper/
  user_data/              # YOUR private data (gitignored, never committed)
    profile.md            #   Name, role, email style
    contacts.md           #   Contact list
    instructions.md       #   AI behavior rules
    client_secret.json    #   Google OAuth credentials
    token.json            #   Google API token (auto-generated)
  user_data.example/      # Templates for new users (committed)
  assistant_agent/        # AI assistant scripts + symlinks to user_data/
  coding_agent/           # Dev lessons learned, coding gotchas
  .claude/skills/         # Claude Code skill definitions
  CLAUDE.md               # Project instructions for Claude Code
  code/                   # Next.js application
    src/
      app/api/            # API routes (emails, calendar, drafts, CLI bridge)
      components/         # React components (inbox, email view, compose, layout)
      hooks/              # SWR hooks, keyboard shortcuts, CLI events
      store/              # Zustand state management
      lib/                # Gmail client, auth, types, event bus
    prisma/               # Database schema and SQLite DB
```

> **Privacy note:** `user_data/` contains your personal information (name, contacts, email addresses, OAuth tokens). It is gitignored and must never be committed. Only `user_data.example/` templates are shared in the repo.

## License

MIT
