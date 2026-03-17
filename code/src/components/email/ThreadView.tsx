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
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-white">
              {thread.subject}
            </h2>
            <div className="text-xs text-gray-500 mt-1">
              {thread.messageCount} message{thread.messageCount !== 1 ? "s" : ""} ·{" "}
              {thread.participants.slice(0, 4).map((p) => p.name || p.email).join(", ")}
              {thread.participants.length > 4 && ` +${thread.participants.length - 4}`}
            </div>
          </div>
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
  const [collapsed, setCollapsed] = useState(false);

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

function EmailBody({ html }: { html: string }) {
  const sanitized = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p", "br", "div", "span", "a", "b", "i", "u", "strong", "em",
      "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li",
      "table", "tr", "td", "th", "thead", "tbody", "img", "blockquote",
      "pre", "code", "hr", "style", "font", "center", "sup", "sub",
    ],
    ALLOWED_ATTR: [
      "href", "src", "alt", "style", "class", "width", "height",
      "face", "size", "color", "align", "valign", "bgcolor",
      "border", "cellpadding", "cellspacing", "colspan", "rowspan",
      "target",
    ],
  });

  return (
    <div
      className="text-sm text-gray-200 leading-relaxed prose-invert max-w-none
        [&_a]:text-blue-400 [&_a]:underline
        [&_blockquote]:border-l-2 [&_blockquote]:border-gray-700 [&_blockquote]:pl-3 [&_blockquote]:text-gray-400
        [&_img]:max-w-full [&_img]:h-auto
        [&_pre]:bg-gray-800 [&_pre]:p-2 [&_pre]:rounded [&_pre]:overflow-x-auto
        [&_table]:border-collapse [&_td]:p-1 [&_th]:p-1"
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
