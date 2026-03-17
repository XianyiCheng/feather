"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAppStore } from "@/store";
import type { ForwardedAttachment } from "@/lib/email/types";

export function DraftReply() {
  const openThread = useAppStore((s) => s.openThread);
  const composeDraft = useAppStore((s) => s.composeDraft);
  const composeSubject = useAppStore((s) => s.composeSubject);
  const composeToEmail = useAppStore((s) => s.composeToEmail);
  const composeCc = useAppStore((s) => s.composeCc);
  const composeBcc = useAppStore((s) => s.composeBcc);
  const composeAttachments = useAppStore((s) => s.composeAttachments);

  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<"" | "sent" | "error" | "saving" | "saved">("");
  const [showCcBcc, setShowCcBcc] = useState(false);
  const [draftId, setDraftId] = useState("");
  const [attachments, setAttachments] = useState<ForwardedAttachment[]>([]);

  const prevThreadIdRef = useRef<string | null>(null);

  // Reset fields when thread changes, then try to load Gmail draft
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const newId = openThread?.id ?? null;
    if (newId === prevThreadIdRef.current) return;
    prevThreadIdRef.current = newId;
    discardedRef.current = false;

    // Cancel any in-flight draft load from previous thread
    if (abortRef.current) abortRef.current.abort();

    setBody("");
    setCc("");
    setBcc("");
    setDraftId("");
    setShowCcBcc(false);
    setAttachments([]);

    if (openThread) {
      // Find the reply-to address: last message not from the user
      const myEmails = ["YOUR_GMAIL@example.com", "YOUR_PRIMARY_EMAIL@example.com", "YOUR_ALT_EMAIL@example.com"];
      const messages = openThread.messages;
      let replyTo = "";
      for (let i = messages.length - 1; i >= 0; i--) {
        if (!myEmails.includes(messages[i].from.email.toLowerCase())) {
          replyTo = messages[i].from.email;
          break;
        }
      }
      setTo(replyTo || messages[messages.length - 1].from.email);
      setSubject(`Re: ${openThread.subject}`);

      // Try to load a saved Gmail draft for this thread
      const controller = new AbortController();
      abortRef.current = controller;
      const tid = openThread.id;

      fetch(`/api/drafts/thread?threadId=${tid}`, { signal: controller.signal })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (controller.signal.aborted) return;
          if (!data?.draft) return;
          const d = data.draft;
          setDraftId(d.id);
          if (d.body) {
            const text = d.body.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]*>/g, "");
            setBody(text);
          }
          if (d.to?.length) setTo(d.to.map((a: any) => a.email).join(", "));
          if (d.cc?.length) { setCc(d.cc.map((a: any) => a.email).join(", ")); setShowCcBcc(true); }
          if (d.bcc?.length) { setBcc(d.bcc.map((a: any) => a.email).join(", ")); setShowCcBcc(true); }
          if (d.subject) setSubject(d.subject);
        })
        .catch(() => {});
    } else {
      setTo("");
      setSubject("");
    }
  }, [openThread?.id]);

  // CLI pushes
  useEffect(() => { if (composeDraft) { setBody(composeDraft); useAppStore.setState({ composeDraft: "" }); } }, [composeDraft]);
  useEffect(() => { if (composeToEmail) { setTo(composeToEmail); useAppStore.setState({ composeToEmail: "" }); } }, [composeToEmail]);
  useEffect(() => { if (composeSubject) { setSubject(composeSubject); useAppStore.setState({ composeSubject: "" }); } }, [composeSubject]);
  useEffect(() => { if (composeCc) { setCc(composeCc); setShowCcBcc(true); useAppStore.setState({ composeCc: "" }); } }, [composeCc]);
  useEffect(() => { if (composeBcc) { setBcc(composeBcc); setShowCcBcc(true); useAppStore.setState({ composeBcc: "" }); } }, [composeBcc]);
  useEffect(() => { if (composeAttachments.length) { setAttachments(composeAttachments); useAppStore.setState({ composeAttachments: [] }); } }, [composeAttachments]);

  // Auto-save to Gmail draft (debounced 3s)
  const saveTimer = useRef<NodeJS.Timeout | null>(null);
  const draftIdRef = useRef(draftId);
  draftIdRef.current = draftId;
  const discardedRef = useRef(false);

  const saveDraftToGmail = useCallback(() => {
    if (discardedRef.current) return;
    const currentBody = body;
    const currentTo = to;
    if (!currentBody.trim()) return;

    setStatus("saving");
    const toAddrs = currentTo.split(",").map(e => e.trim()).filter(Boolean).map(e => ({ name: "", email: e }));
    const ccAddrs = cc.split(",").map(e => e.trim()).filter(Boolean).map(e => ({ name: "", email: e }));
    const bccAddrs = bcc.split(",").map(e => e.trim()).filter(Boolean).map(e => ({ name: "", email: e }));

    fetch("/api/drafts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: toAddrs,
        cc: ccAddrs.length ? ccAddrs : undefined,
        bcc: bccAddrs.length ? bccAddrs : undefined,
        subject,
        body: currentBody.replace(/\n/g, "<br>"),
        threadId: openThread?.id,
        draftId: draftIdRef.current || undefined,
        attachments: attachments.length ? attachments : undefined,
      }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((saved) => {
        if (saved?.id) {
          setDraftId(saved.id);
          setStatus("saved");
          setTimeout(() => setStatus((s) => (s === "saved" ? "" : s)), 2000);
        } else {
          setStatus("");
        }
      })
      .catch(() => setStatus(""));
  }, [body, to, cc, bcc, subject, openThread?.id]);

  useEffect(() => {
    if (!body.trim()) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(saveDraftToGmail, 3000);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [body, to, cc, bcc, subject, saveDraftToGmail]);

  // Sync to CLI state
  const syncTimer = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => {
      fetch("/api/cli/state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draft: { to, cc, bcc, subject, body } }),
      }).catch(() => {});
    }, 300);
    return () => { if (syncTimer.current) clearTimeout(syncTimer.current); };
  }, [to, cc, bcc, subject, body]);

  async function handleSend() {
    if (!to.trim() || !body.trim()) return;
    setSending(true);
    setStatus("");
    try {
      const toAddrs = to.split(",").map(e => e.trim()).filter(Boolean).map(e => ({ name: "", email: e }));
      const ccAddrs = cc.split(",").map(e => e.trim()).filter(Boolean).map(e => ({ name: "", email: e }));
      const bccAddrs = bcc.split(",").map(e => e.trim()).filter(Boolean).map(e => ({ name: "", email: e }));
      const res = await fetch("/api/emails/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: toAddrs,
          cc: ccAddrs.length ? ccAddrs : undefined,
          bcc: bccAddrs.length ? bccAddrs : undefined,
          subject: subject.trim(),
          body: body.replace(/\n/g, "<br>"),
          replyToMessageId: openThread?.id,
          attachments: attachments.length ? attachments : undefined,
        }),
      });
      if (!res.ok) throw new Error("Send failed");
      // Delete the Gmail draft after sending
      if (draftId) {
        fetch(`/api/drafts?draftId=${draftId}`, { method: "DELETE" }).catch(() => {});
      }
      setStatus("sent");
      setBody(""); setTo(""); setCc(""); setBcc(""); setSubject(""); setDraftId(""); setAttachments([]);
      setTimeout(() => setStatus(""), 3000);
    } catch {
      setStatus("error");
    } finally {
      setSending(false);
    }
  }

  function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  }

  return (
    <div className="flex flex-col h-full bg-gray-950">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800 flex-shrink-0">
        <span className="text-xs font-medium text-gray-400">
          {openThread ? "Draft Reply" : "New Email"}
        </span>
        <div className="flex items-center gap-2">
          {status === "saving" && <span className="text-xs text-gray-500">Saving...</span>}
          {status === "saved" && <span className="text-xs text-gray-400">Draft saved</span>}
          {status === "sent" && <span className="text-xs text-green-400">Sent!</span>}
          {status === "error" && <span className="text-xs text-red-400">Failed to send</span>}
        </div>
      </div>

      <div className="px-3 py-1.5 border-b border-gray-800/50 flex-shrink-0 space-y-1">
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500 w-10">To:</label>
          <input type="text" value={to} onChange={(e) => setTo(e.target.value)}
            className="flex-1 bg-transparent text-xs text-gray-300 outline-none" placeholder="recipient@example.com" />
          {!showCcBcc && (
            <button onClick={() => setShowCcBcc(true)} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Cc/Bcc</button>
          )}
        </div>
        {showCcBcc && (
          <>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-500 w-10">Cc:</label>
              <input type="text" value={cc} onChange={(e) => setCc(e.target.value)}
                className="flex-1 bg-transparent text-xs text-gray-300 outline-none" placeholder="cc@example.com" />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-500 w-10">Bcc:</label>
              <input type="text" value={bcc} onChange={(e) => setBcc(e.target.value)}
                className="flex-1 bg-transparent text-xs text-gray-300 outline-none" placeholder="bcc@example.com" />
            </div>
          </>
        )}
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500 w-10">Subj:</label>
          <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)}
            className="flex-1 bg-transparent text-xs text-gray-300 outline-none" placeholder="Subject" />
        </div>
      </div>

      <textarea value={body} onChange={(e) => { discardedRef.current = false; setBody(e.target.value); }}
        className="flex-1 px-3 py-2 bg-transparent text-sm text-gray-200 resize-none outline-none min-h-0"
        id="draft-body" placeholder="Write your reply here, or use Claude Code to draft..." />

      {attachments.length > 0 && (
        <div className="px-3 py-1.5 border-t border-gray-800/50 flex-shrink-0">
          <div className="flex flex-wrap gap-1.5">
            {attachments.map((att, i) => (
              <span key={`${att.id}-${i}`} className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-300 border border-gray-700">
                <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                <span className="max-w-[150px] truncate">{att.filename}</span>
                <span className="text-gray-500">({formatSize(att.size)})</span>
                <button
                  onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))}
                  className="ml-0.5 text-gray-500 hover:text-red-400 transition-colors"
                  title="Remove attachment"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between px-3 py-2 border-t border-gray-800 flex-shrink-0">
        <button
          onClick={async () => {
            // Block auto-save from re-saving with stale closure values
            discardedRef.current = true;

            // Cancel any pending timers
            if (saveTimer.current) { clearTimeout(saveTimer.current); saveTimer.current = null; }
            if (syncTimer.current) { clearTimeout(syncTimer.current); syncTimer.current = null; }

            // Delete the Gmail draft
            const idToDelete = draftId;

            // Clear all fields
            setTo(""); setCc(""); setBcc(""); setSubject(""); setBody(""); setDraftId(""); setAttachments([]);
            setShowCcBcc(false); setStatus("");
            draftIdRef.current = "";

            if (idToDelete) {
              try {
                await fetch(`/api/drafts?draftId=${idToDelete}`, { method: "DELETE" });
              } catch {}
            }
          }}
          disabled={!to.trim() && !body.trim() && !subject.trim()}
          className="px-3 py-1.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 disabled:opacity-30 disabled:hover:bg-transparent rounded-md transition-colors"
          title="Discard draft"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
        <button onClick={handleSend} disabled={sending || !body.trim() || !to.trim()}
          className="px-4 py-1.5 text-sm btn-accent rounded-md transition-colors">
          {sending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
