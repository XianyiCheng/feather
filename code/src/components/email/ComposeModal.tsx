"use client";

import { useState } from "react";
import { useAppStore } from "@/store";

export function ComposeModal() {
  const composeDraft = useAppStore((s) => s.composeDraft);
  const composeSubject = useAppStore((s) => s.composeSubject);
  const composeToEmail = useAppStore((s) => s.composeToEmail);
  const composeCc = useAppStore((s) => s.composeCc);
  const composeBcc = useAppStore((s) => s.composeBcc);
  const closeCompose = useAppStore((s) => s.closeCompose);

  const [to, setTo] = useState(composeToEmail);
  const [cc, setCc] = useState(composeCc);
  const [bcc, setBcc] = useState(composeBcc);
  const [subject, setSubject] = useState(composeSubject);
  const [body, setBody] = useState(composeDraft);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [showCcBcc, setShowCcBcc] = useState(!!(composeCc || composeBcc));

  async function handleSend() {
    if (!to.trim() || !subject.trim() || !body.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    setSending(true);
    setError("");
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
        }),
      });
      if (!res.ok) throw new Error("Send failed");
      closeCompose();
    } catch {
      setError("Failed to send email. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-t-lg w-full max-w-2xl flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
          <h3 className="text-sm font-medium text-white">New Message</h3>
          <button onClick={closeCompose} className="text-gray-400 hover:text-white transition-colors">
            ✕
          </button>
        </div>
        <div className="px-4 py-2 space-y-2 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-500 w-12">To:</label>
            <input type="text" value={to} onChange={(e) => setTo(e.target.value)}
              className="flex-1 bg-transparent text-sm text-gray-200 outline-none" placeholder="recipient@example.com" />
            {!showCcBcc && (
              <button
                onClick={() => setShowCcBcc(true)}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                Cc/Bcc
              </button>
            )}
          </div>
          {showCcBcc && (
            <>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-500 w-12">Cc:</label>
                <input type="text" value={cc} onChange={(e) => setCc(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-gray-200 outline-none" placeholder="cc@example.com" />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-500 w-12">Bcc:</label>
                <input type="text" value={bcc} onChange={(e) => setBcc(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-gray-200 outline-none" placeholder="bcc@example.com" />
              </div>
            </>
          )}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-500 w-12">Subject:</label>
            <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)}
              className="flex-1 bg-transparent text-sm text-gray-200 outline-none" placeholder="Subject" />
          </div>
        </div>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} autoFocus
          className="flex-1 min-h-[200px] p-4 bg-transparent text-sm text-gray-200 resize-none outline-none"
          placeholder="Write your message..." />
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-800">
          <div>{error && <span className="text-sm text-red-400">{error}</span>}</div>
          <div className="flex gap-2">
            <button onClick={closeCompose} className="px-4 py-1.5 text-sm text-gray-400 hover:text-white transition-colors">Discard</button>
            <button onClick={handleSend} disabled={sending}
              className="px-4 py-1.5 text-sm btn-accent rounded-md transition-colors">
              {sending ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
