"use client";

import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { useAppStore } from "@/store";
import { useThreadDetail } from "@/hooks/useEmails";
import type { Attachment, Email } from "@/lib/email/types";

export function ThreadView() {
  const openThread = useAppStore((s) => s.openThread);
  const setOpenThread = useAppStore((s) => s.setOpenThread);
  const setDraft = useAppStore((s) => s.setDraft);

  const { thread: fullThread } = useThreadDetail(openThread?.id || null);

  const thread = fullThread || openThread;

  function handleForward() {
    if (!thread) return;
    const msg = thread.messages[thread.messages.length - 1];
    const date = new Date(msg.date).toLocaleString([], { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
    const bodyText = msg.body
      ? msg.body.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]*>/g, "").replace(/\n{3,}/g, "\n\n").trim()
      : msg.snippet || "";
    const fwdBody =
      `\n\n---------- Forwarded message ---------\n` +
      `From: ${msg.from.name ? `${msg.from.name} <${msg.from.email}>` : msg.from.email}\n` +
      `Date: ${date}\n` +
      `Subject: ${msg.subject || thread.subject}\n` +
      `To: ${msg.to.map((a) => a.name ? `${a.name} <${a.email}>` : a.email).join(", ")}\n\n` +
      bodyText;
    setDraft({ subject: `Fwd: ${thread.subject}`, to: "", body: fwdBody });
  }

  // Mark thread as read and update list styling
  useEffect(() => {
    if (thread && !thread.isRead) {
      fetch(`/api/emails/${thread.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "markAsRead" }),
      }).catch(console.error);
      // Update the thread list so the bold/unread styling clears immediately
      const threads = useAppStore.getState().threads;
      useAppStore.setState({
        openThread: { ...thread, isRead: true },
        threads: threads.map((t) =>
          t.id === thread.id ? { ...t, isRead: true } : t
        ),
      });
    }
  }, [thread?.id, thread?.isRead]);

  // Update the open thread data when full content loads (without resetting draft)
  useEffect(() => {
    if (fullThread) {
      useAppStore.setState({ openThread: fullThread });
    }
  }, [fullThread]);

  if (!thread) return null;

  const latest = thread.messages[thread.messages.length - 1];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-white">
              {thread.subject}
            </h2>
            <div className="text-xs text-gray-500 mt-1">
              {thread.messageCount} message{thread.messageCount !== 1 ? "s" : ""} ·{" "}
              {thread.participants.slice(0, 4).map((p) => p.name || p.email).join(", ")}
              {thread.participants.length > 4 && ` +${thread.participants.length - 4}`}
            </div>
          </div>
          <button
            onClick={handleForward}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-md transition-colors flex-shrink-0"
            title="Forward"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Forward
          </button>
        </div>
      </div>

      {/* Messages (exclude drafts) */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {thread.messages
          .filter((msg) => !msg.labels?.includes("DRAFT"))
          .map((msg, i, filtered) => (
          <MessageCard
            key={msg.id}
            message={msg}
            isLatest={i === filtered.length - 1}
            hasBody={!!fullThread}
          />
        ))}
      </div>
    </div>
  );
}

function MessageCard({
  message,
  isLatest,
  hasBody,
}: {
  message: Email;
  isLatest: boolean;
  hasBody: boolean;
}) {
  const setDraft = useAppStore((s) => s.setDraft);
  const [collapsed, setCollapsed] = useState(false);

  function handleReplyToMessage() {
    setDraft({
      to: message.from.email,
      subject: `Re: ${useAppStore.getState().openThread?.subject || message.subject}`,
      body: "",
    });
    setTimeout(() => document.getElementById("draft-body")?.focus(), 50);
  }

  function formatDate(dateStr: string): string {
    try {
      const date = new Date(dateStr);
      return date.toLocaleString([], {
        month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  }

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="w-full text-left px-4 py-3 border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-medium text-gray-300 truncate">
              {message.from.name || message.from.email}
            </span>
            <span className="text-xs text-gray-600 truncate">
              {message.snippet}
            </span>
          </div>
          <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
            {formatDate(message.date)}
          </span>
        </div>
      </button>
    );
  }

  return (
    <div className="border-b border-gray-800/50">
      {/* Message header */}
      <button
        onClick={() => !isLatest && setCollapsed(true)}
        className={`w-full text-left px-4 py-3 ${!isLatest ? "hover:bg-gray-800/30 cursor-pointer" : ""}`}
      >
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-sm font-medium text-gray-200">
              {message.from.name || message.from.email}
            </span>
            <span className="text-xs text-gray-600 ml-2">
              &lt;{message.from.email}&gt;
            </span>
          </div>
          <span className="text-xs text-gray-500 flex-shrink-0">
            {formatDate(message.date)}
          </span>
        </div>
        <div className="text-xs text-gray-500 mt-0.5">
          To: {message.to.map((a) => a.email).join(", ")}
          {message.cc.length > 0 && <span> · Cc: {message.cc.map((a) => a.email).join(", ")}</span>}
        </div>
      </button>

      {/* Reply to this message */}
      <div className="px-4 -mt-1 mb-1">
        <button
          onClick={(e) => { e.stopPropagation(); handleReplyToMessage(); }}
          className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded px-1.5 py-0.5 transition-colors"
          title={`Reply to ${message.from.name || message.from.email}`}
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
          Reply
        </button>
      </div>

      {/* Message body */}
      <div className="px-4 pb-4">
        {hasBody && message.body ? (
          <EmailBody html={message.body} />
        ) : (
          <div className="text-sm text-gray-400 whitespace-pre-wrap">
            {message.snippet || "Loading..."}
          </div>
        )}
      </div>

      {/* Attachments */}
      {message.attachments && message.attachments.length > 0 && (
        <div className="px-4 pb-4">
          <div className="flex flex-wrap gap-2 items-center">
            {message.attachments.map((att) => (
              <AttachmentChip key={att.id} attachment={att} />
            ))}
            {message.attachments.length > 1 && (
              <DownloadAllButton attachments={message.attachments} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function AttachmentChip({ attachment }: { attachment: Attachment }) {
  const url = `/api/emails/${attachment.messageId}/attachments/${attachment.id}?filename=${encodeURIComponent(attachment.filename)}&mimeType=${encodeURIComponent(attachment.mimeType)}`;

  function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  const icon = attachment.mimeType.startsWith("image/") ? "\u{1F5BC}" :
    attachment.mimeType === "application/pdf" ? "\u{1F4C4}" : "\u{1F4CE}";

  return (
    <a
      href={url}
      download={attachment.filename}
      className="flex items-center gap-2 px-3 py-2 btn-accent rounded-lg transition-colors border border-[var(--btn-hover)] text-sm"
    >
      <span>{icon}</span>
      <span className="text-gray-200 truncate max-w-[200px]">{attachment.filename}</span>
      <span className="text-gray-500 text-xs">{formatSize(attachment.size)}</span>
      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    </a>
  );
}

function DownloadAllButton({ attachments }: { attachments: Attachment[] }) {
  const [downloading, setDownloading] = useState(false);

  async function handleDownloadAll() {
    if (downloading) return;
    setDownloading(true);
    try {
      for (const att of attachments) {
        const url = `/api/emails/${att.messageId}/attachments/${att.id}?filename=${encodeURIComponent(att.filename)}&mimeType=${encodeURIComponent(att.mimeType)}`;
        const res = await fetch(url);
        const blob = await res.blob();
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = att.filename;
        a.click();
        URL.revokeObjectURL(a.href);
      }
    } catch (err) {
      console.error("Failed to download attachments:", err);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <button
      onClick={handleDownloadAll}
      disabled={downloading}
      className="flex items-center gap-1.5 px-3 py-2 btn-accent rounded-lg transition-colors text-sm"
    >
      {downloading ? (
        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3" />
          <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      )}
      Download all ({attachments.length})
    </button>
  );
}

const URL_RE = /(\bhttps?:\/\/[^\s<>"')\]]+)/g;

function autoLinkUrls(html: string): string {
  // Only linkify text outside of existing tags
  return html.replace(/>([^<]*)</g, (match, text) => {
    const linked = text.replace(URL_RE, (url: string) =>
      `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
    );
    return `>${linked}<`;
  });
}

// HTML attribute patterns for quote containers (order: most specific first)
// NOTE: these run on RAW html (before DOMPurify) so id/class attrs are intact
const HTML_QUOTE_PATTERNS = [
  // Outlook: appendonsend div (appears just before hr+quote block)
  /<div[^>]+id="appendonsend"[^>]*>/i,
  // Outlook desktop: divRplyFwdMsg
  /<div[^>]+id="divRplyFwdMsg"[^>]*>/i,
  // Outlook Web App: mail-editor-reference-message-container
  /<div[^>]+id="mail-editor-reference-message-container"[^>]*>/i,
  // Outlook mobile separator line
  /<div[^>]+id="ms-outlook-mobile-body-separator-line"[^>]*>/i,
  // Gmail
  /<div[^>]+class="[^"]*gmail_quote[^"]*"/i,
  // Yahoo Mail
  /<div[^>]+class="[^"]*yahoo_quoted[^"]*"/i,
  // Outlook Web / generic hr separator before quoted block
  /<hr[^>]*(?:id="[^"]*")?[^>]*>\s*(?=.*(?:From:|wrote:|Original Message))/i,
  // Apple Mail / Thunderbird blockquote
  /<blockquote/i,
];

// Plain-text quote markers
const PLAIN_QUOTE_RE = /(?:^|\r?\n)(-{3,}[ \t]*(?:Original Message|Forwarded message)[ \t]*-{3,}|On .{10,}wrote:|From:[ \t]+\S.*\r?\n.*Sent:)/im;

function splitQuote(html: string): { main: string; quoted: string | null } {
  const candidates = HTML_QUOTE_PATTERNS
    .map((re) => re.exec(html))
    .filter((m): m is RegExpExecArray => m !== null && m.index > 0)
    .sort((a, b) => a.index - b.index);

  if (candidates.length > 0) {
    const idx = candidates[0].index;
    return { main: html.slice(0, idx), quoted: html.slice(idx) };
  }

  // Plain text fallback
  const match = PLAIN_QUOTE_RE.exec(html);
  if (match && match.index > 0) {
    return { main: html.slice(0, match.index), quoted: html.slice(match.index) };
  }

  return { main: html, quoted: null };
}

const SANITIZE_OPTS = {
  ALLOWED_TAGS: [
    "p", "br", "div", "span", "a", "b", "i", "u", "strong", "em",
    "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li",
    "table", "tr", "td", "th", "thead", "tbody", "img", "blockquote",
    "pre", "code", "hr", "font", "center", "sup", "sub",
  ],
  ALLOWED_ATTR: [
    "href", "src", "alt", "style", "class", "width", "height",
    "face", "size", "color", "align", "valign", "bgcolor",
    "border", "cellpadding", "cellspacing", "colspan", "rowspan",
    "target", "rel",
  ],
};

/** Strip inline color/background styles so dark mode CSS can take effect */
function stripColorStyles(html: string): string {
  return html.replace(/\bstyle="([^"]*)"/gi, (match, styles: string) => {
    const cleaned = styles
      .split(";")
      .filter(s => {
        const prop = s.split(":")[0]?.trim().toLowerCase();
        return prop !== "color" && prop !== "background-color" && prop !== "background";
      })
      .join(";");
    return cleaned.trim() ? `style="${cleaned}"` : "";
  });
}

function EmailBody({ html }: { html: string }) {
  const [showQuoted, setShowQuoted] = useState(false);
  const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");

  // Split on raw HTML first so id/class attrs are intact for pattern matching
  // (DOMPurify strips id attributes, breaking all Outlook quote detection)
  const { main: rawMain, quoted: rawQuoted } = splitQuote(html);

  const sanitize = (s: string) => {
    let sanitized = DOMPurify.sanitize(s, SANITIZE_OPTS);
    if (isDark) sanitized = stripColorStyles(sanitized);
    return sanitized;
  };
  const process = (s: string) => autoLinkUrls(s.replace(/<a\s/gi, '<a target="_blank" rel="noopener noreferrer" '));
  const main = process(sanitize(rawMain));
  const quoted = rawQuoted ? process(sanitize(rawQuoted)) : null;

  const bodyClass = "text-sm text-gray-200 leading-relaxed prose-invert max-w-none email-body-dark [&_a]:text-blue-400 [&_a]:underline [&_a]:cursor-pointer [&_blockquote]:border-l-2 [&_blockquote]:border-gray-700 [&_blockquote]:pl-3 [&_blockquote]:text-gray-400 [&_img]:max-w-full [&_img]:h-auto [&_pre]:bg-gray-800 [&_pre]:p-2 [&_pre]:rounded [&_pre]:overflow-x-auto [&_table]:border-collapse [&_td]:p-1 [&_th]:p-1";

  return (
    <div>
      <div className={bodyClass} dangerouslySetInnerHTML={{ __html: main }} />
      {quoted && (
        <>
          <button
            onClick={() => setShowQuoted((v) => !v)}
            className="mt-2 text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            {showQuoted ? "Hide quoted text" : "Show quoted text"}
          </button>
          {showQuoted && (
            <div className={`mt-2 ${bodyClass}`} dangerouslySetInnerHTML={{ __html: quoted }} />
          )}
        </>
      )}
    </div>
  );
}
