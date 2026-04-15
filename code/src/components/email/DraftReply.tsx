"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSWRConfig } from "swr";
import { useAppStore } from "@/store";
import type { ForwardedAttachment, UploadedAttachment } from "@/lib/email/types";

function parseAddrs(raw: string) {
  if (!raw.trim()) return [];
  // If no angle brackets, simple comma-split for bare emails
  if (!raw.includes("<")) {
    return raw.split(",").map((s) => ({ name: "", email: s.trim() })).filter((a) => a.email);
  }
  // Split on ">, " — the real separator between "Name <email>" addresses.
  // This preserves commas inside display names like "Name, Ph.D."
  return raw.split(/>\s*,\s*/).map((part) => {
    const m = part.trim().match(/^(.*?)\s*<(.+?)>?\s*$/);
    return m ? { name: m[1].trim(), email: m[2].trim() } : { name: "", email: part.trim() };
  }).filter((a) => a.email && a.email.includes("@"));
}

const MY_EMAILS = (process.env.NEXT_PUBLIC_MY_EMAILS || "").split(",").map(e => e.trim().toLowerCase()).filter(Boolean);
const PRIMARY_CC_ADDR = process.env.NEXT_PUBLIC_PRIMARY_CC_EMAIL || "";

function ensurePrimaryCc(existing: string): string {
  if (!PRIMARY_CC_ADDR) return existing;
  const addrs = existing.split(",").map((e) => e.trim()).filter(Boolean);
  if (!addrs.some((e) => e.toLowerCase() === PRIMARY_CC_ADDR.toLowerCase())) {
    addrs.push(PRIMARY_CC_ADDR);
  }
  return addrs.join(", ");
}

function fmtAddr(a: { name: string; email: string }): string {
  return a.name ? `${a.name} <${a.email}>` : a.email;
}

function computeReplyAddrs(
  thread: { messages: Array<{ from: { name: string; email: string }; to: Array<{ name: string; email: string }>; cc: Array<{ name: string; email: string }> }> },
  replyAll: boolean,
  isSentFolder: boolean
): { to: string; cc: string } {
  const messages = thread.messages;
  const lastMsg = messages[messages.length - 1];
  let replyTo = "";

  if (isSentFolder) {
    const externalTo = lastMsg.to.find((a) => !MY_EMAILS.includes(a.email.toLowerCase()));
    replyTo = externalTo?.email || lastMsg.to[0]?.email || "";
  } else {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (!MY_EMAILS.includes(messages[i].from.email.toLowerCase())) {
        replyTo = messages[i].from.email;
        break;
      }
    }
  }

  if (!replyAll) {
    return { to: replyTo, cc: PRIMARY_CC_ADDR };
  }

  // Reply All: include original To + CC, excluding self and the main reply-to address
  const seen = new Set<string>([...MY_EMAILS, replyTo.toLowerCase()]);
  const others: string[] = [];
  for (const addr of [...lastMsg.to, ...lastMsg.cc]) {
    const key = addr.email.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      others.push(fmtAddr(addr));
    }
  }
  return { to: replyTo, cc: ensurePrimaryCc(others.join(", ")) };
}

export function DraftReply() {
  const openThread = useAppStore((s) => s.openThread);
  const activeFolder = useAppStore((s) => s.activeFolder);
  const composeDraft = useAppStore((s) => s.composeDraft);
  const composeSubject = useAppStore((s) => s.composeSubject);
  const composeToEmail = useAppStore((s) => s.composeToEmail);
  const composeCc = useAppStore((s) => s.composeCc);
  const composeBcc = useAppStore((s) => s.composeBcc);
  const composeAttachments = useAppStore((s) => s.composeAttachments);
  const triggerThreadRefresh = useAppStore((s) => s.triggerThreadRefresh);
  const composeQueue = useAppStore((s) => s.composeQueue);
  const activeComposeIndex = useAppStore((s) => s.activeComposeIndex);
  const { mutate: globalMutate } = useSWRConfig();

  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [toFocused, setToFocused] = useState(false);
  const [ccFocused, setCcFocused] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<"" | "sent" | "error" | "send-error" | "saving" | "saved">("");
  const [showCcBcc, setShowCcBcc] = useState(false);
  const [draftId, setDraftId] = useState("");
  const [attachments, setAttachments] = useState<ForwardedAttachment[]>([]);
  const [uploadedAttachments, setUploadedAttachments] = useState<UploadedAttachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [replyAll, setReplyAll] = useState(false);

  const prevThreadIdRef = useRef<string | null>(null);
  const discardedRef = useRef(false);

  // Cache draft state per thread so switching threads doesn't lose work
  interface DraftState {
    to: string; cc: string; bcc: string; subject: string; body: string;
    draftId: string; showCcBcc: boolean; attachments: ForwardedAttachment[];
    replyAll: boolean;
  }
  const draftCacheRef = useRef<Map<string, DraftState>>(new Map());

  // Keep refs to current field values so the thread-switch effect always reads fresh state
  const fieldsRef = useRef({ to, cc, bcc, subject, body, draftId, showCcBcc, attachments, replyAll });
  fieldsRef.current = { to, cc, bcc, subject, body, draftId, showCcBcc, attachments, replyAll };

  // Reset fields when thread changes, then try to load Gmail draft
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const newId = openThread?.id ?? null;
    if (newId === prevThreadIdRef.current) return;
    const prevId = prevThreadIdRef.current;
    prevThreadIdRef.current = newId;
    discardedRef.current = false;

    // Cancel any in-flight draft load from previous thread
    if (abortRef.current) abortRef.current.abort();

    // Save current draft state for previous thread (if it has content)
    const f = fieldsRef.current;
    if (prevId && f.body.trim()) {
      draftCacheRef.current.set(prevId, { ...f });
    } else if (prevId) {
      // No content — remove stale cache entry
      draftCacheRef.current.delete(prevId);
    }

    // Try to restore cached draft for the new thread
    const cached = newId ? draftCacheRef.current.get(newId) : undefined;
    if (cached) {
      setTo(cached.to); setCc(cached.cc); setBcc(cached.bcc);
      setSubject(cached.subject); setBody(cached.body);
      setDraftId(cached.draftId); setShowCcBcc(cached.showCcBcc);
      setAttachments(cached.attachments); setReplyAll(cached.replyAll);
      return; // Skip default init & Gmail draft load — we already have state
    }

    setTo("");
    setSubject("");
    setBody("");
    setCc("");
    setBcc("");
    setDraftId("");
    setShowCcBcc(false);
    setAttachments([]);
    setReplyAll(false);

    if (openThread) {
      const isDraft = useAppStore.getState().activeFolder === "drafts";

      if (!isDraft) {
        const isSentFolder = useAppStore.getState().activeFolder === "sent";
        const { to: replyTo, cc: replyCc } = computeReplyAddrs(openThread, false, isSentFolder);
        setTo(replyTo);
        setSubject(`Re: ${openThread.subject}`);
        setCc(replyCc);
        setShowCcBcc(true);
      }

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
          const fmt = (a: any) => a.name ? `${a.name} <${a.email}>` : a.email;
          if (d.to?.length) setTo(d.to.map(fmt).join(", "));
          const loadedCc = d.cc?.length ? d.cc.map(fmt).join(", ") : "";
          setCc(ensurePrimaryCc(loadedCc));
          setShowCcBcc(true);
          if (d.bcc?.length) { setBcc(d.bcc.map(fmt).join(", ")); }
          if (d.subject) setSubject(d.subject);
        })
        .catch(() => {});
    }
  }, [openThread?.id]);

  // CLI pushes (for replies / single drafts when a thread is open)
  useEffect(() => { if (composeDraft) { setBody(composeDraft); useAppStore.setState({ composeDraft: "" }); } }, [composeDraft]);
  useEffect(() => { if (composeToEmail !== null) { setTo(composeToEmail); useAppStore.setState({ composeToEmail: null }); } }, [composeToEmail]);
  useEffect(() => { if (composeSubject) { setSubject(composeSubject); useAppStore.setState({ composeSubject: "" }); } }, [composeSubject]);
  useEffect(() => { if (composeCc) { setCc(composeCc); setShowCcBcc(true); useAppStore.setState({ composeCc: "" }); } }, [composeCc]);
  useEffect(() => { if (composeBcc) { setBcc(composeBcc); setShowCcBcc(true); useAppStore.setState({ composeBcc: "" }); } }, [composeBcc]);
  useEffect(() => { if (composeAttachments.length) { setAttachments(composeAttachments); useAppStore.setState({ composeAttachments: [] }); } }, [composeAttachments]);

  // Load from compose queue when active index changes (for multi-draft new emails)
  const prevQueueIndexRef = useRef<number>(-1);
  const prevQueueLenRef = useRef<number>(0);
  useEffect(() => {
    if (openThread) return; // Queue only applies to new compose
    if (composeQueue.length === 0) return;
    // Only load when index or queue length changes
    if (activeComposeIndex === prevQueueIndexRef.current && composeQueue.length === prevQueueLenRef.current) return;
    prevQueueIndexRef.current = activeComposeIndex;
    prevQueueLenRef.current = composeQueue.length;
    const draft = composeQueue[activeComposeIndex];
    if (!draft) return;
    setTo(draft.to);
    setCc(draft.cc);
    setBcc(draft.bcc);
    setSubject(draft.subject);
    setBody(draft.body);
    setAttachments(draft.attachments);
    setShowCcBcc(!!(draft.cc || draft.bcc));
    setDraftId("");
  }, [activeComposeIndex, composeQueue.length, openThread]);

  // Auto-save to Gmail draft (debounced 3s)
  const saveTimer = useRef<NodeJS.Timeout | null>(null);
  const draftIdRef = useRef(draftId);
  draftIdRef.current = draftId;

  const saveDraftToGmail = useCallback(() => {
    if (discardedRef.current) return;
    const currentBody = body;
    const currentTo = to;
    if (!currentBody.trim()) return;

    setStatus("saving");
    const toAddrs = parseAddrs(currentTo);
    const ccAddrs = parseAddrs(cc);
    const bccAddrs = parseAddrs(bcc);

    fetch("/api/drafts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: toAddrs,
        cc: ccAddrs.length ? ccAddrs : undefined,
        bcc: bccAddrs.length ? bccAddrs : undefined,
        subject,
        body: currentBody.replace(/\n/g, "<br>"),
        threadId: (() => {
          const currentThread = useAppStore.getState().openThread;
          if (!currentThread) return undefined;
          const strip = (s: string) =>
            s.replace(/^(Re:\s*|Fwd:\s*|Fw:\s*|\[.*?\]\s*)+/gi, "").trim().toLowerCase();
          return strip(subject) === strip(currentThread.subject) ? currentThread.id : undefined;
        })(),
        draftId: draftIdRef.current || undefined,
        attachments: attachments.length ? attachments : undefined,
      }),
    })
      .then(async (r) => {
        if (!r.ok) {
          console.error("Draft save failed:", r.status, await r.text().catch(() => ""));
          setStatus("error");
          return;
        }
        const saved = await r.json();
        if (saved?.id) {
          setDraftId(saved.id);
          setStatus("saved");
          setTimeout(() => setStatus((s) => (s === "saved" ? "" : s)), 2000);
        } else {
          setStatus("");
        }
      })
      .catch((err) => { console.error("Draft save error:", err); setStatus("error"); });
  }, [body, to, cc, bcc, subject]);

  useEffect(() => {
    if (!body.trim()) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(saveDraftToGmail, 3000);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [body, to, cc, bcc, subject, saveDraftToGmail]);

  // Sync to CLI state and keep compose queue in sync
  const syncTimer = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => {
      const { composeQueue: q, activeComposeIndex: idx } = useAppStore.getState();
      fetch("/api/cli/state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draft: { to, cc, bcc, subject, body },
          composeQueue: q.map((d) => ({ to: d.to, subject: d.subject })),
          activeComposeIndex: idx,
        }),
      }).catch(() => {});
      // Keep compose queue entry in sync with field edits
      const { composeQueue, activeComposeIndex, openThread: ot } = useAppStore.getState();
      if (!ot && composeQueue.length > 0 && composeQueue[activeComposeIndex]) {
        const updated = [...composeQueue];
        updated[activeComposeIndex] = { to, cc, bcc, subject, body, attachments };
        useAppStore.setState({ composeQueue: updated });
      }
    }, 300);
    return () => { if (syncTimer.current) clearTimeout(syncTimer.current); };
  }, [to, cc, bcc, subject, body, attachments]);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(",")[1]; // strip data:...;base64, prefix
        setUploadedAttachments(prev => [...prev, {
          filename: file.name,
          mimeType: file.type || "application/octet-stream",
          size: file.size,
          base64Data: base64,
        }]);
      };
      reader.readAsDataURL(file);
    });
    // Reset input so the same file can be re-selected
    e.target.value = "";
  }

  async function handleSend() {
    if (!to.trim() || !body.trim()) return;
    setSending(true);
    setStatus("");
    try {
      const toAddrs = parseAddrs(to);
      const ccAddrs = parseAddrs(cc);
      const bccAddrs = parseAddrs(bcc);

      // Only thread the email if the subject matches the open thread
      // (strip Re:/Fwd:/Fw:/[tags] prefixes for comparison)
      const stripPrefixes = (s: string) =>
        s.replace(/^(Re:\s*|Fwd:\s*|Fw:\s*|\[.*?\]\s*)+/gi, "").trim().toLowerCase();
      const isReply = openThread &&
        stripPrefixes(subject) === stripPrefixes(openThread.subject);

      // Get the last message ID for In-Reply-To header, and thread ID for Gmail threading
      const lastMsg = isReply && openThread?.messages?.length
        ? openThread.messages[openThread.messages.length - 1]
        : undefined;

      const res = await fetch("/api/emails/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: toAddrs,
          cc: ccAddrs.length ? ccAddrs : undefined,
          bcc: bccAddrs.length ? bccAddrs : undefined,
          subject: subject.trim(),
          body: body.replace(/\n/g, "<br>"),
          replyToMessageId: lastMsg?.id,
          threadId: isReply ? openThread?.id : undefined,
          attachments: attachments.length ? attachments : undefined,
          uploadedAttachments: uploadedAttachments.length ? uploadedAttachments : undefined,
        }),
      });
      if (!res.ok) throw new Error("Send failed");
      // Delete the Gmail draft after sending
      if (draftId) {
        fetch(`/api/drafts?draftId=${draftId}`, { method: "DELETE" }).catch(() => {});
      }
      setStatus("sent");
      // Clear cached draft for this thread
      const sentId = useAppStore.getState().openThread?.id;
      if (sentId) draftCacheRef.current.delete(sentId);
      // Remove from compose queue if applicable
      const currentQueue = useAppStore.getState().composeQueue;
      if (!sentId && currentQueue.length > 0) {
        handleRemoveCompose(useAppStore.getState().activeComposeIndex);
      }
      setBody(""); setTo(""); setCc(""); setBcc(""); setSubject(""); setDraftId(""); setAttachments([]); setUploadedAttachments([]);
      // If in drafts folder, remove the thread from the list and close it
      const currentFolder = useAppStore.getState().activeFolder;
      const sentThread = useAppStore.getState().openThread;
      if (currentFolder === "drafts" && sentThread) {
        useAppStore.getState().discardThread(sentThread.id);
        useAppStore.setState({ openThread: null, selectedIndex: -1 });
      }
      // Reload the thread and list after a short delay so Gmail indexes the sent message
      setTimeout(() => {
        triggerThreadRefresh();
        globalMutate((key: unknown) => typeof key === "string" && key.startsWith("/api/emails"));
      }, 1500);
      setTimeout(() => setStatus(""), 3000);
    } catch {
      setStatus("send-error");
    } finally {
      setSending(false);
    }
  }

  function handleSwitchCompose(index: number) {
    if (index === activeComposeIndex || index < 0 || index >= composeQueue.length) return;
    // Save current local fields to queue
    useAppStore.getState().updateQueueEntry(activeComposeIndex, {
      to, cc, bcc, subject, body, attachments,
    });
    // Load target draft from queue
    const target = composeQueue[index];
    setTo(target.to); setCc(target.cc); setBcc(target.bcc);
    setSubject(target.subject); setBody(target.body);
    setAttachments(target.attachments);
    setShowCcBcc(!!(target.cc || target.bcc));
    setDraftId("");
    useAppStore.getState().setActiveComposeIndex(index);
  }

  function handleRemoveCompose(index: number) {
    const queue = useAppStore.getState().composeQueue;
    if (queue.length <= 1) {
      useAppStore.setState({ composeQueue: [], activeComposeIndex: 0 });
      setTo(""); setCc(""); setBcc(""); setSubject(""); setBody(""); setDraftId(""); setAttachments([]);
      return;
    }
    // If removing active tab, save isn't needed — just load the next one
    // If removing non-active, save current first
    if (index !== activeComposeIndex) {
      useAppStore.getState().updateQueueEntry(activeComposeIndex, {
        to, cc, bcc, subject, body, attachments,
      });
    }
    useAppStore.getState().removeQueueEntry(index);
    // Load whatever is now active
    const newState = useAppStore.getState();
    const target = newState.composeQueue[newState.activeComposeIndex];
    if (target) {
      setTo(target.to); setCc(target.cc); setBcc(target.bcc);
      setSubject(target.subject); setBody(target.body);
      setAttachments(target.attachments);
      setShowCcBcc(!!(target.cc || target.bcc));
    }
  }

  function handleReplyAllToggle() {
    const thread = useAppStore.getState().openThread;
    const isDraft = useAppStore.getState().activeFolder === "drafts";
    if (!thread || isDraft) return;
    const isSentFolder = useAppStore.getState().activeFolder === "sent";
    const newReplyAll = !replyAll;
    const { to: newTo, cc: newCc } = computeReplyAddrs(thread, newReplyAll, isSentFolder);
    setReplyAll(newReplyAll);
    setTo(newTo);
    setCc(newCc);
    setShowCcBcc(true);
  }

  function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  }

  // Show just name (or email if no name) when field is not focused
  function displayValue(raw: string): string {
    return raw.split(",").map((s) => {
      const m = s.trim().match(/^(.+?)\s*<([^>]+)>$/);
      return m ? m[1].trim() : s.trim();
    }).filter(Boolean).join(", ");
  }

  function handleEmailKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>,
    value: string,
    setter: (v: string) => void
  ) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); handleSend(); return; }
    if (e.key === " ") {
      const trimmed = value.trimEnd();
      if (trimmed && !trimmed.endsWith(",")) {
        e.preventDefault();
        setter(trimmed + ", ");
      }
    }
  }

  return (
    <div className="flex flex-col h-full w-full bg-gray-950">
      {!openThread && composeQueue.length > 1 && (
        <div className="flex items-center gap-1 px-3 py-1.5 border-b border-gray-800 flex-shrink-0 overflow-x-auto">
          {composeQueue.map((draft, i) => {
            const label = draft.to ? draft.to.split("@")[0].split("<").pop()?.trim() || `Draft ${i + 1}` : `Draft ${i + 1}`;
            return (
              <div key={i} className="flex items-center group">
                <button
                  onClick={() => handleSwitchCompose(i)}
                  className={`text-xs px-2 py-1 rounded-t transition-colors truncate max-w-[120px] ${
                    i === activeComposeIndex
                      ? "text-blue-400 bg-blue-500/10 border-b-2 border-blue-400"
                      : "text-gray-500 hover:text-gray-300 hover:bg-gray-800"
                  }`}
                  title={draft.to}
                >
                  {label}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleRemoveCompose(i); }}
                  className="text-gray-600 hover:text-red-400 text-xs ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Close draft"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-400">
            {openThread ? "Draft Reply" : "New Email"}
          </span>
          {openThread && activeFolder !== "drafts" && (
            <button
              onClick={handleReplyAllToggle}
              className={`text-xs px-1.5 py-0.5 rounded transition-colors ${
                replyAll
                  ? "text-blue-400 bg-blue-500/10 hover:bg-blue-500/20"
                  : "text-gray-500 hover:text-gray-300 hover:bg-gray-800"
              }`}
              title={replyAll ? "Switch to Reply" : "Switch to Reply All"}
            >
              {replyAll ? "Reply All" : "Reply"}
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {status === "saving" && <span className="text-xs text-gray-500">Saving...</span>}
          {status === "saved" && <span className="text-xs text-gray-400">Draft saved</span>}
          {status === "sent" && <span className="text-xs text-green-400">Sent!</span>}
          {status === "error" && <span className="text-xs text-red-400">Save failed</span>}
          {status === "send-error" && <span className="text-xs text-red-400">Failed to send</span>}
        </div>
      </div>

      <div className="px-3 py-1.5 border-b border-gray-800/50 flex-shrink-0 space-y-1">
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500 w-10">To:</label>
          <input type="text"
            value={toFocused ? to : displayValue(to)}
            onChange={(e) => setTo(e.target.value)}
            onFocus={() => setToFocused(true)}
            onBlur={() => setToFocused(false)}
            onKeyDown={(e) => handleEmailKeyDown(e, to, setTo)}
            className="flex-1 bg-transparent text-xs text-gray-300 outline-none" placeholder="recipient@example.com" />
          {!showCcBcc && (
            <button onClick={() => setShowCcBcc(true)} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Cc/Bcc</button>
          )}
        </div>
        {showCcBcc && (
          <>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-500 w-10">Cc:</label>
              <input type="text"
                value={ccFocused ? cc : displayValue(cc)}
                onChange={(e) => setCc(e.target.value)}
                onFocus={() => setCcFocused(true)}
                onBlur={() => setCcFocused(false)}
                onKeyDown={(e) => handleEmailKeyDown(e, cc, setCc)}
                className="flex-1 bg-transparent text-xs text-gray-300 outline-none" placeholder="cc@example.com" />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-500 w-10">Bcc:</label>
              <input type="text" value={bcc} onChange={(e) => setBcc(e.target.value)}
                onKeyDown={(e) => handleEmailKeyDown(e, bcc, setBcc)}
                className="flex-1 bg-transparent text-xs text-gray-300 outline-none" placeholder="bcc@example.com" />
            </div>
          </>
        )}
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500 w-10">Subj:</label>
          <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); handleSend(); } }}
            className="flex-1 bg-transparent text-xs text-gray-300 outline-none" placeholder="Subject" />
        </div>
      </div>

      <textarea value={body} onChange={(e) => setBody(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); handleSend(); } }}
        className="flex-1 w-full px-3 py-2 bg-transparent text-sm text-gray-200 resize-none outline-none min-h-0"
        id="draft-body" placeholder="Write your reply here, or use Claude Code to draft..." />

      {(attachments.length > 0 || uploadedAttachments.length > 0) && (
        <div className="px-3 py-1.5 border-t border-gray-800/50 flex-shrink-0">
          <div className="flex flex-wrap gap-1.5">
            {attachments.map((att, i) => (
              <span key={`fwd-${att.id}-${i}`} className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-300 border border-gray-700">
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
            {uploadedAttachments.map((att, i) => (
              <span key={`upl-${att.filename}-${i}`} className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-300 border border-blue-700/50">
                <svg className="w-3 h-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                <span className="max-w-[150px] truncate">{att.filename}</span>
                <span className="text-gray-500">({formatSize(att.size)})</span>
                <button
                  onClick={() => setUploadedAttachments(prev => prev.filter((_, idx) => idx !== i))}
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
            setTo(""); setCc(""); setBcc(""); setSubject(""); setBody(""); setDraftId(""); setAttachments([]); setUploadedAttachments([]);
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
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-1.5 text-gray-400 hover:text-gray-200 transition-colors"
          title="Attach files"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
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
