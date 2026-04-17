# feather

AI-powered email client with a built-in Claude terminal. Keyboard-driven, minimal UI.

> Click on any email, and Claude can read it, reply, forward, add events to your calendar, create Google Docs — all through natural language. It never sends directly — you always review first.

## Getting Started

1. Clone this repo
2. Install [Claude Code](https://claude.ai/claude-code)
3. Run `claude` in the project root
4. Tell Claude: *"help me set up feather"* — it will walk you through everything

Claude will install dependencies, set up the database, and help you configure Google OAuth credentials.

## Two Ways to Run

**Browser** — open in any browser, with hot reload for development:

```
Tell Claude: "run the browser version"
```

**Desktop App (Mac)** — standalone Electron app:

```
Tell Claude: "run the app version"
```

Both versions include an integrated Claude terminal panel on the right.

## What Can Claude Do?

Just open an email and ask:

- *"check my unread emails"*
- *"reply to this — tell them I'm available Tuesday"*
- *"forward this to my team"*
- *"add this event to my calendar"*
- *"draft an email to Dr. Smith about the paper review"*
- *"create a Google Doc with meeting notes"*
- *"search for emails from last week about the project"*

## Keyboard Shortcuts

`j/k` navigate | `Enter` open | `Escape` close | `e` archive | `d` done | `u` read/unread | `r` reply | `c` compose | `/` search | `t` theme | `g i/s/d/a/n` go to folder | `?` help

> Keyboard shortcuts require focus on the email panel. Click the email area if the terminal has focus.

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Claude Code](https://claude.ai/claude-code)
- `brew install ttyd tmux`
- A Google account (you'll create your own OAuth credentials during setup)
