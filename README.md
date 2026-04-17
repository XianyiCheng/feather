# feather

AI-powered email client with a built-in Claude terminal. Keyboard-driven, Superhuman-style UI.

> Run `claude` in the integrated terminal panel. Say *"check my unread emails"*, *"reply to John"*, *"add this to my calendar"*, or *"draft an email to Dr. Smith"*. Claude reads the currently open email, drafts in your voice, and pushes everything to the UI for review. It never sends directly — you always review first.

## Setup

```bash
cd code
npm install
npx prisma generate && npx prisma db push --url "file:$(pwd)/prisma/dev.db"
```

Copy and fill in your config:

```bash
cp -r user_data.example/ user_data/   # edit profile.md, contacts.md, instructions.md
cp code/.env.example code/.env.local  # add Google OAuth credentials
```

Requires: `brew install ttyd tmux`

## Run

**Browser version** (with hot reload):

```bash
cd code
npm run terminal   # terminal panel server
npm run dev        # Next.js on localhost:3000
```

**Desktop app** (Electron, standalone):

```bash
cd code
npm run electron:rebuild   # build standalone server (run after code changes)
npm run electron:dev       # launch the app
```

Both versions have an integrated Claude terminal panel on the right. Click on any email, and Claude can read it, reply, forward, add events to your calendar, create Google Docs, and more — all through natural language.

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `j` / `k` | Navigate up / down |
| `Enter` | Open thread |
| `Escape` | Close thread |
| `e` | Archive |
| `d` | Done / back to inbox |
| `u` | Toggle read / unread |
| `r` | Reply |
| `c` | Compose |
| `/` | Search |
| `t` | Cycle theme |
| `g i/s/d/a/n` | Go to folder |
| `?` | Help |

> **Note:** Keyboard shortcuts require focus on the email panel. Click on the email area first if the terminal has focus.

## Project Structure

```
feather/
  user_data/              # your private config (gitignored)
  user_data.example/      # templates for new users
  code/                   # Next.js + Electron app
    electron/             # desktop app (main process, onboarding, icon)
    src/                  # React UI, API routes, hooks, store
    terminal-server.mjs   # ttyd wrapper with theme support
    tmux.conf             # terminal panel config
  assistant_agent/        # AI assistant context (symlinks to user_data/)
  coding_agent/           # dev lessons learned
  .claude/skills/         # Claude Code skill definitions
  CLAUDE.md               # instructions for Claude Code
```

`user_data/` is gitignored — only `user_data.example/` templates are shared.
