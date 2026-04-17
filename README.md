# feather

AI-powered email client with a built-in Claude terminal. Keyboard-driven, Superhuman-style UI.

> Open a terminal and run `claude`. Say *"check my unread emails"*, *"reply to John"*, *"add this to my calendar"*, or *"draft an email to Dr. Smith"*. Claude drafts in your voice and pushes everything to the UI for review.

## Setup

```bash
cd code
npm install
npx prisma generate && npx prisma db push
```

Copy and fill in your config:

```bash
cp -r user_data.example/ user_data/   # edit profile.md, contacts.md, instructions.md
cp code/.env.example code/.env.local  # add Google OAuth credentials
```

Requires: `brew install ttyd tmux`

## Run

**Browser version:**

```bash
cd code
npm run terminal   # terminal panel server
npm run dev        # Next.js on localhost:3000
```

**Desktop app (Electron):**

```bash
cd code
npm run electron:rebuild   # build standalone server (run after code changes)
npm run electron:dev       # launch the app
```

Both versions include an integrated Claude terminal panel on the right.

## Keyboard Shortcuts

`j/k` navigate | `Enter` open | `Escape` close | `e` archive | `d` done | `u` read/unread | `r` reply | `c` compose | `/` search | `t` theme | `g i/s/d/a/n` go to folder | `?` help

## Project Structure

```
feather/
  user_data/              # your private config (gitignored)
  user_data.example/      # templates for new users
  code/                   # Next.js + Electron app
    electron/             # Electron main process + onboarding
    src/                  # React UI, API routes, hooks, store
    terminal-server.mjs   # ttyd wrapper with theme support
    tmux.conf             # terminal config
  assistant_agent/        # AI assistant context (symlinks to user_data/)
  coding_agent/           # dev lessons learned
  .claude/skills/         # Claude Code skill definitions
  CLAUDE.md               # instructions for Claude Code
```

`user_data/` is gitignored. Only `user_data.example/` templates are shared.
