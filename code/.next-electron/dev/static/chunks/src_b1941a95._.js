(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/store/index.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAppStore",
    ()=>useAppStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
;
const useAppStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])((set, get)=>({
        // Theme
        theme: ("TURBOPACK compile-time truthy", 1) ? localStorage.getItem("theme") || "dark" : "TURBOPACK unreachable",
        setTheme: (theme)=>{
            set({
                theme
            });
            if ("TURBOPACK compile-time truthy", 1) localStorage.setItem("theme", theme);
        },
        cycleTheme: ()=>{
            const order = [
                "dark",
                "light",
                "system"
            ];
            const { theme } = get();
            const next = order[(order.indexOf(theme) + 1) % order.length];
            get().setTheme(next);
        },
        // Folder
        activeFolder: "inbox",
        setActiveFolder: (folder)=>{
            set({
                activeFolder: folder,
                selectedIndex: -1,
                openThread: null
            });
        },
        // Thread list
        threads: [],
        selectedIndex: -1,
        setThreads: (threads)=>set({
                threads
            }),
        selectNext: ()=>{
            const { selectedIndex, threads } = get();
            if (selectedIndex < threads.length - 1) set({
                selectedIndex: selectedIndex + 1
            });
        },
        selectPrevious: ()=>{
            const { selectedIndex } = get();
            if (selectedIndex > 0) set({
                selectedIndex: selectedIndex - 1
            });
        },
        setSelectedIndex: (index)=>set({
                selectedIndex: index
            }),
        // Open thread
        openThread: null,
        setOpenThread: (thread)=>{
            set({
                openThread: thread
            });
        },
        // Draft reply
        composeDraft: "",
        composeSubject: "",
        composeToEmail: null,
        composeCc: "",
        composeBcc: "",
        composeDraftId: "",
        composeAttachments: [],
        setDraft: (opts)=>set({
                composeDraft: opts.body !== undefined ? opts.body : get().composeDraft,
                composeSubject: opts.subject !== undefined ? opts.subject : get().composeSubject,
                composeToEmail: opts.to !== undefined ? opts.to : get().composeToEmail,
                composeCc: opts.cc !== undefined ? opts.cc : get().composeCc,
                composeBcc: opts.bcc !== undefined ? opts.bcc : get().composeBcc,
                composeDraftId: opts.draftId !== undefined ? opts.draftId : get().composeDraftId,
                composeAttachments: opts.attachments !== undefined ? opts.attachments : get().composeAttachments
            }),
        clearDraft: ()=>set({
                composeDraft: "",
                composeSubject: "",
                composeToEmail: null,
                composeCc: "",
                composeBcc: "",
                composeDraftId: "",
                composeAttachments: []
            }),
        // Compose modal
        isComposeOpen: false,
        openCompose: (opts)=>set({
                isComposeOpen: true,
                composeDraft: opts?.draft || "",
                composeSubject: opts?.subject || "",
                composeToEmail: opts?.to ?? null,
                composeCc: opts?.cc || "",
                composeBcc: opts?.bcc || ""
            }),
        closeCompose: ()=>set({
                isComposeOpen: false,
                composeDraft: "",
                composeSubject: "",
                composeToEmail: null,
                composeCc: "",
                composeBcc: "",
                composeDraftId: "",
                composeAttachments: []
            }),
        // Compose queue
        composeQueue: [],
        activeComposeIndex: 0,
        setActiveComposeIndex: (index)=>set({
                activeComposeIndex: index
            }),
        updateQueueEntry: (index, draft)=>{
            const updated = [
                ...get().composeQueue
            ];
            if (index >= 0 && index < updated.length) {
                updated[index] = draft;
                set({
                    composeQueue: updated
                });
            }
        },
        removeQueueEntry: (index)=>{
            const { composeQueue, activeComposeIndex } = get();
            if (composeQueue.length <= 1) {
                set({
                    composeQueue: [],
                    activeComposeIndex: 0
                });
                return;
            }
            const updated = composeQueue.filter((_, i)=>i !== index);
            let newIndex = activeComposeIndex;
            if (index < activeComposeIndex) newIndex--;
            else if (index === activeComposeIndex) newIndex = Math.min(newIndex, updated.length - 1);
            set({
                composeQueue: updated,
                activeComposeIndex: newIndex
            });
        },
        // Search
        searchQuery: "",
        setSearchQuery: (query)=>set({
                searchQuery: query
            }),
        // Shortcut help
        showShortcutHelp: false,
        toggleShortcutHelp: ()=>set((state)=>({
                    showShortcutHelp: !state.showShortcutHelp
                })),
        // CLI refresh
        refreshCounter: 0,
        triggerRefresh: ()=>set((state)=>({
                    refreshCounter: state.refreshCounter + 1,
                    openThread: null,
                    composeDraft: "",
                    composeSubject: "",
                    composeToEmail: null,
                    composeCc: "",
                    composeBcc: "",
                    composeDraftId: "",
                    composeAttachments: []
                })),
        threadRefreshCounter: 0,
        triggerThreadRefresh: ()=>set((state)=>({
                    threadRefreshCounter: state.threadRefreshCounter + 1
                })),
        focusedPanel: "threads",
        setFocusedPanel: (panel)=>set({
                focusedPanel: panel
            }),
        cycleFocusedPanel: ()=>set((state)=>{
                const order = [
                    "threads",
                    "email",
                    "terminal"
                ];
                const idx = order.indexOf(state.focusedPanel);
                return {
                    focusedPanel: order[(idx + 1) % order.length]
                };
            }),
        discardedThreadIds: new Set(),
        discardThread: (id)=>{
            set((state)=>({
                    discardedThreadIds: new Set([
                        ...state.discardedThreadIds,
                        id
                    ])
                }));
            // Clear after 30s — by then Gmail will have processed the label change
            setTimeout(()=>{
                set((state)=>{
                    const next = new Set(state.discardedThreadIds);
                    next.delete(id);
                    return {
                        discardedThreadIds: next
                    };
                });
            }, 30_000);
        },
        markedReadIds: new Set(),
        markThreadRead: (id)=>{
            set((state)=>({
                    markedReadIds: new Set([
                        ...state.markedReadIds,
                        id
                    ])
                }));
            setTimeout(()=>{
                set((state)=>{
                    const next = new Set(state.markedReadIds);
                    next.delete(id);
                    return {
                        markedReadIds: next
                    };
                });
            }, 30_000);
        }
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useKeyboardShortcuts.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useKeyboardShortcuts",
    ()=>useKeyboardShortcuts
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/index.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function useKeyboardShortcuts() {
    _s();
    const pendingKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const pendingTimeout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useKeyboardShortcuts.useEffect": ()=>{
            function handleKeyDown(e) {
                const tag = e.target.tagName;
                if (tag === "INPUT" || tag === "TEXTAREA" || e.target.isContentEditable) {
                    if (e.key === "Escape") {
                        e.target.blur();
                        e.preventDefault();
                    }
                    return;
                }
                // All data reads must use getState() to avoid stale closures
                const s = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState();
                // Handle 'g' prefix sequences
                if (pendingKey.current === "g") {
                    pendingKey.current = null;
                    if (pendingTimeout.current) clearTimeout(pendingTimeout.current);
                    switch(e.key){
                        case "i":
                            s.setActiveFolder("inbox");
                            break;
                        case "s":
                            s.setActiveFolder("sent");
                            break;
                        case "d":
                            s.setActiveFolder("drafts");
                            break;
                        case "a":
                            s.setActiveFolder("archive");
                            break;
                        case "n":
                            s.setActiveFolder("done");
                            break;
                        case "p":
                            s.setActiveFolder("promotions");
                            break;
                    }
                    e.preventDefault();
                    return;
                }
                switch(e.key){
                    case "j":
                        s.selectNext();
                        {
                            const fresh = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState();
                            if (fresh.threads[fresh.selectedIndex]) fresh.setOpenThread(fresh.threads[fresh.selectedIndex]);
                        }
                        e.preventDefault();
                        break;
                    case "k":
                        s.selectPrevious();
                        {
                            const fresh = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState();
                            if (fresh.threads[fresh.selectedIndex]) fresh.setOpenThread(fresh.threads[fresh.selectedIndex]);
                        }
                        e.preventDefault();
                        break;
                    case "Enter":
                        if (s.threads[s.selectedIndex]) {
                            s.setOpenThread(s.threads[s.selectedIndex]);
                        }
                        e.preventDefault();
                        break;
                    case "Escape":
                        if (s.isComposeOpen) {
                            s.closeCompose();
                        } else if (s.searchQuery) {
                            s.setSearchQuery("");
                        } else {
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].setState({
                                openThread: null,
                                selectedIndex: -1
                            });
                        }
                        e.preventDefault();
                        break;
                    case "e":
                        if (s.openThread) {
                            s.discardThread(s.openThread.id);
                            archiveThread(s.openThread.id);
                            s.setOpenThread(null);
                        }
                        e.preventDefault();
                        break;
                    case "d":
                        {
                            if (s.openThread) {
                                if (s.activeFolder === "done") {
                                    moveToInboxThread(s.openThread.id);
                                } else {
                                    s.discardThread(s.openThread.id);
                                    moveToDoneThread(s.openThread.id);
                                }
                                const currentIndex = s.threads.findIndex({
                                    "useKeyboardShortcuts.useEffect.handleKeyDown.currentIndex": (t)=>t.id === s.openThread.id
                                }["useKeyboardShortcuts.useEffect.handleKeyDown.currentIndex"]);
                                const newThreads = s.threads.filter({
                                    "useKeyboardShortcuts.useEffect.handleKeyDown.newThreads": (t)=>t.id !== s.openThread.id
                                }["useKeyboardShortcuts.useEffect.handleKeyDown.newThreads"]);
                                const nextIndex = newThreads.length === 0 ? -1 : Math.min(currentIndex, newThreads.length - 1);
                                const nextThread = nextIndex >= 0 ? newThreads[nextIndex] : null;
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].setState({
                                    threads: newThreads,
                                    selectedIndex: nextIndex,
                                    openThread: nextThread
                                });
                            }
                            e.preventDefault();
                            break;
                        }
                    case "r":
                        if (s.openThread) {
                            const latest = s.openThread.messages[s.openThread.messages.length - 1];
                            s.setDraft({
                                body: "",
                                subject: `Re: ${s.openThread.subject}`,
                                to: latest.from.email
                            });
                            setTimeout({
                                "useKeyboardShortcuts.useEffect.handleKeyDown": ()=>document.getElementById("draft-body")?.focus()
                            }["useKeyboardShortcuts.useEffect.handleKeyDown"], 50);
                        }
                        e.preventDefault();
                        break;
                    case "c":
                        if (e.metaKey || e.ctrlKey) break;
                        s.openCompose({
                            mode: "new"
                        });
                        e.preventDefault();
                        break;
                    case "/":
                        document.getElementById("search-input")?.focus();
                        e.preventDefault();
                        break;
                    case "t":
                        s.cycleTheme();
                        e.preventDefault();
                        break;
                    case "u":
                        {
                            if (s.openThread) {
                                toggleReadUnread(s.openThread.id, s.openThread.isRead);
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].setState({
                                    openThread: {
                                        ...s.openThread,
                                        isRead: !s.openThread.isRead
                                    },
                                    threads: s.threads.map({
                                        "useKeyboardShortcuts.useEffect.handleKeyDown": (t)=>t.id === s.openThread.id ? {
                                                ...t,
                                                isRead: !s.openThread.isRead
                                            } : t
                                    }["useKeyboardShortcuts.useEffect.handleKeyDown"])
                                });
                            }
                            e.preventDefault();
                            break;
                        }
                    case "?":
                        s.toggleShortcutHelp();
                        e.preventDefault();
                        break;
                    case "g":
                        pendingKey.current = "g";
                        pendingTimeout.current = setTimeout({
                            "useKeyboardShortcuts.useEffect.handleKeyDown": ()=>{
                                pendingKey.current = null;
                            }
                        }["useKeyboardShortcuts.useEffect.handleKeyDown"], 1000);
                        e.preventDefault();
                        break;
                }
            }
            document.addEventListener("keydown", handleKeyDown);
            // Listen for Electron's Ctrl+Tab cycle-panel event
            function handleCyclePanel() {
                const s = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState();
                s.cycleFocusedPanel();
                const panel = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().focusedPanel;
                const iframe = document.querySelector('iframe[title="Terminal"]');
                // Blur everything first
                if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
                if (iframe) iframe.blur();
                if (panel === "terminal" && iframe) {
                    iframe.focus();
                } else if (panel === "email") {
                    const draft = document.getElementById("draft-body");
                    if (draft) draft.focus();
                    else document.body.focus();
                } else {
                    // threads — just focus body, not the search input
                    document.body.focus();
                }
            }
            window.addEventListener("cycle-panel", handleCyclePanel);
            return ({
                "useKeyboardShortcuts.useEffect": ()=>{
                    document.removeEventListener("keydown", handleKeyDown);
                    window.removeEventListener("cycle-panel", handleCyclePanel);
                }
            })["useKeyboardShortcuts.useEffect"];
        }
    }["useKeyboardShortcuts.useEffect"], []);
}
_s(useKeyboardShortcuts, "aS+sU+pOtpfrEwFh0zTlSRs2oGs=");
async function toggleReadUnread(threadId, isCurrentlyRead) {
    try {
        await fetch(`/api/emails/${threadId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: isCurrentlyRead ? "markAsUnread" : "markAsRead"
            })
        });
    } catch (error) {
        console.error("Failed to toggle read/unread:", error);
    }
}
async function moveToDoneThread(threadId) {
    try {
        await fetch(`/api/emails/${threadId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: "moveToDone"
            })
        });
    } catch (error) {
        console.error("Failed to move to done:", error);
    }
}
async function moveToInboxThread(threadId) {
    try {
        await fetch(`/api/emails/${threadId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: "moveToInbox"
            })
        });
    } catch (error) {
        console.error("Failed to move to inbox:", error);
    }
}
async function archiveThread(threadId) {
    try {
        await fetch(`/api/emails/${threadId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: "archive"
            })
        });
    } catch (error) {
        console.error("Failed to archive:", error);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useCliEvents.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCliEvents",
    ()=>useCliEvents
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/index.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
/**
 * Process a single CLI event and update the store.
 */ async function handleCliEvent(data) {
    switch(data.type){
        case "set-draft":
            {
                const state = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState();
                // Convert HTML to plain text for textarea display
                const plainBody = (data.body || "").replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]*>/g, "");
                // Always set compose fields directly — single drafts don't use the queue
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].setState({
                    composeDraft: plainBody,
                    composeSubject: data.subject || state.composeSubject,
                    composeToEmail: data.to || state.composeToEmail,
                    composeCc: data.cc || state.composeCc,
                    composeBcc: data.bcc || state.composeBcc,
                    composeAttachments: data.attachments || state.composeAttachments
                });
                break;
            }
        case "set-drafts":
            {
                const drafts = (data.drafts || []).map((d)=>({
                        to: d.to || "",
                        cc: d.cc || "",
                        bcc: d.bcc || "",
                        subject: d.subject || "",
                        body: (d.body || "").replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]*>/g, ""),
                        attachments: d.attachments || []
                    }));
                if (drafts.length > 0) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].setState({
                        composeQueue: drafts,
                        activeComposeIndex: drafts.length - 1
                    });
                }
                break;
            }
        case "open-thread":
            {
                const res = await fetch(`/api/emails/${data.threadId}`);
                if (res.ok) {
                    const thread = await res.json();
                    // Clear selected index to prevent keyboard shortcuts from overriding
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].setState({
                        openThread: thread,
                        selectedIndex: -1
                    });
                }
                break;
            }
        case "move-to-done":
            {
                const res = await fetch(`/api/emails/${data.threadId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        action: "moveToDone"
                    })
                });
                if (res.ok) {
                    const state = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState();
                    state.discardThread(data.threadId);
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].setState({
                        threads: state.threads.filter((t)=>t.id !== data.threadId),
                        openThread: state.openThread?.id === data.threadId ? null : state.openThread
                    });
                }
                break;
            }
        case "refresh":
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().triggerRefresh();
            break;
        case "set-theme":
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().setTheme(data.theme);
            break;
        case "connected":
        case "ping":
            break;
    }
}
function useCliEvents() {
    _s();
    const pollTsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(Date.now());
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useCliEvents.useEffect": ()=>{
            let sseAlive = false;
            // --- SSE primary channel ---
            const es = new EventSource("/api/cli/events");
            es.onmessage = ({
                "useCliEvents.useEffect": async (event)=>{
                    sseAlive = true;
                    try {
                        const data = JSON.parse(event.data);
                        await handleCliEvent(data);
                    } catch (e) {
                        console.error("CLI event parse error:", e);
                    }
                }
            })["useCliEvents.useEffect"];
            es.onerror = ({
                "useCliEvents.useEffect": ()=>{
                    sseAlive = false;
                }
            })["useCliEvents.useEffect"];
            // --- Polling fallback (catches events missed during SSE disconnects) ---
            const pollInterval = setInterval({
                "useCliEvents.useEffect.pollInterval": async ()=>{
                    // Only poll if SSE seems unhealthy
                    if (sseAlive && es.readyState === EventSource.OPEN) return;
                    try {
                        const res = await fetch(`/api/cli/poll?since=${pollTsRef.current}`);
                        if (!res.ok) return;
                        const { events, lastTs } = await res.json();
                        if (lastTs) pollTsRef.current = lastTs;
                        for (const evt of events){
                            await handleCliEvent(evt);
                        }
                    } catch  {
                    // Network error — ignore, will retry next interval
                    }
                }
            }["useCliEvents.useEffect.pollInterval"], 2000);
            return ({
                "useCliEvents.useEffect": ()=>{
                    es.close();
                    clearInterval(pollInterval);
                }
            })["useCliEvents.useEffect"];
        }
    }["useCliEvents.useEffect"], []);
}
_s(useCliEvents, "3OaR/qjxP47rtM1uX6tGP5FNk0U=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useTheme.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useTheme",
    ()=>useTheme
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/index.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function useTheme() {
    _s();
    const theme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "useTheme.useAppStore[theme]": (s)=>s.theme
    }["useTheme.useAppStore[theme]"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useTheme.useEffect": ()=>{
            const root = document.documentElement;
            function applyTheme(t) {
                root.classList.remove("dark", "light");
                root.classList.add(t);
            }
            if (theme === "system") {
                const mq = window.matchMedia("(prefers-color-scheme: dark)");
                applyTheme(mq.matches ? "dark" : "light");
                const handler = {
                    "useTheme.useEffect.handler": (e)=>applyTheme(e.matches ? "dark" : "light")
                }["useTheme.useEffect.handler"];
                mq.addEventListener("change", handler);
                return ({
                    "useTheme.useEffect": ()=>mq.removeEventListener("change", handler)
                })["useTheme.useEffect"];
            } else {
                applyTheme(theme);
            }
        }
    }["useTheme.useEffect"], [
        theme
    ]);
}
_s(useTheme, "nlj4mnNwTdZLuR8IXnVanwNTiE4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useStateSync.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useStateSync",
    ()=>useStateSync
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/index.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function useStateSync() {
    _s();
    const openThread = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "useStateSync.useAppStore[openThread]": (s)=>s.openThread
    }["useStateSync.useAppStore[openThread]"]);
    const activeFolder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "useStateSync.useAppStore[activeFolder]": (s)=>s.activeFolder
    }["useStateSync.useAppStore[activeFolder]"]);
    const selectedIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "useStateSync.useAppStore[selectedIndex]": (s)=>s.selectedIndex
    }["useStateSync.useAppStore[selectedIndex]"]);
    const theme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "useStateSync.useAppStore[theme]": (s)=>s.theme
    }["useStateSync.useAppStore[theme]"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useStateSync.useEffect": ()=>{
            const state = {
                openThread: openThread ? {
                    id: openThread.id,
                    subject: openThread.subject,
                    messageCount: openThread.messageCount,
                    latestDate: openThread.latestDate,
                    participants: openThread.participants,
                    messages: openThread.messages.map({
                        "useStateSync.useEffect": (m)=>({
                                id: m.id,
                                from: m.from,
                                to: m.to,
                                cc: m.cc,
                                subject: m.subject,
                                snippet: m.snippet,
                                body: m.body,
                                date: m.date
                            })
                    }["useStateSync.useEffect"])
                } : null,
                activeFolder,
                selectedIndex,
                theme
            };
            fetch("/api/cli/state", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(state)
            }).catch({
                "useStateSync.useEffect": ()=>{}
            }["useStateSync.useEffect"]);
        }
    }["useStateSync.useEffect"], [
        openThread,
        activeFolder,
        selectedIndex,
        theme
    ]);
}
_s(useStateSync, "y8tGPEjLQvsskG8tEXgNNwmEfYM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useEmails.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useThreadDetail",
    ()=>useThreadDetail,
    "useThreads",
    ()=>useThreads
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$index$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/swr/dist/index/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/index.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
;
;
const EMPTY_THREADS = [];
const PAGE_SIZE = 10;
const fetcher = async (url)=>{
    const res = await fetch(url);
    if (res.status === 403) {
        const body = await res.json().catch(()=>({}));
        const err = new Error(body?.error || "Forbidden");
        err.status = 403;
        throw err;
    }
    if (res.status === 401) {
        const err = new Error("Unauthorized");
        err.status = 401;
        throw err;
    }
    return res.json();
};
function useThreads() {
    _s();
    const activeFolder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "useThreads.useAppStore[activeFolder]": (s)=>s.activeFolder
    }["useThreads.useAppStore[activeFolder]"]);
    const searchQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "useThreads.useAppStore[searchQuery]": (s)=>s.searchQuery
    }["useThreads.useAppStore[searchQuery]"]);
    const refreshCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "useThreads.useAppStore[refreshCounter]": (s)=>s.refreshCounter
    }["useThreads.useAppStore[refreshCounter]"]);
    // Debounce search query so we don't fire on every keystroke
    const [debouncedQuery, setDebouncedQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(searchQuery);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useThreads.useEffect": ()=>{
            const t = setTimeout({
                "useThreads.useEffect.t": ()=>setDebouncedQuery(searchQuery)
            }["useThreads.useEffect.t"], 400);
            return ({
                "useThreads.useEffect": ()=>clearTimeout(t)
            })["useThreads.useEffect"];
        }
    }["useThreads.useEffect"], [
        searchQuery
    ]);
    // Include refreshCounter in the SWR key so CLI refresh busts the cache
    const swrKey = debouncedQuery ? `/api/emails?folder=${activeFolder}&maxResults=${PAGE_SIZE}&q=${encodeURIComponent(debouncedQuery)}&_r=${refreshCounter}` : `/api/emails?folder=${activeFolder}&maxResults=${PAGE_SIZE}&_r=${refreshCounter}`;
    const { data, error, isLoading, mutate } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$index$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"])(swrKey, fetcher, {
        revalidateOnFocus: true,
        refreshInterval: 15000,
        dedupingInterval: 3000
    });
    const [extraThreads, setExtraThreads] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [nextPageToken, setNextPageToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(undefined);
    const [loadingMore, setLoadingMore] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const loadingMoreRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const prevFolderRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(activeFolder);
    const prevQueryRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(debouncedQuery);
    // Reset when folder or search query changes
    if (activeFolder !== prevFolderRef.current || debouncedQuery !== prevQueryRef.current) {
        prevFolderRef.current = activeFolder;
        prevQueryRef.current = debouncedQuery;
        setExtraThreads([]);
        setNextPageToken(undefined);
    }
    // Sync nextPageToken from initial SWR data, and clear stale extra threads
    // when the first page changes (new emails arrived, pagination shifted)
    const prevFirstPageIds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])("");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useThreads.useEffect": ()=>{
            if (!data) return;
            if (data.nextPageToken) setNextPageToken(data.nextPageToken);
            const ids = (data.threads || []).map({
                "useThreads.useEffect.ids": (t)=>t.id
            }["useThreads.useEffect.ids"]).join(",");
            if (prevFirstPageIds.current && ids !== prevFirstPageIds.current && extraThreads.length > 0) {
                setExtraThreads([]);
            }
            prevFirstPageIds.current = ids;
        }
    }["useThreads.useEffect"], [
        data
    ]);
    const baseThreads = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useThreads.useMemo[baseThreads]": ()=>data?.threads ?? EMPTY_THREADS
    }["useThreads.useMemo[baseThreads]"], [
        data?.threads
    ]);
    const threads = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useThreads.useMemo[threads]": ()=>{
            // Deduplicate all threads by ID to prevent React key collisions
            // (can happen with virtual thread IDs from subject splitting + extraThreads overlap)
            const seen = new Set();
            const dedup = {
                "useThreads.useMemo[threads].dedup": (list)=>list.filter({
                        "useThreads.useMemo[threads].dedup": (t)=>{
                            if (seen.has(t.id)) return false;
                            seen.add(t.id);
                            return true;
                        }
                    }["useThreads.useMemo[threads].dedup"])
            }["useThreads.useMemo[threads].dedup"];
            if (extraThreads.length === 0) return dedup(baseThreads);
            return dedup([
                ...baseThreads,
                ...extraThreads
            ]);
        }
    }["useThreads.useMemo[threads]"], [
        baseThreads,
        extraThreads
    ]);
    const hasMore = !!nextPageToken;
    const loadMore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useThreads.useCallback[loadMore]": async ()=>{
            if (loadingMoreRef.current || !nextPageToken) return;
            loadingMoreRef.current = true;
            setLoadingMore(true);
            try {
                const res = await fetch(`/api/emails?folder=${activeFolder}&maxResults=${PAGE_SIZE}&pageToken=${nextPageToken}`);
                const result = await res.json();
                setNextPageToken(result.nextPageToken || undefined);
                setExtraThreads({
                    "useThreads.useCallback[loadMore]": (prev)=>[
                            ...prev,
                            ...result.threads || []
                        ]
                }["useThreads.useCallback[loadMore]"]);
            } catch (err) {
                console.error("Failed to load more threads:", err);
            } finally{
                loadingMoreRef.current = false;
                setLoadingMore(false);
            }
        }
    }["useThreads.useCallback[loadMore]"], [
        activeFolder,
        nextPageToken
    ]);
    return {
        threads,
        isLoading,
        loadingMore,
        hasMore,
        loadMore,
        error,
        refresh: mutate
    };
}
_s(useThreads, "gjgfDlZpxFE858NkqHuNVjD+Iqk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$index$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"]
    ];
});
function useThreadDetail(threadId) {
    _s1();
    const threadRefreshCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "useThreadDetail.useAppStore[threadRefreshCounter]": (s)=>s.threadRefreshCounter
    }["useThreadDetail.useAppStore[threadRefreshCounter]"]);
    const { data, error, isLoading, mutate } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$index$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"])(threadId ? `/api/emails/${threadId}?_r=${threadRefreshCounter}` : null, fetcher);
    return {
        thread: data,
        isLoading,
        error,
        mutate
    };
}
_s1(useThreadDetail, "4HcxKwM52fx8s+iIifmn39mI6kw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$index$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/Sidebar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Sidebar",
    ()=>Sidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/react.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/index.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const folders = [
    {
        key: "inbox",
        label: "Inbox",
        shortcut: "g i"
    },
    {
        key: "promotions",
        label: "Promotions",
        shortcut: "g p"
    },
    {
        key: "done",
        label: "Done",
        shortcut: "g n"
    },
    {
        key: "sent",
        label: "Sent",
        shortcut: "g s"
    },
    {
        key: "drafts",
        label: "Drafts",
        shortcut: "g d"
    },
    {
        key: "archive",
        label: "Archive",
        shortcut: "g a"
    }
];
function Sidebar() {
    _s();
    const activeFolder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "Sidebar.useAppStore[activeFolder]": (s)=>s.activeFolder
    }["Sidebar.useAppStore[activeFolder]"]);
    const setActiveFolder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "Sidebar.useAppStore[setActiveFolder]": (s)=>s.setActiveFolder
    }["Sidebar.useAppStore[setActiveFolder]"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: "w-44 bg-gray-900 border-r border-gray-800 flex flex-col py-2 h-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pb-1 mb-1 border-b border-gray-800"
            }, void 0, false, {
                fileName: "[project]/src/components/layout/Sidebar.tsx",
                lineNumber: 21,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "flex-1",
                children: folders.map((f)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveFolder(f.key),
                        className: `w-full flex items-center justify-between px-3 py-2 text-sm transition-colors ${activeFolder === f.key ? "bg-gray-800 text-white font-medium" : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: f.label
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/Sidebar.tsx",
                                lineNumber: 33,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-gray-600",
                                children: f.shortcut
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/Sidebar.tsx",
                                lineNumber: 34,
                                columnNumber: 13
                            }, this)
                        ]
                    }, f.key, true, {
                        fileName: "[project]/src/components/layout/Sidebar.tsx",
                        lineNumber: 24,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/layout/Sidebar.tsx",
                lineNumber: 22,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-3 py-2 border-t border-gray-800 space-y-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().openCompose({
                                mode: "new"
                            }),
                        className: "w-full py-2 btn-accent text-sm font-medium rounded-md transition-colors",
                        children: "Compose (c)"
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/Sidebar.tsx",
                        lineNumber: 39,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signOut"])({
                                callbackUrl: "/api/auth/signin"
                            }),
                        className: "w-full py-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors",
                        children: "Sign Out"
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/Sidebar.tsx",
                        lineNumber: 45,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/layout/Sidebar.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/Sidebar.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
_s(Sidebar, "Z+WcNzyq3IyCQ+OJJu5OkPlcFxY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"]
    ];
});
_c = Sidebar;
var _c;
__turbopack_context__.k.register(_c, "Sidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/inbox/ThreadRow.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadRow",
    ()=>ThreadRow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/index.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function formatDate(dateStr) {
    try {
        const date = new Date(dateStr);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();
        if (isToday) {
            return date.toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit"
            });
        }
        return date.toLocaleDateString([], {
            month: "short",
            day: "numeric"
        });
    } catch  {
        return dateStr;
    }
}
function decodeHtmlEntities(text) {
    const entities = {
        "&amp;": "&",
        "&lt;": "<",
        "&gt;": ">",
        "&quot;": '"',
        "&#39;": "'",
        "&apos;": "'"
    };
    return text.replace(/&(?:amp|lt|gt|quot|apos|#39);/g, (m)=>entities[m] || m).replace(/&#(\d+);/g, (_, n)=>String.fromCharCode(+n)).replace(/&#x([0-9a-fA-F]+);/g, (_, h)=>String.fromCharCode(parseInt(h, 16)));
}
function participantNames(thread, showRecipients) {
    const seen = new Set();
    const names = [];
    for (const msg of thread.messages){
        const addrs = showRecipients ? msg.to : [
            msg.from
        ];
        for (const addr of addrs){
            const display = addr.name || addr.email.split("@")[0];
            if (!seen.has(display)) {
                seen.add(display);
                names.push(display);
            }
        }
    }
    if (names.length === 0) return thread.participants.map((p)=>p.name || p.email.split("@")[0]).join(", ");
    if (names.length <= 3) return names.join(", ");
    return `${names.slice(0, 2).join(", ")} +${names.length - 2}`;
}
function ThreadRow({ thread, index, isSelected, onDiscard }) {
    _s();
    const setSelectedIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ThreadRow.useAppStore[setSelectedIndex]": (s)=>s.setSelectedIndex
    }["ThreadRow.useAppStore[setSelectedIndex]"]);
    const setOpenThread = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ThreadRow.useAppStore[setOpenThread]": (s)=>s.setOpenThread
    }["ThreadRow.useAppStore[setOpenThread]"]);
    const activeFolder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ThreadRow.useAppStore[activeFolder]": (s)=>s.activeFolder
    }["ThreadRow.useAppStore[activeFolder]"]);
    const [discarding, setDiscarding] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const isDrafts = activeFolder === "drafts";
    async function handleDiscard(e) {
        e.stopPropagation();
        if (discarding) return;
        setDiscarding(true);
        try {
            // The thread in drafts folder — find the draft message ID to delete
            // Gmail drafts: the thread contains a draft message. We need the draft ID.
            // We'll use the thread ID to find and delete the draft via the API.
            const res = await fetch(`/api/drafts/thread?threadId=${thread.id}`);
            const data = await res.json();
            if (data.draft?.id) {
                await fetch(`/api/drafts?draftId=${data.draft.id}`, {
                    method: "DELETE"
                });
            }
            onDiscard?.(thread.id);
        } catch (err) {
            console.error("Failed to discard draft:", err);
        } finally{
            setDiscarding(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative group",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>{
                    setSelectedIndex(index);
                    setOpenThread(thread);
                },
                className: `w-full text-left px-3 py-2.5 border-b border-gray-800/50 transition-colors ${isSelected ? "bg-[var(--btn)] border-l-2 border-l-[var(--btn-hover)]" : "hover:bg-gray-800/30 border-l-2 border-l-transparent"} ${!thread.isRead ? "font-bold" : ""}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `text-sm truncate ${isSelected ? "text-[var(--btn-text)]" : !thread.isRead ? "text-white font-bold" : "text-gray-300"}`,
                                children: participantNames(thread, activeFolder === "drafts" || activeFolder === "sent")
                            }, void 0, false, {
                                fileName: "[project]/src/components/inbox/ThreadRow.tsx",
                                lineNumber: 101,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1.5 flex-shrink-0",
                                children: [
                                    thread.hasAttachments && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: `w-3.5 h-3.5 ${isSelected ? "text-[var(--btn-text)] opacity-70" : "text-gray-500"}`,
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        stroke: "currentColor",
                                        strokeWidth: 2,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            d: "M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/inbox/ThreadRow.tsx",
                                            lineNumber: 107,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/inbox/ThreadRow.tsx",
                                        lineNumber: 106,
                                        columnNumber: 15
                                    }, this),
                                    thread.messageCount > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `text-xs px-1.5 rounded ${isSelected ? "text-[var(--btn-text)] bg-[var(--btn-hover)]" : "text-gray-500 bg-gray-800"}`,
                                        children: thread.messageCount
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/inbox/ThreadRow.tsx",
                                        lineNumber: 111,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `text-xs ${isSelected ? "text-[var(--btn-text)] opacity-70" : "text-gray-500"}`,
                                        children: formatDate(thread.latestDate)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/inbox/ThreadRow.tsx",
                                        lineNumber: 115,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/inbox/ThreadRow.tsx",
                                lineNumber: 104,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/inbox/ThreadRow.tsx",
                        lineNumber: 100,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `text-sm truncate mt-0.5 ${isSelected ? "text-[var(--btn-text)]" : !thread.isRead ? "text-white" : "text-gray-400"}`,
                        children: thread.subject
                    }, void 0, false, {
                        fileName: "[project]/src/components/inbox/ThreadRow.tsx",
                        lineNumber: 120,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `text-xs truncate mt-0.5 ${isSelected ? "text-[var(--btn-text)] opacity-60" : "text-gray-600"}`,
                        children: decodeHtmlEntities(thread.snippet)
                    }, void 0, false, {
                        fileName: "[project]/src/components/inbox/ThreadRow.tsx",
                        lineNumber: 123,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/inbox/ThreadRow.tsx",
                lineNumber: 89,
                columnNumber: 7
            }, this),
            isDrafts && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleDiscard,
                disabled: discarding,
                title: "Discard draft",
                className: "absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-red-500 text-gray-500 dark:text-gray-400 hover:text-white",
                children: discarding ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: "w-4 h-4 animate-spin",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            cx: "12",
                            cy: "12",
                            r: "10",
                            stroke: "currentColor",
                            strokeWidth: "2",
                            opacity: "0.3"
                        }, void 0, false, {
                            fileName: "[project]/src/components/inbox/ThreadRow.tsx",
                            lineNumber: 138,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: "M4 12a8 8 0 018-8",
                            stroke: "currentColor",
                            strokeWidth: "2",
                            strokeLinecap: "round"
                        }, void 0, false, {
                            fileName: "[project]/src/components/inbox/ThreadRow.tsx",
                            lineNumber: 139,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/inbox/ThreadRow.tsx",
                    lineNumber: 137,
                    columnNumber: 13
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: "w-4 h-4",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    stroke: "currentColor",
                    strokeWidth: 2,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    }, void 0, false, {
                        fileName: "[project]/src/components/inbox/ThreadRow.tsx",
                        lineNumber: 143,
                        columnNumber: 15
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/inbox/ThreadRow.tsx",
                    lineNumber: 142,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/inbox/ThreadRow.tsx",
                lineNumber: 129,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/inbox/ThreadRow.tsx",
        lineNumber: 88,
        columnNumber: 5
    }, this);
}
_s(ThreadRow, "5bhp0wEixmvghU8TMpEPKo5tcGA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"]
    ];
});
_c = ThreadRow;
var _c;
__turbopack_context__.k.register(_c, "ThreadRow");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/inbox/ThreadList.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadList",
    ()=>ThreadList
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$inbox$2f$ThreadRow$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/inbox/ThreadRow.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function ThreadList({ isLoading, loadingMore, hasMore, onLoadMore }) {
    _s();
    const threads = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ThreadList.useAppStore[threads]": (s)=>s.threads
    }["ThreadList.useAppStore[threads]"]);
    const selectedIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ThreadList.useAppStore[selectedIndex]": (s)=>s.selectedIndex
    }["ThreadList.useAppStore[selectedIndex]"]);
    const setThreads = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ThreadList.useAppStore[setThreads]": (s)=>s.setThreads
    }["ThreadList.useAppStore[setThreads]"]);
    const listRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThreadList.useEffect": ()=>{
            const el = listRef.current?.children[selectedIndex];
            if (el) el.scrollIntoView({
                block: "nearest"
            });
        }
    }["ThreadList.useEffect"], [
        selectedIndex
    ]);
    // Infinite scroll: load more when near bottom
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThreadList.useEffect": ()=>{
            const el = listRef.current;
            if (!el) return;
            function handleScroll() {
                if (!el || loadingMore || !hasMore) return;
                const { scrollTop, scrollHeight, clientHeight } = el;
                if (scrollHeight - scrollTop - clientHeight < 100) {
                    onLoadMore();
                }
            }
            el.addEventListener("scroll", handleScroll);
            return ({
                "ThreadList.useEffect": ()=>el.removeEventListener("scroll", handleScroll)
            })["ThreadList.useEffect"];
        }
    }["ThreadList.useEffect"], [
        loadingMore,
        hasMore,
        onLoadMore
    ]);
    // When threads are removed (e.g. marked done), the list may shrink below the
    // viewport — trigger loadMore if there's more to fetch and content doesn't fill.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThreadList.useEffect": ()=>{
            const el = listRef.current;
            if (!el || loadingMore || !hasMore) return;
            const { scrollHeight, clientHeight } = el;
            if (scrollHeight <= clientHeight + 100) {
                onLoadMore();
            }
        }
    }["ThreadList.useEffect"], [
        threads.length,
        hasMore,
        loadingMore,
        onLoadMore
    ]);
    const handleDiscard = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ThreadList.useCallback[handleDiscard]": (threadId)=>{
            setThreads(threads.filter({
                "ThreadList.useCallback[handleDiscard]": (t)=>t.id !== threadId
            }["ThreadList.useCallback[handleDiscard]"]));
        }
    }["ThreadList.useCallback[handleDiscard]"], [
        threads,
        setThreads
    ]);
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex-1 flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-gray-500 text-sm",
                children: "Loading emails..."
            }, void 0, false, {
                fileName: "[project]/src/components/inbox/ThreadList.tsx",
                lineNumber: 66,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/inbox/ThreadList.tsx",
            lineNumber: 65,
            columnNumber: 7
        }, this);
    }
    if (threads.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex-1 flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-gray-600 text-sm",
                children: "No emails found"
            }, void 0, false, {
                fileName: "[project]/src/components/inbox/ThreadList.tsx",
                lineNumber: 74,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/inbox/ThreadList.tsx",
            lineNumber: 73,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: listRef,
        className: "flex-1 overflow-y-auto",
        children: [
            threads.map((thread, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$inbox$2f$ThreadRow$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThreadRow"], {
                    thread: thread,
                    index: index,
                    isSelected: index === selectedIndex,
                    onDiscard: handleDiscard
                }, thread.id, false, {
                    fileName: "[project]/src/components/inbox/ThreadList.tsx",
                    lineNumber: 82,
                    columnNumber: 9
                }, this)),
            loadingMore && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "py-3 text-center text-xs text-gray-500",
                children: "Loading more..."
            }, void 0, false, {
                fileName: "[project]/src/components/inbox/ThreadList.tsx",
                lineNumber: 91,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/inbox/ThreadList.tsx",
        lineNumber: 80,
        columnNumber: 5
    }, this);
}
_s(ThreadList, "2m8pxvnd6yzuf1GZB62TPWiRTZE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"]
    ];
});
_c = ThreadList;
var _c;
__turbopack_context__.k.register(_c, "ThreadList");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/email/ThreadView.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadView",
    ()=>ThreadView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$dompurify$2f$dist$2f$purify$2e$es$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/dompurify/dist/purify.es.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useEmails$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useEmails.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function ThreadView() {
    _s();
    const openThread = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ThreadView.useAppStore[openThread]": (s)=>s.openThread
    }["ThreadView.useAppStore[openThread]"]);
    const setOpenThread = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ThreadView.useAppStore[setOpenThread]": (s)=>s.setOpenThread
    }["ThreadView.useAppStore[setOpenThread]"]);
    const setDraft = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ThreadView.useAppStore[setDraft]": (s)=>s.setDraft
    }["ThreadView.useAppStore[setDraft]"]);
    const { thread: fullThread } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useEmails$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useThreadDetail"])(openThread?.id || null);
    const thread = fullThread || openThread;
    function handleForward() {
        if (!thread) return;
        const msg = thread.messages[thread.messages.length - 1];
        const date = new Date(msg.date).toLocaleString([], {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit"
        });
        const bodyText = msg.body ? msg.body.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]*>/g, "").replace(/\n{3,}/g, "\n\n").trim() : msg.snippet || "";
        const fwdBody = `\n\n---------- Forwarded message ---------\n` + `From: ${msg.from.name ? `${msg.from.name} <${msg.from.email}>` : msg.from.email}\n` + `Date: ${date}\n` + `Subject: ${msg.subject || thread.subject}\n` + `To: ${msg.to.map((a)=>a.name ? `${a.name} <${a.email}>` : a.email).join(", ")}\n\n` + bodyText;
        setDraft({
            subject: `Fwd: ${thread.subject}`,
            to: "",
            body: fwdBody
        });
    }
    // Mark thread as read and update list styling
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThreadView.useEffect": ()=>{
            if (thread && !thread.isRead) {
                fetch(`/api/emails/${thread.id}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        action: "markAsRead"
                    })
                }).catch(console.error);
                // Track this as locally marked read so SWR revalidation doesn't revert it
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().markThreadRead(thread.id);
                // Update the thread list so the bold/unread styling clears immediately
                const threads = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().threads;
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].setState({
                    openThread: {
                        ...thread,
                        isRead: true
                    },
                    threads: threads.map({
                        "ThreadView.useEffect": (t)=>t.id === thread.id ? {
                                ...t,
                                isRead: true
                            } : t
                    }["ThreadView.useEffect"])
                });
            }
        }
    }["ThreadView.useEffect"], [
        thread?.id,
        thread?.isRead
    ]);
    // Update the open thread data when full content loads (without resetting draft)
    // Preserve local isRead override — Gmail may not have processed markAsRead yet
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThreadView.useEffect": ()=>{
            if (fullThread) {
                const current = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().openThread;
                const merged = current?.isRead && !fullThread.isRead ? {
                    ...fullThread,
                    isRead: true
                } : fullThread;
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].setState({
                    openThread: merged
                });
            }
        }
    }["ThreadView.useEffect"], [
        fullThread
    ]);
    if (!thread) return null;
    const latest = thread.messages[thread.messages.length - 1];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col h-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 border-b border-gray-800 flex-shrink-0",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-start justify-between gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "min-w-0 flex-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-lg font-semibold text-white",
                                    children: thread.subject
                                }, void 0, false, {
                                    fileName: "[project]/src/components/email/ThreadView.tsx",
                                    lineNumber: 78,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-xs text-gray-500 mt-1",
                                    children: [
                                        thread.messageCount,
                                        " message",
                                        thread.messageCount !== 1 ? "s" : "",
                                        " ·",
                                        " ",
                                        thread.participants.slice(0, 4).map((p)=>p.name || p.email).join(", "),
                                        thread.participants.length > 4 && ` +${thread.participants.length - 4}`
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/email/ThreadView.tsx",
                                    lineNumber: 81,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/email/ThreadView.tsx",
                            lineNumber: 77,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleForward,
                            className: "flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-md transition-colors flex-shrink-0",
                            title: "Forward",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "w-3.5 h-3.5",
                                    fill: "none",
                                    viewBox: "0 0 24 24",
                                    stroke: "currentColor",
                                    strokeWidth: 2,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        d: "M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/email/ThreadView.tsx",
                                        lineNumber: 93,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/email/ThreadView.tsx",
                                    lineNumber: 92,
                                    columnNumber: 13
                                }, this),
                                "Forward"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/email/ThreadView.tsx",
                            lineNumber: 87,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/email/ThreadView.tsx",
                    lineNumber: 76,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/email/ThreadView.tsx",
                lineNumber: 75,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 min-h-0 overflow-y-auto",
                children: thread.messages.filter((msg)=>!msg.labels?.includes("DRAFT")).map((msg, i, filtered)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MessageCard, {
                        message: msg,
                        isLatest: i === filtered.length - 1,
                        hasBody: !!fullThread
                    }, msg.id, false, {
                        fileName: "[project]/src/components/email/ThreadView.tsx",
                        lineNumber: 105,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/email/ThreadView.tsx",
                lineNumber: 101,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/email/ThreadView.tsx",
        lineNumber: 73,
        columnNumber: 5
    }, this);
}
_s(ThreadView, "x8oNltLFqWxz7fN+H3Gsxgeqmuk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useEmails$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useThreadDetail"]
    ];
});
_c = ThreadView;
function MessageCard({ message, isLatest, hasBody }) {
    _s1();
    const setDraft = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "MessageCard.useAppStore[setDraft]": (s)=>s.setDraft
    }["MessageCard.useAppStore[setDraft]"]);
    const [collapsed, setCollapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    function handleReplyToMessage() {
        setDraft({
            to: message.from.email,
            subject: `Re: ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().openThread?.subject || message.subject}`,
            body: ""
        });
        setTimeout(()=>document.getElementById("draft-body")?.focus(), 50);
    }
    function formatDate(dateStr) {
        try {
            const date = new Date(dateStr);
            return date.toLocaleString([], {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit"
            });
        } catch  {
            return dateStr;
        }
    }
    if (collapsed) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: ()=>setCollapsed(false),
            className: "w-full text-left px-4 py-3 border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 min-w-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm font-medium text-gray-300 truncate",
                                children: message.from.name || message.from.email
                            }, void 0, false, {
                                fileName: "[project]/src/components/email/ThreadView.tsx",
                                lineNumber: 157,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-gray-600 truncate",
                                children: message.snippet
                            }, void 0, false, {
                                fileName: "[project]/src/components/email/ThreadView.tsx",
                                lineNumber: 160,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/email/ThreadView.tsx",
                        lineNumber: 156,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs text-gray-500 flex-shrink-0 ml-2",
                        children: formatDate(message.date)
                    }, void 0, false, {
                        fileName: "[project]/src/components/email/ThreadView.tsx",
                        lineNumber: 164,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/email/ThreadView.tsx",
                lineNumber: 155,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/email/ThreadView.tsx",
            lineNumber: 151,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "border-b border-gray-800/50",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>!isLatest && setCollapsed(true),
                className: `w-full text-left px-4 py-3 ${!isLatest ? "hover:bg-gray-800/30 cursor-pointer" : ""}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "min-w-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm font-medium text-gray-200",
                                        children: message.from.name || message.from.email
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/email/ThreadView.tsx",
                                        lineNumber: 181,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs text-gray-600 ml-2",
                                        children: [
                                            "<",
                                            message.from.email,
                                            ">"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/email/ThreadView.tsx",
                                        lineNumber: 184,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/email/ThreadView.tsx",
                                lineNumber: 180,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-gray-500 flex-shrink-0",
                                children: formatDate(message.date)
                            }, void 0, false, {
                                fileName: "[project]/src/components/email/ThreadView.tsx",
                                lineNumber: 188,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/email/ThreadView.tsx",
                        lineNumber: 179,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-xs text-gray-500 mt-0.5",
                        children: [
                            "To: ",
                            message.to.map((a)=>a.email).join(", "),
                            message.cc.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    " · Cc: ",
                                    message.cc.map((a)=>a.email).join(", ")
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/email/ThreadView.tsx",
                                lineNumber: 194,
                                columnNumber: 37
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/email/ThreadView.tsx",
                        lineNumber: 192,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/email/ThreadView.tsx",
                lineNumber: 175,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4 -mt-1 mb-1",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: (e)=>{
                        e.stopPropagation();
                        handleReplyToMessage();
                    },
                    className: "inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded px-1.5 py-0.5 transition-colors",
                    title: `Reply to ${message.from.name || message.from.email}`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "w-3 h-3",
                            fill: "none",
                            viewBox: "0 0 24 24",
                            stroke: "currentColor",
                            strokeWidth: 2,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                d: "M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                            }, void 0, false, {
                                fileName: "[project]/src/components/email/ThreadView.tsx",
                                lineNumber: 206,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/email/ThreadView.tsx",
                            lineNumber: 205,
                            columnNumber: 11
                        }, this),
                        "Reply"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/email/ThreadView.tsx",
                    lineNumber: 200,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/email/ThreadView.tsx",
                lineNumber: 199,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4 pb-4",
                children: hasBody && message.body ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EmailBody, {
                    html: message.body
                }, void 0, false, {
                    fileName: "[project]/src/components/email/ThreadView.tsx",
                    lineNumber: 215,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-sm text-gray-400 whitespace-pre-wrap",
                    children: message.snippet || "Loading..."
                }, void 0, false, {
                    fileName: "[project]/src/components/email/ThreadView.tsx",
                    lineNumber: 217,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/email/ThreadView.tsx",
                lineNumber: 213,
                columnNumber: 7
            }, this),
            message.attachments && message.attachments.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4 pb-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-wrap gap-2 items-center",
                    children: [
                        message.attachments.map((att)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AttachmentChip, {
                                attachment: att
                            }, att.id, false, {
                                fileName: "[project]/src/components/email/ThreadView.tsx",
                                lineNumber: 228,
                                columnNumber: 15
                            }, this)),
                        message.attachments.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DownloadAllButton, {
                            attachments: message.attachments
                        }, void 0, false, {
                            fileName: "[project]/src/components/email/ThreadView.tsx",
                            lineNumber: 231,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/email/ThreadView.tsx",
                    lineNumber: 226,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/email/ThreadView.tsx",
                lineNumber: 225,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/email/ThreadView.tsx",
        lineNumber: 173,
        columnNumber: 5
    }, this);
}
_s1(MessageCard, "pKCfKLRGDwR31ntnfPkdL+4jEwI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"]
    ];
});
_c1 = MessageCard;
function AttachmentChip({ attachment }) {
    const url = `/api/emails/${attachment.messageId}/attachments/${attachment.id}?filename=${encodeURIComponent(attachment.filename)}&mimeType=${encodeURIComponent(attachment.mimeType)}`;
    function formatSize(bytes) {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    const icon = attachment.mimeType.startsWith("image/") ? "\u{1F5BC}" : attachment.mimeType === "application/pdf" ? "\u{1F4C4}" : "\u{1F4CE}";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
        href: url,
        download: attachment.filename,
        className: "flex items-center gap-2 px-3 py-2 btn-accent rounded-lg transition-colors border border-[var(--btn-hover)] text-sm",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: icon
            }, void 0, false, {
                fileName: "[project]/src/components/email/ThreadView.tsx",
                lineNumber: 258,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-gray-200 truncate max-w-[200px]",
                children: attachment.filename
            }, void 0, false, {
                fileName: "[project]/src/components/email/ThreadView.tsx",
                lineNumber: 259,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-gray-500 text-xs",
                children: formatSize(attachment.size)
            }, void 0, false, {
                fileName: "[project]/src/components/email/ThreadView.tsx",
                lineNumber: 260,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                className: "w-4 h-4 text-gray-400",
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor",
                strokeWidth: 2,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                }, void 0, false, {
                    fileName: "[project]/src/components/email/ThreadView.tsx",
                    lineNumber: 262,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/email/ThreadView.tsx",
                lineNumber: 261,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/email/ThreadView.tsx",
        lineNumber: 253,
        columnNumber: 5
    }, this);
}
_c2 = AttachmentChip;
function DownloadAllButton({ attachments }) {
    _s2();
    const [downloading, setDownloading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    async function handleDownloadAll() {
        if (downloading) return;
        setDownloading(true);
        try {
            for (const att of attachments){
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
        } finally{
            setDownloading(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: handleDownloadAll,
        disabled: downloading,
        className: "flex items-center gap-1.5 px-3 py-2 btn-accent rounded-lg transition-colors text-sm",
        children: [
            downloading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                className: "w-4 h-4 animate-spin",
                viewBox: "0 0 24 24",
                fill: "none",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "12",
                        cy: "12",
                        r: "10",
                        stroke: "currentColor",
                        strokeWidth: "2",
                        opacity: "0.3"
                    }, void 0, false, {
                        fileName: "[project]/src/components/email/ThreadView.tsx",
                        lineNumber: 300,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M4 12a8 8 0 018-8",
                        stroke: "currentColor",
                        strokeWidth: "2",
                        strokeLinecap: "round"
                    }, void 0, false, {
                        fileName: "[project]/src/components/email/ThreadView.tsx",
                        lineNumber: 301,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/email/ThreadView.tsx",
                lineNumber: 299,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                className: "w-4 h-4",
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor",
                strokeWidth: 2,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                }, void 0, false, {
                    fileName: "[project]/src/components/email/ThreadView.tsx",
                    lineNumber: 305,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/email/ThreadView.tsx",
                lineNumber: 304,
                columnNumber: 9
            }, this),
            "Download all (",
            attachments.length,
            ")"
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/email/ThreadView.tsx",
        lineNumber: 293,
        columnNumber: 5
    }, this);
}
_s2(DownloadAllButton, "TGKrlxNRiU0jrDoP4C72kWxN4Qs=");
_c3 = DownloadAllButton;
const URL_RE = /(\bhttps?:\/\/[^\s<>"')\]]+)/g;
function autoLinkUrls(html) {
    // Only linkify text outside of existing tags
    return html.replace(/>([^<]*)</g, (match, text)=>{
        const linked = text.replace(URL_RE, (url)=>`<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`);
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
    /<blockquote/i
];
// Plain-text quote markers
const PLAIN_QUOTE_RE = /(?:^|\r?\n)(-{3,}[ \t]*(?:Original Message|Forwarded message)[ \t]*-{3,}|On .{10,}wrote:|From:[ \t]+\S.*\r?\n.*Sent:)/im;
function splitQuote(html) {
    const candidates = HTML_QUOTE_PATTERNS.map((re)=>re.exec(html)).filter((m)=>m !== null && m.index > 0).sort((a, b)=>a.index - b.index);
    if (candidates.length > 0) {
        const idx = candidates[0].index;
        return {
            main: html.slice(0, idx),
            quoted: html.slice(idx)
        };
    }
    // Plain text fallback
    const match = PLAIN_QUOTE_RE.exec(html);
    if (match && match.index > 0) {
        return {
            main: html.slice(0, match.index),
            quoted: html.slice(match.index)
        };
    }
    return {
        main: html,
        quoted: null
    };
}
const SANITIZE_OPTS = {
    ALLOWED_TAGS: [
        "p",
        "br",
        "div",
        "span",
        "a",
        "b",
        "i",
        "u",
        "strong",
        "em",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "ul",
        "ol",
        "li",
        "table",
        "tr",
        "td",
        "th",
        "thead",
        "tbody",
        "img",
        "blockquote",
        "pre",
        "code",
        "hr",
        "font",
        "center",
        "sup",
        "sub"
    ],
    ALLOWED_ATTR: [
        "href",
        "src",
        "alt",
        "style",
        "class",
        "width",
        "height",
        "face",
        "size",
        "color",
        "align",
        "valign",
        "bgcolor",
        "border",
        "cellpadding",
        "cellspacing",
        "colspan",
        "rowspan",
        "target",
        "rel"
    ]
};
/** Strip inline color/background styles so dark mode CSS can take effect */ function stripColorStyles(html) {
    return html.replace(/\bstyle="([^"]*)"/gi, (match, styles)=>{
        const cleaned = styles.split(";").filter((s)=>{
            const prop = s.split(":")[0]?.trim().toLowerCase();
            return prop !== "color" && prop !== "background-color" && prop !== "background";
        }).join(";");
        return cleaned.trim() ? `style="${cleaned}"` : "";
    });
}
function EmailBody({ html }) {
    _s3();
    const [showQuoted, setShowQuoted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");
    // Split on raw HTML first so id/class attrs are intact for pattern matching
    // (DOMPurify strips id attributes, breaking all Outlook quote detection)
    const { main: rawMain, quoted: rawQuoted } = splitQuote(html);
    const sanitize = (s)=>{
        let sanitized = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$dompurify$2f$dist$2f$purify$2e$es$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].sanitize(s, SANITIZE_OPTS);
        if (isDark) sanitized = stripColorStyles(sanitized);
        return sanitized;
    };
    const process = (s)=>autoLinkUrls(s.replace(/<a\s/gi, '<a target="_blank" rel="noopener noreferrer" '));
    const main = process(sanitize(rawMain));
    const quoted = rawQuoted ? process(sanitize(rawQuoted)) : null;
    const bodyClass = "text-sm text-gray-200 leading-relaxed prose-invert max-w-none email-body-dark [&_a]:text-blue-400 [&_a]:underline [&_a]:cursor-pointer [&_blockquote]:border-l-2 [&_blockquote]:border-gray-700 [&_blockquote]:pl-3 [&_blockquote]:text-gray-400 [&_img]:max-w-full [&_img]:h-auto [&_pre]:bg-gray-800 [&_pre]:p-2 [&_pre]:rounded [&_pre]:overflow-x-auto [&_table]:border-collapse [&_td]:p-1 [&_th]:p-1";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: bodyClass,
                dangerouslySetInnerHTML: {
                    __html: main
                }
            }, void 0, false, {
                fileName: "[project]/src/components/email/ThreadView.tsx",
                lineNumber: 419,
                columnNumber: 7
            }, this),
            quoted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setShowQuoted((v)=>!v),
                        className: "mt-2 text-xs text-gray-500 hover:text-gray-300 transition-colors",
                        children: showQuoted ? "Hide quoted text" : "Show quoted text"
                    }, void 0, false, {
                        fileName: "[project]/src/components/email/ThreadView.tsx",
                        lineNumber: 422,
                        columnNumber: 11
                    }, this),
                    showQuoted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `mt-2 ${bodyClass}`,
                        dangerouslySetInnerHTML: {
                            __html: quoted
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/components/email/ThreadView.tsx",
                        lineNumber: 429,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/email/ThreadView.tsx",
        lineNumber: 418,
        columnNumber: 5
    }, this);
}
_s3(EmailBody, "6N7nZmcUG0bP8ZD1DAVT+7rtrPo=");
_c4 = EmailBody;
var _c, _c1, _c2, _c3, _c4;
__turbopack_context__.k.register(_c, "ThreadView");
__turbopack_context__.k.register(_c1, "MessageCard");
__turbopack_context__.k.register(_c2, "AttachmentChip");
__turbopack_context__.k.register(_c3, "DownloadAllButton");
__turbopack_context__.k.register(_c4, "EmailBody");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/email/DraftReply.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DraftReply",
    ()=>DraftReply
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$_internal$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/swr/dist/_internal/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/index.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function parseAddrs(raw) {
    if (!raw.trim()) return [];
    // If no angle brackets, simple comma-split for bare emails
    if (!raw.includes("<")) {
        return raw.split(",").map((s)=>({
                name: "",
                email: s.trim()
            })).filter((a)=>a.email);
    }
    // Split on ">, " — the real separator between "Name <email>" addresses.
    // This preserves commas inside display names like "Name, Ph.D."
    return raw.split(/>\s*,\s*/).map((part)=>{
        const m = part.trim().match(/^(.*?)\s*<(.+?)>?\s*$/);
        return m ? {
            name: m[1].trim(),
            email: m[2].trim()
        } : {
            name: "",
            email: part.trim()
        };
    }).filter((a)=>a.email && a.email.includes("@"));
}
const MY_EMAILS = (("TURBOPACK compile-time value", "xianyi.cheng.duke@gmail.com,xianyi.cheng@duke.edu,chengxy0418@gmail.com") || "").split(",").map((e)=>e.trim().toLowerCase()).filter(Boolean);
_c = MY_EMAILS;
const PRIMARY_CC_ADDR = ("TURBOPACK compile-time value", "xianyi.cheng@duke.edu") || "";
function ensurePrimaryCc(existing) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const addrs = existing.split(",").map((e)=>e.trim()).filter(Boolean);
    if (!addrs.some((e)=>e.toLowerCase() === PRIMARY_CC_ADDR.toLowerCase())) {
        addrs.push(PRIMARY_CC_ADDR);
    }
    return addrs.join(", ");
}
function fmtAddr(a) {
    return a.name ? `${a.name} <${a.email}>` : a.email;
}
function computeReplyAddrs(thread, replyAll, isSentFolder) {
    const messages = thread.messages;
    const lastMsg = messages[messages.length - 1];
    let replyTo = "";
    if (isSentFolder) {
        const externalTo = lastMsg.to.find((a)=>!MY_EMAILS.includes(a.email.toLowerCase()));
        replyTo = externalTo?.email || lastMsg.to[0]?.email || "";
    } else {
        for(let i = messages.length - 1; i >= 0; i--){
            if (!MY_EMAILS.includes(messages[i].from.email.toLowerCase())) {
                replyTo = messages[i].from.email;
                break;
            }
        }
    }
    if (!replyAll) {
        return {
            to: replyTo,
            cc: PRIMARY_CC_ADDR
        };
    }
    // Reply All: include original To + CC, excluding self and the main reply-to address
    const seen = new Set([
        ...MY_EMAILS,
        replyTo.toLowerCase()
    ]);
    const others = [];
    for (const addr of [
        ...lastMsg.to,
        ...lastMsg.cc
    ]){
        const key = addr.email.toLowerCase();
        if (!seen.has(key)) {
            seen.add(key);
            others.push(fmtAddr(addr));
        }
    }
    return {
        to: replyTo,
        cc: ensurePrimaryCc(others.join(", "))
    };
}
function DraftReply() {
    _s();
    const openThread = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "DraftReply.useAppStore[openThread]": (s)=>s.openThread
    }["DraftReply.useAppStore[openThread]"]);
    const activeFolder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "DraftReply.useAppStore[activeFolder]": (s)=>s.activeFolder
    }["DraftReply.useAppStore[activeFolder]"]);
    const composeDraft = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "DraftReply.useAppStore[composeDraft]": (s)=>s.composeDraft
    }["DraftReply.useAppStore[composeDraft]"]);
    const composeSubject = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "DraftReply.useAppStore[composeSubject]": (s)=>s.composeSubject
    }["DraftReply.useAppStore[composeSubject]"]);
    const composeToEmail = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "DraftReply.useAppStore[composeToEmail]": (s)=>s.composeToEmail
    }["DraftReply.useAppStore[composeToEmail]"]);
    const composeCc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "DraftReply.useAppStore[composeCc]": (s)=>s.composeCc
    }["DraftReply.useAppStore[composeCc]"]);
    const composeBcc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "DraftReply.useAppStore[composeBcc]": (s)=>s.composeBcc
    }["DraftReply.useAppStore[composeBcc]"]);
    const composeAttachments = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "DraftReply.useAppStore[composeAttachments]": (s)=>s.composeAttachments
    }["DraftReply.useAppStore[composeAttachments]"]);
    const triggerThreadRefresh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "DraftReply.useAppStore[triggerThreadRefresh]": (s)=>s.triggerThreadRefresh
    }["DraftReply.useAppStore[triggerThreadRefresh]"]);
    const composeQueue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "DraftReply.useAppStore[composeQueue]": (s)=>s.composeQueue
    }["DraftReply.useAppStore[composeQueue]"]);
    const activeComposeIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "DraftReply.useAppStore[activeComposeIndex]": (s)=>s.activeComposeIndex
    }["DraftReply.useAppStore[activeComposeIndex]"]);
    const { mutate: globalMutate } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$_internal$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useSWRConfig"])();
    const [to, setTo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [cc, setCc] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [bcc, setBcc] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [toFocused, setToFocused] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [ccFocused, setCcFocused] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [subject, setSubject] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [body, setBody] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [sending, setSending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [showCcBcc, setShowCcBcc] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [draftId, setDraftId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [attachments, setAttachments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [uploadedAttachments, setUploadedAttachments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [replyAll, setReplyAll] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const prevThreadIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const discardedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const draftCacheRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new Map());
    // Keep refs to current field values so the thread-switch effect always reads fresh state
    const fieldsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        to,
        cc,
        bcc,
        subject,
        body,
        draftId,
        showCcBcc,
        attachments,
        replyAll
    });
    fieldsRef.current = {
        to,
        cc,
        bcc,
        subject,
        body,
        draftId,
        showCcBcc,
        attachments,
        replyAll
    };
    // Reset fields when thread changes, then try to load Gmail draft
    const abortRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DraftReply.useEffect": ()=>{
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
                draftCacheRef.current.set(prevId, {
                    ...f
                });
            } else if (prevId) {
                // No content — remove stale cache entry
                draftCacheRef.current.delete(prevId);
            }
            // Try to restore cached draft for the new thread
            const cached = newId ? draftCacheRef.current.get(newId) : undefined;
            if (cached) {
                setTo(cached.to);
                setCc(cached.cc);
                setBcc(cached.bcc);
                setSubject(cached.subject);
                setBody(cached.body);
                setDraftId(cached.draftId);
                setShowCcBcc(cached.showCcBcc);
                setAttachments(cached.attachments);
                setReplyAll(cached.replyAll);
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
                const isDraft = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().activeFolder === "drafts";
                if (!isDraft) {
                    const isSentFolder = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().activeFolder === "sent";
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
                fetch(`/api/drafts/thread?threadId=${tid}`, {
                    signal: controller.signal
                }).then({
                    "DraftReply.useEffect": (r)=>r.ok ? r.json() : null
                }["DraftReply.useEffect"]).then({
                    "DraftReply.useEffect": (data)=>{
                        if (controller.signal.aborted) return;
                        if (!data?.draft) return;
                        const d = data.draft;
                        setDraftId(d.id);
                        if (d.body) {
                            const text = d.body.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]*>/g, "");
                            setBody(text);
                        }
                        const fmt = {
                            "DraftReply.useEffect.fmt": (a)=>a.name ? `${a.name} <${a.email}>` : a.email
                        }["DraftReply.useEffect.fmt"];
                        if (d.to?.length) setTo(d.to.map(fmt).join(", "));
                        const loadedCc = d.cc?.length ? d.cc.map(fmt).join(", ") : "";
                        setCc(ensurePrimaryCc(loadedCc));
                        setShowCcBcc(true);
                        if (d.bcc?.length) {
                            setBcc(d.bcc.map(fmt).join(", "));
                        }
                        if (d.subject) setSubject(d.subject);
                    }
                }["DraftReply.useEffect"]).catch({
                    "DraftReply.useEffect": ()=>{}
                }["DraftReply.useEffect"]);
            }
        }
    }["DraftReply.useEffect"], [
        openThread?.id
    ]);
    // CLI pushes (for replies / single drafts when a thread is open)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DraftReply.useEffect": ()=>{
            if (composeDraft) {
                setBody(composeDraft);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].setState({
                    composeDraft: ""
                });
            }
        }
    }["DraftReply.useEffect"], [
        composeDraft
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DraftReply.useEffect": ()=>{
            if (composeToEmail !== null) {
                setTo(composeToEmail);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].setState({
                    composeToEmail: null
                });
            }
        }
    }["DraftReply.useEffect"], [
        composeToEmail
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DraftReply.useEffect": ()=>{
            if (composeSubject) {
                setSubject(composeSubject);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].setState({
                    composeSubject: ""
                });
            }
        }
    }["DraftReply.useEffect"], [
        composeSubject
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DraftReply.useEffect": ()=>{
            if (composeCc) {
                setCc(composeCc);
                setShowCcBcc(true);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].setState({
                    composeCc: ""
                });
            }
        }
    }["DraftReply.useEffect"], [
        composeCc
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DraftReply.useEffect": ()=>{
            if (composeBcc) {
                setBcc(composeBcc);
                setShowCcBcc(true);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].setState({
                    composeBcc: ""
                });
            }
        }
    }["DraftReply.useEffect"], [
        composeBcc
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DraftReply.useEffect": ()=>{
            if (composeAttachments.length) {
                setAttachments(composeAttachments);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].setState({
                    composeAttachments: []
                });
            }
        }
    }["DraftReply.useEffect"], [
        composeAttachments
    ]);
    // Load from compose queue when active index changes (for multi-draft new emails)
    const prevQueueIndexRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(-1);
    const prevQueueLenRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DraftReply.useEffect": ()=>{
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
        }
    }["DraftReply.useEffect"], [
        activeComposeIndex,
        composeQueue.length,
        openThread
    ]);
    // Auto-save to Gmail draft (debounced 3s)
    const saveTimer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const draftIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(draftId);
    draftIdRef.current = draftId;
    const saveDraftToGmail = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DraftReply.useCallback[saveDraftToGmail]": ()=>{
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
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    to: toAddrs,
                    cc: ccAddrs.length ? ccAddrs : undefined,
                    bcc: bccAddrs.length ? bccAddrs : undefined,
                    subject,
                    body: currentBody.replace(/\n/g, "<br>"),
                    threadId: ({
                        "DraftReply.useCallback[saveDraftToGmail]": ()=>{
                            const currentThread = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().openThread;
                            if (!currentThread) return undefined;
                            const strip = {
                                "DraftReply.useCallback[saveDraftToGmail].strip": (s)=>s.replace(/^(Re:\s*|Fwd:\s*|Fw:\s*|\[.*?\]\s*)+/gi, "").trim().toLowerCase()
                            }["DraftReply.useCallback[saveDraftToGmail].strip"];
                            return strip(subject) === strip(currentThread.subject) ? currentThread.id : undefined;
                        }
                    })["DraftReply.useCallback[saveDraftToGmail]"](),
                    draftId: draftIdRef.current || undefined,
                    attachments: attachments.length ? attachments : undefined
                })
            }).then({
                "DraftReply.useCallback[saveDraftToGmail]": async (r)=>{
                    if (!r.ok) {
                        console.error("Draft save failed:", r.status, await r.text().catch({
                            "DraftReply.useCallback[saveDraftToGmail]": ()=>""
                        }["DraftReply.useCallback[saveDraftToGmail]"]));
                        setStatus("error");
                        return;
                    }
                    const saved = await r.json();
                    if (saved?.id) {
                        setDraftId(saved.id);
                        setStatus("saved");
                        setTimeout({
                            "DraftReply.useCallback[saveDraftToGmail]": ()=>setStatus({
                                    "DraftReply.useCallback[saveDraftToGmail]": (s)=>s === "saved" ? "" : s
                                }["DraftReply.useCallback[saveDraftToGmail]"])
                        }["DraftReply.useCallback[saveDraftToGmail]"], 2000);
                    } else {
                        setStatus("");
                    }
                }
            }["DraftReply.useCallback[saveDraftToGmail]"]).catch({
                "DraftReply.useCallback[saveDraftToGmail]": (err)=>{
                    console.error("Draft save error:", err);
                    setStatus("error");
                }
            }["DraftReply.useCallback[saveDraftToGmail]"]);
        }
    }["DraftReply.useCallback[saveDraftToGmail]"], [
        body,
        to,
        cc,
        bcc,
        subject
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DraftReply.useEffect": ()=>{
            if (!body.trim()) return;
            if (saveTimer.current) clearTimeout(saveTimer.current);
            saveTimer.current = setTimeout(saveDraftToGmail, 3000);
            return ({
                "DraftReply.useEffect": ()=>{
                    if (saveTimer.current) clearTimeout(saveTimer.current);
                }
            })["DraftReply.useEffect"];
        }
    }["DraftReply.useEffect"], [
        body,
        to,
        cc,
        bcc,
        subject,
        saveDraftToGmail
    ]);
    // Sync to CLI state and keep compose queue in sync
    const syncTimer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DraftReply.useEffect": ()=>{
            if (syncTimer.current) clearTimeout(syncTimer.current);
            syncTimer.current = setTimeout({
                "DraftReply.useEffect": ()=>{
                    const { composeQueue: q, activeComposeIndex: idx } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState();
                    fetch("/api/cli/state", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            draft: {
                                to,
                                cc,
                                bcc,
                                subject,
                                body
                            },
                            composeQueue: q.map({
                                "DraftReply.useEffect": (d)=>({
                                        to: d.to,
                                        subject: d.subject
                                    })
                            }["DraftReply.useEffect"]),
                            activeComposeIndex: idx
                        })
                    }).catch({
                        "DraftReply.useEffect": ()=>{}
                    }["DraftReply.useEffect"]);
                    // Keep compose queue entry in sync with field edits
                    const { composeQueue, activeComposeIndex, openThread: ot } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState();
                    if (!ot && composeQueue.length > 0 && composeQueue[activeComposeIndex]) {
                        const updated = [
                            ...composeQueue
                        ];
                        updated[activeComposeIndex] = {
                            to,
                            cc,
                            bcc,
                            subject,
                            body,
                            attachments
                        };
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].setState({
                            composeQueue: updated
                        });
                    }
                }
            }["DraftReply.useEffect"], 300);
            return ({
                "DraftReply.useEffect": ()=>{
                    if (syncTimer.current) clearTimeout(syncTimer.current);
                }
            })["DraftReply.useEffect"];
        }
    }["DraftReply.useEffect"], [
        to,
        cc,
        bcc,
        subject,
        body,
        attachments
    ]);
    function handleFileSelect(e) {
        const files = e.target.files;
        if (!files) return;
        Array.from(files).forEach((file)=>{
            const reader = new FileReader();
            reader.onload = ()=>{
                const base64 = reader.result.split(",")[1]; // strip data:...;base64, prefix
                setUploadedAttachments((prev)=>[
                        ...prev,
                        {
                            filename: file.name,
                            mimeType: file.type || "application/octet-stream",
                            size: file.size,
                            base64Data: base64
                        }
                    ]);
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
            const stripPrefixes = (s)=>s.replace(/^(Re:\s*|Fwd:\s*|Fw:\s*|\[.*?\]\s*)+/gi, "").trim().toLowerCase();
            const isReply = openThread && stripPrefixes(subject) === stripPrefixes(openThread.subject);
            // Get the last message ID for In-Reply-To header, and thread ID for Gmail threading
            const lastMsg = isReply && openThread?.messages?.length ? openThread.messages[openThread.messages.length - 1] : undefined;
            const res = await fetch("/api/emails/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    to: toAddrs,
                    cc: ccAddrs.length ? ccAddrs : undefined,
                    bcc: bccAddrs.length ? bccAddrs : undefined,
                    subject: subject.trim(),
                    body: body.replace(/\n/g, "<br>"),
                    replyToMessageId: lastMsg?.id,
                    threadId: isReply ? openThread?.id : undefined,
                    attachments: attachments.length ? attachments : undefined,
                    uploadedAttachments: uploadedAttachments.length ? uploadedAttachments : undefined
                })
            });
            if (!res.ok) throw new Error("Send failed");
            // Delete the Gmail draft after sending
            if (draftId) {
                fetch(`/api/drafts?draftId=${draftId}`, {
                    method: "DELETE"
                }).catch(()=>{});
            }
            setStatus("sent");
            // Clear cached draft for this thread
            const sentId = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().openThread?.id;
            if (sentId) draftCacheRef.current.delete(sentId);
            // Remove from compose queue if applicable
            const currentQueue = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().composeQueue;
            if (!sentId && currentQueue.length > 0) {
                handleRemoveCompose(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().activeComposeIndex);
            }
            setBody("");
            setTo("");
            setCc("");
            setBcc("");
            setSubject("");
            setDraftId("");
            setAttachments([]);
            setUploadedAttachments([]);
            // If in drafts folder, remove the thread from the list and close it
            const currentFolder = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().activeFolder;
            const sentThread = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().openThread;
            if (currentFolder === "drafts" && sentThread) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().discardThread(sentThread.id);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].setState({
                    openThread: null,
                    selectedIndex: -1
                });
            }
            // Reload the thread and list after a short delay so Gmail indexes the sent message
            setTimeout(()=>{
                triggerThreadRefresh();
                globalMutate((key)=>typeof key === "string" && key.startsWith("/api/emails"));
            }, 1500);
            setTimeout(()=>setStatus(""), 3000);
        } catch  {
            setStatus("send-error");
        } finally{
            setSending(false);
        }
    }
    function handleSwitchCompose(index) {
        if (index === activeComposeIndex || index < 0 || index >= composeQueue.length) return;
        // Save current local fields to queue
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().updateQueueEntry(activeComposeIndex, {
            to,
            cc,
            bcc,
            subject,
            body,
            attachments
        });
        // Load target draft from queue
        const target = composeQueue[index];
        setTo(target.to);
        setCc(target.cc);
        setBcc(target.bcc);
        setSubject(target.subject);
        setBody(target.body);
        setAttachments(target.attachments);
        setShowCcBcc(!!(target.cc || target.bcc));
        setDraftId("");
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().setActiveComposeIndex(index);
    }
    function handleRemoveCompose(index) {
        const queue = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().composeQueue;
        if (queue.length <= 1) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].setState({
                composeQueue: [],
                activeComposeIndex: 0
            });
            setTo("");
            setCc("");
            setBcc("");
            setSubject("");
            setBody("");
            setDraftId("");
            setAttachments([]);
            return;
        }
        // If removing active tab, save isn't needed — just load the next one
        // If removing non-active, save current first
        if (index !== activeComposeIndex) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().updateQueueEntry(activeComposeIndex, {
                to,
                cc,
                bcc,
                subject,
                body,
                attachments
            });
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().removeQueueEntry(index);
        // Load whatever is now active
        const newState = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState();
        const target = newState.composeQueue[newState.activeComposeIndex];
        if (target) {
            setTo(target.to);
            setCc(target.cc);
            setBcc(target.bcc);
            setSubject(target.subject);
            setBody(target.body);
            setAttachments(target.attachments);
            setShowCcBcc(!!(target.cc || target.bcc));
        }
    }
    function handleReplyAllToggle() {
        const thread = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().openThread;
        const isDraft = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().activeFolder === "drafts";
        if (!thread || isDraft) return;
        const isSentFolder = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().activeFolder === "sent";
        const newReplyAll = !replyAll;
        const { to: newTo, cc: newCc } = computeReplyAddrs(thread, newReplyAll, isSentFolder);
        setReplyAll(newReplyAll);
        setTo(newTo);
        setCc(newCc);
        setShowCcBcc(true);
    }
    function formatSize(bytes) {
        if (bytes < 1024) return `${bytes}B`;
        if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
    }
    // Show just name (or email if no name) when field is not focused
    function displayValue(raw) {
        return raw.split(",").map((s)=>{
            const m = s.trim().match(/^(.+?)\s*<([^>]+)>$/);
            return m ? m[1].trim() : s.trim();
        }).filter(Boolean).join(", ");
    }
    function handleEmailKeyDown(e, value, setter) {
        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            handleSend();
            return;
        }
        if (e.key === " ") {
            const trimmed = value.trimEnd();
            if (trimmed && !trimmed.endsWith(",")) {
                e.preventDefault();
                setter(trimmed + ", ");
            }
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col h-full w-full bg-gray-950",
        children: [
            !openThread && composeQueue.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-1 px-3 py-1.5 border-b border-gray-800 flex-shrink-0 overflow-x-auto",
                children: composeQueue.map((draft, i)=>{
                    const label = draft.to ? draft.to.split("@")[0].split("<").pop()?.trim() || `Draft ${i + 1}` : `Draft ${i + 1}`;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center group",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>handleSwitchCompose(i),
                                className: `text-xs px-2 py-1 rounded-t transition-colors truncate max-w-[120px] ${i === activeComposeIndex ? "text-blue-400 bg-blue-500/10 border-b-2 border-blue-400" : "text-gray-500 hover:text-gray-300 hover:bg-gray-800"}`,
                                title: draft.to,
                                children: label
                            }, void 0, false, {
                                fileName: "[project]/src/components/email/DraftReply.tsx",
                                lineNumber: 503,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: (e)=>{
                                    e.stopPropagation();
                                    handleRemoveCompose(i);
                                },
                                className: "text-gray-600 hover:text-red-400 text-xs ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity",
                                title: "Close draft",
                                children: "×"
                            }, void 0, false, {
                                fileName: "[project]/src/components/email/DraftReply.tsx",
                                lineNumber: 514,
                                columnNumber: 17
                            }, this)
                        ]
                    }, i, true, {
                        fileName: "[project]/src/components/email/DraftReply.tsx",
                        lineNumber: 502,
                        columnNumber: 15
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/src/components/email/DraftReply.tsx",
                lineNumber: 498,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between px-3 py-2 border-b border-gray-800 flex-shrink-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs font-medium text-gray-400",
                                children: openThread ? "Draft Reply" : "New Email"
                            }, void 0, false, {
                                fileName: "[project]/src/components/email/DraftReply.tsx",
                                lineNumber: 529,
                                columnNumber: 11
                            }, this),
                            openThread && activeFolder !== "drafts" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleReplyAllToggle,
                                className: `text-xs px-1.5 py-0.5 rounded transition-colors ${replyAll ? "text-blue-400 bg-blue-500/10 hover:bg-blue-500/20" : "text-gray-500 hover:text-gray-300 hover:bg-gray-800"}`,
                                title: replyAll ? "Switch to Reply" : "Switch to Reply All",
                                children: replyAll ? "Reply All" : "Reply"
                            }, void 0, false, {
                                fileName: "[project]/src/components/email/DraftReply.tsx",
                                lineNumber: 533,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/email/DraftReply.tsx",
                        lineNumber: 528,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            status === "saving" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-gray-500",
                                children: "Saving..."
                            }, void 0, false, {
                                fileName: "[project]/src/components/email/DraftReply.tsx",
                                lineNumber: 547,
                                columnNumber: 35
                            }, this),
                            status === "saved" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-gray-400",
                                children: "Draft saved"
                            }, void 0, false, {
                                fileName: "[project]/src/components/email/DraftReply.tsx",
                                lineNumber: 548,
                                columnNumber: 34
                            }, this),
                            status === "sent" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-green-400",
                                children: "Sent!"
                            }, void 0, false, {
                                fileName: "[project]/src/components/email/DraftReply.tsx",
                                lineNumber: 549,
                                columnNumber: 33
                            }, this),
                            status === "error" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-red-400",
                                children: "Save failed"
                            }, void 0, false, {
                                fileName: "[project]/src/components/email/DraftReply.tsx",
                                lineNumber: 550,
                                columnNumber: 34
                            }, this),
                            status === "send-error" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-red-400",
                                children: "Failed to send"
                            }, void 0, false, {
                                fileName: "[project]/src/components/email/DraftReply.tsx",
                                lineNumber: 551,
                                columnNumber: 39
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/email/DraftReply.tsx",
                        lineNumber: 546,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/email/DraftReply.tsx",
                lineNumber: 527,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-3 py-1.5 border-b border-gray-800/50 flex-shrink-0 space-y-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "text-xs text-gray-500 w-10",
                                children: "To:"
                            }, void 0, false, {
                                fileName: "[project]/src/components/email/DraftReply.tsx",
                                lineNumber: 557,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                value: toFocused ? to : displayValue(to),
                                onChange: (e)=>setTo(e.target.value),
                                onFocus: ()=>setToFocused(true),
                                onBlur: ()=>setToFocused(false),
                                onKeyDown: (e)=>handleEmailKeyDown(e, to, setTo),
                                className: "flex-1 bg-transparent text-xs text-gray-300 outline-none",
                                placeholder: "recipient@example.com"
                            }, void 0, false, {
                                fileName: "[project]/src/components/email/DraftReply.tsx",
                                lineNumber: 558,
                                columnNumber: 11
                            }, this),
                            !showCcBcc && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setShowCcBcc(true),
                                className: "text-xs text-gray-500 hover:text-gray-300 transition-colors",
                                children: "Cc/Bcc"
                            }, void 0, false, {
                                fileName: "[project]/src/components/email/DraftReply.tsx",
                                lineNumber: 566,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/email/DraftReply.tsx",
                        lineNumber: 556,
                        columnNumber: 9
                    }, this),
                    showCcBcc && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "text-xs text-gray-500 w-10",
                                        children: "Cc:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/email/DraftReply.tsx",
                                        lineNumber: 572,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: ccFocused ? cc : displayValue(cc),
                                        onChange: (e)=>setCc(e.target.value),
                                        onFocus: ()=>setCcFocused(true),
                                        onBlur: ()=>setCcFocused(false),
                                        onKeyDown: (e)=>handleEmailKeyDown(e, cc, setCc),
                                        className: "flex-1 bg-transparent text-xs text-gray-300 outline-none",
                                        placeholder: "cc@example.com"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/email/DraftReply.tsx",
                                        lineNumber: 573,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/email/DraftReply.tsx",
                                lineNumber: 571,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "text-xs text-gray-500 w-10",
                                        children: "Bcc:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/email/DraftReply.tsx",
                                        lineNumber: 582,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: bcc,
                                        onChange: (e)=>setBcc(e.target.value),
                                        onKeyDown: (e)=>handleEmailKeyDown(e, bcc, setBcc),
                                        className: "flex-1 bg-transparent text-xs text-gray-300 outline-none",
                                        placeholder: "bcc@example.com"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/email/DraftReply.tsx",
                                        lineNumber: 583,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/email/DraftReply.tsx",
                                lineNumber: 581,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "text-xs text-gray-500 w-10",
                                children: "Subj:"
                            }, void 0, false, {
                                fileName: "[project]/src/components/email/DraftReply.tsx",
                                lineNumber: 590,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                value: subject,
                                onChange: (e)=>setSubject(e.target.value),
                                onKeyDown: (e)=>{
                                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                },
                                className: "flex-1 bg-transparent text-xs text-gray-300 outline-none",
                                placeholder: "Subject"
                            }, void 0, false, {
                                fileName: "[project]/src/components/email/DraftReply.tsx",
                                lineNumber: 591,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/email/DraftReply.tsx",
                        lineNumber: 589,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/email/DraftReply.tsx",
                lineNumber: 555,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                value: body,
                onChange: (e)=>setBody(e.target.value),
                onKeyDown: (e)=>{
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault();
                        handleSend();
                    }
                },
                className: "flex-1 w-full px-3 py-2 bg-transparent text-sm text-gray-200 resize-none outline-none min-h-0",
                id: "draft-body",
                placeholder: "Write your reply here, or use Claude Code to draft..."
            }, void 0, false, {
                fileName: "[project]/src/components/email/DraftReply.tsx",
                lineNumber: 597,
                columnNumber: 7
            }, this),
            (attachments.length > 0 || uploadedAttachments.length > 0) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-3 py-1.5 border-t border-gray-800/50 flex-shrink-0",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-wrap gap-1.5",
                    children: [
                        attachments.map((att, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "inline-flex items-center gap-1 px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-300 border border-gray-700",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-3 h-3 text-gray-500",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        stroke: "currentColor",
                                        strokeWidth: 2,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            d: "M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/email/DraftReply.tsx",
                                            lineNumber: 608,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/email/DraftReply.tsx",
                                        lineNumber: 607,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "max-w-[150px] truncate",
                                        children: att.filename
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/email/DraftReply.tsx",
                                        lineNumber: 610,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-gray-500",
                                        children: [
                                            "(",
                                            formatSize(att.size),
                                            ")"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/email/DraftReply.tsx",
                                        lineNumber: 611,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setAttachments((prev)=>prev.filter((_, idx)=>idx !== i)),
                                        className: "ml-0.5 text-gray-500 hover:text-red-400 transition-colors",
                                        title: "Remove attachment",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "w-3 h-3",
                                            fill: "none",
                                            viewBox: "0 0 24 24",
                                            stroke: "currentColor",
                                            strokeWidth: 2,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                d: "M6 18L18 6M6 6l12 12"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/email/DraftReply.tsx",
                                                lineNumber: 618,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/email/DraftReply.tsx",
                                            lineNumber: 617,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/email/DraftReply.tsx",
                                        lineNumber: 612,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, `fwd-${att.id}-${i}`, true, {
                                fileName: "[project]/src/components/email/DraftReply.tsx",
                                lineNumber: 606,
                                columnNumber: 15
                            }, this)),
                        uploadedAttachments.map((att, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "inline-flex items-center gap-1 px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-300 border border-blue-700/50",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-3 h-3 text-blue-400",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        stroke: "currentColor",
                                        strokeWidth: 2,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            d: "M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/email/DraftReply.tsx",
                                            lineNumber: 626,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/email/DraftReply.tsx",
                                        lineNumber: 625,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "max-w-[150px] truncate",
                                        children: att.filename
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/email/DraftReply.tsx",
                                        lineNumber: 628,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-gray-500",
                                        children: [
                                            "(",
                                            formatSize(att.size),
                                            ")"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/email/DraftReply.tsx",
                                        lineNumber: 629,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setUploadedAttachments((prev)=>prev.filter((_, idx)=>idx !== i)),
                                        className: "ml-0.5 text-gray-500 hover:text-red-400 transition-colors",
                                        title: "Remove attachment",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "w-3 h-3",
                                            fill: "none",
                                            viewBox: "0 0 24 24",
                                            stroke: "currentColor",
                                            strokeWidth: 2,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                d: "M6 18L18 6M6 6l12 12"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/email/DraftReply.tsx",
                                                lineNumber: 636,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/email/DraftReply.tsx",
                                            lineNumber: 635,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/email/DraftReply.tsx",
                                        lineNumber: 630,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, `upl-${att.filename}-${i}`, true, {
                                fileName: "[project]/src/components/email/DraftReply.tsx",
                                lineNumber: 624,
                                columnNumber: 15
                            }, this))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/email/DraftReply.tsx",
                    lineNumber: 604,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/email/DraftReply.tsx",
                lineNumber: 603,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between px-3 py-2 border-t border-gray-800 flex-shrink-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: async ()=>{
                            // Block auto-save from re-saving with stale closure values
                            discardedRef.current = true;
                            // Cancel any pending timers
                            if (saveTimer.current) {
                                clearTimeout(saveTimer.current);
                                saveTimer.current = null;
                            }
                            if (syncTimer.current) {
                                clearTimeout(syncTimer.current);
                                syncTimer.current = null;
                            }
                            // Delete the Gmail draft
                            const idToDelete = draftId;
                            // Clear all fields
                            setTo("");
                            setCc("");
                            setBcc("");
                            setSubject("");
                            setBody("");
                            setDraftId("");
                            setAttachments([]);
                            setUploadedAttachments([]);
                            setShowCcBcc(false);
                            setStatus("");
                            draftIdRef.current = "";
                            if (idToDelete) {
                                try {
                                    await fetch(`/api/drafts?draftId=${idToDelete}`, {
                                        method: "DELETE"
                                    });
                                } catch  {}
                            }
                        },
                        disabled: !to.trim() && !body.trim() && !subject.trim(),
                        className: "px-3 py-1.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 disabled:opacity-30 disabled:hover:bg-transparent rounded-md transition-colors",
                        title: "Discard draft",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "w-4 h-4",
                            fill: "none",
                            viewBox: "0 0 24 24",
                            stroke: "currentColor",
                            strokeWidth: 2,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            }, void 0, false, {
                                fileName: "[project]/src/components/email/DraftReply.tsx",
                                lineNumber: 674,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/email/DraftReply.tsx",
                            lineNumber: 673,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/email/DraftReply.tsx",
                        lineNumber: 646,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        ref: fileInputRef,
                        type: "file",
                        multiple: true,
                        className: "hidden",
                        onChange: handleFileSelect
                    }, void 0, false, {
                        fileName: "[project]/src/components/email/DraftReply.tsx",
                        lineNumber: 677,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>fileInputRef.current?.click(),
                        className: "p-1.5 text-gray-400 hover:text-gray-200 transition-colors",
                        title: "Attach files",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "w-4 h-4",
                            fill: "none",
                            viewBox: "0 0 24 24",
                            stroke: "currentColor",
                            strokeWidth: 2,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                d: "M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                            }, void 0, false, {
                                fileName: "[project]/src/components/email/DraftReply.tsx",
                                lineNumber: 690,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/email/DraftReply.tsx",
                            lineNumber: 689,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/email/DraftReply.tsx",
                        lineNumber: 684,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleSend,
                        disabled: sending || !body.trim() || !to.trim(),
                        className: "px-4 py-1.5 text-sm btn-accent rounded-md transition-colors",
                        children: sending ? "Sending..." : "Send"
                    }, void 0, false, {
                        fileName: "[project]/src/components/email/DraftReply.tsx",
                        lineNumber: 693,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/email/DraftReply.tsx",
                lineNumber: 645,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/email/DraftReply.tsx",
        lineNumber: 496,
        columnNumber: 5
    }, this);
}
_s(DraftReply, "7h/9FeA0QRWZhhjl3/+5F2xIio0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$_internal$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useSWRConfig"]
    ];
});
_c1 = DraftReply;
var _c, _c1;
__turbopack_context__.k.register(_c, "MY_EMAILS");
__turbopack_context__.k.register(_c1, "DraftReply");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/email/ComposeModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComposeModal",
    ()=>ComposeModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/index.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function ComposeModal() {
    _s();
    const composeDraft = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ComposeModal.useAppStore[composeDraft]": (s)=>s.composeDraft
    }["ComposeModal.useAppStore[composeDraft]"]);
    const composeSubject = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ComposeModal.useAppStore[composeSubject]": (s)=>s.composeSubject
    }["ComposeModal.useAppStore[composeSubject]"]);
    const composeToEmail = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ComposeModal.useAppStore[composeToEmail]": (s)=>s.composeToEmail
    }["ComposeModal.useAppStore[composeToEmail]"]);
    const composeCc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ComposeModal.useAppStore[composeCc]": (s)=>s.composeCc
    }["ComposeModal.useAppStore[composeCc]"]);
    const composeBcc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ComposeModal.useAppStore[composeBcc]": (s)=>s.composeBcc
    }["ComposeModal.useAppStore[composeBcc]"]);
    const closeCompose = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ComposeModal.useAppStore[closeCompose]": (s)=>s.closeCompose
    }["ComposeModal.useAppStore[closeCompose]"]);
    const [to, setTo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(composeToEmail ?? "");
    const [cc, setCc] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(composeCc);
    const [bcc, setBcc] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(composeBcc);
    const [subject, setSubject] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(composeSubject);
    const [body, setBody] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(composeDraft);
    const [sending, setSending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [showCcBcc, setShowCcBcc] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(!!(composeCc || composeBcc));
    async function handleSend() {
        if (!to.trim() || !subject.trim() || !body.trim()) {
            setError("Please fill in all fields.");
            return;
        }
        setSending(true);
        setError("");
        try {
            function parseAddrs(raw) {
                return raw.split(",").map((s)=>{
                    const m = s.trim().match(/^(.+?)\s*<([^>]+)>$/);
                    return m ? {
                        name: m[1].trim(),
                        email: m[2].trim()
                    } : {
                        name: "",
                        email: s.trim()
                    };
                }).filter((a)=>a.email);
            }
            const toAddrs = parseAddrs(to);
            const ccAddrs = parseAddrs(cc);
            const bccAddrs = parseAddrs(bcc);
            const res = await fetch("/api/emails/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    to: toAddrs,
                    cc: ccAddrs.length ? ccAddrs : undefined,
                    bcc: bccAddrs.length ? bccAddrs : undefined,
                    subject: subject.trim(),
                    body: body.replace(/\n/g, "<br>")
                })
            });
            if (!res.ok) throw new Error("Send failed");
            closeCompose();
        } catch  {
            setError("Failed to send email. Please try again.");
        } finally{
            setSending(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black/60 flex items-end justify-center z-50 p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-gray-900 border border-gray-700 rounded-t-lg w-full max-w-2xl flex flex-col max-h-[80vh]",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between px-4 py-3 border-b border-gray-800",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-sm font-medium text-white",
                            children: "New Message"
                        }, void 0, false, {
                            fileName: "[project]/src/components/email/ComposeModal.tsx",
                            lineNumber: 65,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: closeCompose,
                            className: "text-gray-400 hover:text-white transition-colors",
                            children: "✕"
                        }, void 0, false, {
                            fileName: "[project]/src/components/email/ComposeModal.tsx",
                            lineNumber: 66,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/email/ComposeModal.tsx",
                    lineNumber: 64,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-4 py-2 space-y-2 border-b border-gray-800",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "text-sm text-gray-500 w-12",
                                    children: "To:"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/email/ComposeModal.tsx",
                                    lineNumber: 72,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: to,
                                    onChange: (e)=>setTo(e.target.value),
                                    className: "flex-1 bg-transparent text-sm text-gray-200 outline-none",
                                    placeholder: "recipient@example.com"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/email/ComposeModal.tsx",
                                    lineNumber: 73,
                                    columnNumber: 13
                                }, this),
                                !showCcBcc && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowCcBcc(true),
                                    className: "text-xs text-gray-500 hover:text-gray-300 transition-colors",
                                    children: "Cc/Bcc"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/email/ComposeModal.tsx",
                                    lineNumber: 76,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/email/ComposeModal.tsx",
                            lineNumber: 71,
                            columnNumber: 11
                        }, this),
                        showCcBcc && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-sm text-gray-500 w-12",
                                            children: "Cc:"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/email/ComposeModal.tsx",
                                            lineNumber: 87,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: cc,
                                            onChange: (e)=>setCc(e.target.value),
                                            className: "flex-1 bg-transparent text-sm text-gray-200 outline-none",
                                            placeholder: "cc@example.com"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/email/ComposeModal.tsx",
                                            lineNumber: 88,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/email/ComposeModal.tsx",
                                    lineNumber: 86,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-sm text-gray-500 w-12",
                                            children: "Bcc:"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/email/ComposeModal.tsx",
                                            lineNumber: 92,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: bcc,
                                            onChange: (e)=>setBcc(e.target.value),
                                            className: "flex-1 bg-transparent text-sm text-gray-200 outline-none",
                                            placeholder: "bcc@example.com"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/email/ComposeModal.tsx",
                                            lineNumber: 93,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/email/ComposeModal.tsx",
                                    lineNumber: 91,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "text-sm text-gray-500 w-12",
                                    children: "Subject:"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/email/ComposeModal.tsx",
                                    lineNumber: 99,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: subject,
                                    onChange: (e)=>setSubject(e.target.value),
                                    className: "flex-1 bg-transparent text-sm text-gray-200 outline-none",
                                    placeholder: "Subject"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/email/ComposeModal.tsx",
                                    lineNumber: 100,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/email/ComposeModal.tsx",
                            lineNumber: 98,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/email/ComposeModal.tsx",
                    lineNumber: 70,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                    value: body,
                    onChange: (e)=>setBody(e.target.value),
                    autoFocus: true,
                    className: "flex-1 min-h-[200px] p-4 bg-transparent text-sm text-gray-200 resize-none outline-none",
                    placeholder: "Write your message..."
                }, void 0, false, {
                    fileName: "[project]/src/components/email/ComposeModal.tsx",
                    lineNumber: 104,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between px-4 py-3 border-t border-gray-800",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm text-red-400",
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/src/components/email/ComposeModal.tsx",
                                lineNumber: 108,
                                columnNumber: 26
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/email/ComposeModal.tsx",
                            lineNumber: 108,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: closeCompose,
                                    className: "px-4 py-1.5 text-sm text-gray-400 hover:text-white transition-colors",
                                    children: "Discard"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/email/ComposeModal.tsx",
                                    lineNumber: 110,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleSend,
                                    disabled: sending,
                                    className: "px-4 py-1.5 text-sm btn-accent rounded-md transition-colors",
                                    children: sending ? "Sending..." : "Send"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/email/ComposeModal.tsx",
                                    lineNumber: 111,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/email/ComposeModal.tsx",
                            lineNumber: 109,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/email/ComposeModal.tsx",
                    lineNumber: 107,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/email/ComposeModal.tsx",
            lineNumber: 63,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/email/ComposeModal.tsx",
        lineNumber: 62,
        columnNumber: 5
    }, this);
}
_s(ComposeModal, "eh8Ej0INZLtjQX+76Ddvhqjne7Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"]
    ];
});
_c = ComposeModal;
var _c;
__turbopack_context__.k.register(_c, "ComposeModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/ShortcutHelp.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ShortcutHelp",
    ()=>ShortcutHelp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/index.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
const shortcuts = [
    {
        keys: "j / k",
        desc: "Navigate up/down"
    },
    {
        keys: "Enter",
        desc: "Open selected email"
    },
    {
        keys: "Escape",
        desc: "Close email / modal"
    },
    {
        keys: "e",
        desc: "Archive email"
    },
    {
        keys: "u",
        desc: "Toggle read/unread"
    },
    {
        keys: "r",
        desc: "Reply to email"
    },
    {
        keys: "c",
        desc: "Compose new email"
    },
    {
        keys: "/",
        desc: "Focus search"
    },
    {
        keys: "t",
        desc: "Toggle theme"
    },
    {
        keys: "g i",
        desc: "Go to Inbox"
    },
    {
        keys: "g s",
        desc: "Go to Sent"
    },
    {
        keys: "g d",
        desc: "Go to Drafts"
    },
    {
        keys: "g a",
        desc: "Go to Archive"
    },
    {
        keys: "?",
        desc: "Toggle this help"
    }
];
function ShortcutHelp() {
    _s();
    const { toggleShortcutHelp } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black/60 flex items-center justify-center z-50",
        onClick: toggleShortcutHelp,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-md w-full mx-4",
            onClick: (e)=>e.stopPropagation(),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-lg font-semibold text-white mb-4",
                    children: "Keyboard Shortcuts"
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/ShortcutHelp.tsx",
                    lineNumber: 34,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-2 gap-2",
                    children: shortcuts.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                    className: "px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm text-gray-300 font-mono min-w-[4rem] text-center",
                                    children: s.keys
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/ShortcutHelp.tsx",
                                    lineNumber: 40,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-sm text-gray-400",
                                    children: s.desc
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/ShortcutHelp.tsx",
                                    lineNumber: 43,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, s.keys, true, {
                            fileName: "[project]/src/components/layout/ShortcutHelp.tsx",
                            lineNumber: 39,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/ShortcutHelp.tsx",
                    lineNumber: 37,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs text-gray-600 mt-4 text-center",
                    children: [
                        "Press ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                            className: "text-gray-400",
                            children: "?"
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/ShortcutHelp.tsx",
                            lineNumber: 48,
                            columnNumber: 17
                        }, this),
                        " or ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                            className: "text-gray-400",
                            children: "Escape"
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/ShortcutHelp.tsx",
                            lineNumber: 48,
                            columnNumber: 59
                        }, this),
                        " to close"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/layout/ShortcutHelp.tsx",
                    lineNumber: 47,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/layout/ShortcutHelp.tsx",
            lineNumber: 30,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/layout/ShortcutHelp.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, this);
}
_s(ShortcutHelp, "ud09RhmvVBvDSDQIJJCXkZnUfzI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"]
    ];
});
_c = ShortcutHelp;
var _c;
__turbopack_context__.k.register(_c, "ShortcutHelp");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/ThemeToggle.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeToggle",
    ()=>ThemeToggle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/index.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
const icons = {
    dark: "🌙",
    light: "☀️",
    system: "💻"
};
const labels = {
    dark: "Dark",
    light: "Light",
    system: "System"
};
function ThemeToggle() {
    _s();
    const theme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ThemeToggle.useAppStore[theme]": (s)=>s.theme
    }["ThemeToggle.useAppStore[theme]"]);
    const cycleTheme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ThemeToggle.useAppStore[cycleTheme]": (s)=>s.cycleTheme
    }["ThemeToggle.useAppStore[cycleTheme]"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: cycleTheme,
        className: "flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-gray-800 transition-colors text-xs text-gray-400",
        title: `Theme: ${labels[theme]} (press t to toggle)`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: icons[theme]
            }, void 0, false, {
                fileName: "[project]/src/components/layout/ThemeToggle.tsx",
                lineNumber: 27,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: labels[theme]
            }, void 0, false, {
                fileName: "[project]/src/components/layout/ThemeToggle.tsx",
                lineNumber: 28,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                className: "ml-0.5 text-gray-600",
                children: "t"
            }, void 0, false, {
                fileName: "[project]/src/components/layout/ThemeToggle.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/ThemeToggle.tsx",
        lineNumber: 22,
        columnNumber: 5
    }, this);
}
_s(ThemeToggle, "wCXmfYU6DhqslPfO0dygesIfGVk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"]
    ];
});
_c = ThemeToggle;
var _c;
__turbopack_context__.k.register(_c, "ThemeToggle");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/PanelHeader.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PanelHeader",
    ()=>PanelHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
function PanelHeader({ title, active, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center justify-between px-3 py-1.5 border-b border-gray-800 flex-shrink-0",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: `text-xs tracking-wide transition-colors ${active ? "text-gray-100 font-bold" : "text-gray-500 font-medium"}`,
                children: title
            }, void 0, false, {
                fileName: "[project]/src/components/layout/PanelHeader.tsx",
                lineNumber: 16,
                columnNumber: 7
            }, this),
            children && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3",
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/layout/PanelHeader.tsx",
                lineNumber: 24,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/PanelHeader.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
_c = PanelHeader;
var _c;
__turbopack_context__.k.register(_c, "PanelHeader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/TerminalPanel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TerminalPanel",
    ()=>TerminalPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$PanelHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/PanelHeader.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function resolveTheme(theme) {
    if (theme === "system") {
        if (("TURBOPACK compile-time value", "object") !== "undefined" && window.matchMedia("(prefers-color-scheme: light)").matches) {
            return "light";
        }
        return "dark";
    }
    return theme;
}
// Terminal server ports — electron can override via window.__TERMINAL_CONFIG
function getTerminalPorts() {
    const cfg = ("TURBOPACK compile-time truthy", 1) ? window.__TERMINAL_CONFIG : "TURBOPACK unreachable";
    return {
        ttyd: cfg?.ttydPort || 3001,
        ctrl: cfg?.ctrlPort || 3002
    };
}
function TerminalPanel({ onCollapse } = {}) {
    _s();
    const theme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "TerminalPanel.useAppStore[theme]": (s)=>s.theme
    }["TerminalPanel.useAppStore[theme]"]);
    const focusedPanel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "TerminalPanel.useAppStore[focusedPanel]": (s)=>s.focusedPanel
    }["TerminalPanel.useAppStore[focusedPanel]"]);
    const [reloadKey, setReloadKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const currentTerminalTheme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])("dark");
    const initedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const ports = getTerminalPorts();
    // Push theme to the terminal server — on mount AND on change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TerminalPanel.useEffect": ()=>{
            const resolved = resolveTheme(theme);
            if (currentTerminalTheme.current === resolved && initedRef.current) return;
            initedRef.current = true;
            currentTerminalTheme.current = resolved;
            fetch(`http://localhost:${ports.ctrl}/theme`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    theme: resolved
                })
            }).then({
                "TerminalPanel.useEffect": (r)=>r.json()
            }["TerminalPanel.useEffect"]).then({
                "TerminalPanel.useEffect": (result)=>{
                    if (result.restarted) {
                        setTimeout({
                            "TerminalPanel.useEffect": ()=>setReloadKey({
                                    "TerminalPanel.useEffect": (k)=>k + 1
                                }["TerminalPanel.useEffect"])
                        }["TerminalPanel.useEffect"], 500);
                    }
                }
            }["TerminalPanel.useEffect"]).catch({
                "TerminalPanel.useEffect": ()=>{
                // Terminal server not running — ignore
                }
            }["TerminalPanel.useEffect"]);
        }
    }["TerminalPanel.useEffect"], [
        theme
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-full flex flex-col bg-gray-950",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$PanelHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PanelHeader"], {
                title: "Terminal",
                active: focusedPanel === "terminal",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setReloadKey((k)=>k + 1),
                        className: "text-xs text-gray-500 hover:text-gray-200 transition-colors",
                        title: "Reload terminal",
                        children: "↻"
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/TerminalPanel.tsx",
                        lineNumber: 60,
                        columnNumber: 9
                    }, this),
                    onCollapse && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onCollapse,
                        className: "text-xs text-gray-500 hover:text-gray-200 transition-colors",
                        title: "Collapse terminal",
                        children: "›"
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/TerminalPanel.tsx",
                        lineNumber: 68,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/layout/TerminalPanel.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 min-h-0 overflow-hidden bg-gray-950",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("iframe", {
                    src: `http://localhost:${ports.ttyd}`,
                    className: "w-full h-full border-0",
                    title: "Terminal"
                }, reloadKey, false, {
                    fileName: "[project]/src/components/layout/TerminalPanel.tsx",
                    lineNumber: 78,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/layout/TerminalPanel.tsx",
                lineNumber: 77,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/TerminalPanel.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
_s(TerminalPanel, "0Wl1bDm1mhzeEPpcd9fpoEZn1t8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"]
    ];
});
_c = TerminalPanel;
var _c;
__turbopack_context__.k.register(_c, "TerminalPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/AppShell.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppShell",
    ()=>AppShell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useKeyboardShortcuts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useKeyboardShortcuts.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useCliEvents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useCliEvents.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useTheme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useTheme.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useStateSync$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useStateSync.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useEmails$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useEmails.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/Sidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$inbox$2f$ThreadList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/inbox/ThreadList.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$email$2f$ThreadView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/email/ThreadView.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$email$2f$DraftReply$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/email/DraftReply.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$email$2f$ComposeModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/email/ComposeModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$ShortcutHelp$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/ShortcutHelp.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$ThemeToggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/ThemeToggle.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$TerminalPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/TerminalPanel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$PanelHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/PanelHeader.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
function loadSize(key, fallback) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const saved = localStorage.getItem(key);
    return saved ? parseInt(saved, 10) : fallback;
}
function saveSize(key, value) {
    if ("TURBOPACK compile-time truthy", 1) localStorage.setItem(key, String(Math.round(value)));
}
function AppShell() {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useKeyboardShortcuts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useKeyboardShortcuts"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useCliEvents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCliEvents"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useTheme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useStateSync$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStateSync"])();
    const { threads: fetchedThreads, isLoading, loadingMore, hasMore, loadMore, error } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useEmails$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useThreads"])();
    const openThread = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "AppShell.useAppStore[openThread]": (s)=>s.openThread
    }["AppShell.useAppStore[openThread]"]);
    const activeFolder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "AppShell.useAppStore[activeFolder]": (s)=>s.activeFolder
    }["AppShell.useAppStore[activeFolder]"]);
    const isComposeOpen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "AppShell.useAppStore[isComposeOpen]": (s)=>s.isComposeOpen
    }["AppShell.useAppStore[isComposeOpen]"]);
    const showShortcutHelp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "AppShell.useAppStore[showShortcutHelp]": (s)=>s.showShortcutHelp
    }["AppShell.useAppStore[showShortcutHelp]"]);
    const focusedPanel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "AppShell.useAppStore[focusedPanel]": (s)=>s.focusedPanel
    }["AppShell.useAppStore[focusedPanel]"]);
    // In drafts folder, show full-height compose only for standalone drafts (1 message).
    // Reply drafts (>1 message) show thread view + compose like normal folders.
    const isDraftOpen = activeFolder === "drafts" && !!openThread && (openThread.messageCount || openThread.messages?.length || 0) <= 1;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppShell.useEffect": ()=>{
            const { discardedThreadIds, markedReadIds, setThreads } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState();
            const threads = fetchedThreads.filter({
                "AppShell.useEffect.threads": (t)=>!discardedThreadIds.has(t.id)
            }["AppShell.useEffect.threads"]).map({
                "AppShell.useEffect.threads": (t)=>markedReadIds.has(t.id) ? {
                        ...t,
                        isRead: true
                    } : t
            }["AppShell.useEffect.threads"]);
            setThreads(threads);
        }
    }["AppShell.useEffect"], [
        fetchedThreads
    ]);
    // Detect when focus moves to the terminal iframe (cross-origin clicks
    // inside the iframe don't fire mouseDown on parent, but window.blur does)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppShell.useEffect": ()=>{
            function handleBlur() {
                setTimeout({
                    "AppShell.useEffect.handleBlur": ()=>{
                        if (document.activeElement?.tagName === "IFRAME" && document.activeElement.title === "Terminal") {
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().setFocusedPanel("terminal");
                        }
                    }
                }["AppShell.useEffect.handleBlur"], 0);
            }
            window.addEventListener("blur", handleBlur);
            return ({
                "AppShell.useEffect": ()=>window.removeEventListener("blur", handleBlur)
            })["AppShell.useEffect"];
        }
    }["AppShell.useEffect"], []);
    // Thread list width in px (resizable)
    const [threadListW, setThreadListW] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "AppShell.useState": ()=>loadSize("threadlist-w", 320)
    }["AppShell.useState"]);
    // Draft reply height as percentage of the email column
    const [draftPct, setDraftPct] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "AppShell.useState": ()=>loadSize("draft-pct", 35)
    }["AppShell.useState"]);
    // Terminal panel width in px (resizable, 0 = collapsed)
    const [terminalW, setTerminalW] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "AppShell.useState": ()=>loadSize("terminal-w", 500)
    }["AppShell.useState"]);
    const [isDragging, setIsDragging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const terminalCollapsed = terminalW < 60;
    const toggleTerminal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppShell.useCallback[toggleTerminal]": ()=>{
            const next = terminalCollapsed ? loadSize("terminal-w-last", 500) || 500 : terminalW;
            if (terminalCollapsed) {
                setTerminalW(next);
                saveSize("terminal-w", next);
            } else {
                saveSize("terminal-w-last", terminalW);
                setTerminalW(0);
                saveSize("terminal-w", 0);
            }
        }
    }["AppShell.useCallback[toggleTerminal]"], [
        terminalCollapsed,
        terminalW
    ]);
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const emailColRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const startDrag = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppShell.useCallback[startDrag]": (setter, storageKey, axis, getBase, min, max, asPct, refEl, reverse, snapThreshold)=>{
            return ({
                "AppShell.useCallback[startDrag]": (e)=>{
                    e.preventDefault();
                    const startPos = axis === "x" ? e.clientX : e.clientY;
                    const startVal = getBase();
                    function clampAndSnap(raw) {
                        if (snapThreshold !== undefined && raw < snapThreshold) return 0;
                        return Math.max(min, Math.min(max, raw));
                    }
                    function onMove(ev) {
                        const rawDelta = (axis === "x" ? ev.clientX : ev.clientY) - startPos;
                        const delta = reverse ? -rawDelta : rawDelta;
                        if (asPct && refEl?.current) {
                            const total = axis === "x" ? refEl.current.offsetWidth : refEl.current.offsetHeight;
                            const deltaPct = delta / total * 100;
                            const newVal = clampAndSnap(startVal - deltaPct);
                            setter(newVal);
                            saveSize(storageKey, newVal);
                        } else {
                            const newVal = clampAndSnap(startVal + delta);
                            setter(newVal);
                            saveSize(storageKey, newVal);
                        }
                    }
                    function onUp() {
                        document.removeEventListener("mousemove", onMove);
                        document.removeEventListener("mouseup", onUp);
                        document.body.style.cursor = "";
                        document.body.style.userSelect = "";
                        setIsDragging(false);
                    }
                    setIsDragging(true);
                    document.addEventListener("mousemove", onMove);
                    document.addEventListener("mouseup", onUp);
                    document.body.style.cursor = axis === "x" ? "col-resize" : "row-resize";
                    document.body.style.userSelect = "none";
                }
            })["AppShell.useCallback[startDrag]"];
        }
    }["AppShell.useCallback[startDrag]"], []);
    const isAuthError = error?.status === 403 || error?.status === 401;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-screen flex flex-col bg-gray-950 text-gray-100",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-8 flex-shrink-0 bg-gray-950",
                style: {
                    WebkitAppRegion: "drag"
                }
            }, void 0, false, {
                fileName: "[project]/src/components/layout/AppShell.tsx",
                lineNumber: 154,
                columnNumber: 7
            }, this),
            isDragging && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-50",
                style: {
                    cursor: "col-resize"
                }
            }, void 0, false, {
                fileName: "[project]/src/components/layout/AppShell.tsx",
                lineNumber: 156,
                columnNumber: 9
            }, this),
            isAuthError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4 py-2 bg-yellow-900/80 border-b border-yellow-700 text-yellow-200 text-sm flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Google session expired. Please sign in again to refresh your token."
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/AppShell.tsx",
                        lineNumber: 163,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: "/api/auth/signin?callbackUrl=/",
                        className: "ml-4 px-3 py-1 bg-yellow-700 hover:bg-yellow-600 rounded text-white text-xs font-medium",
                        children: "Sign In"
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/AppShell.tsx",
                        lineNumber: 164,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/layout/AppShell.tsx",
                lineNumber: 162,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: containerRef,
                className: "flex-1 flex min-h-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-44 flex-shrink-0 h-full overflow-hidden",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sidebar"], {}, void 0, false, {
                            fileName: "[project]/src/components/layout/AppShell.tsx",
                            lineNumber: 175,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/AppShell.tsx",
                        lineNumber: 174,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: threadListW
                        },
                        className: "flex-shrink-0 h-full overflow-hidden",
                        onMouseDown: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().setFocusedPanel("threads"),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col h-full",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$PanelHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PanelHeader"], {
                                    title: "Threads",
                                    active: focusedPanel === "threads"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/AppShell.tsx",
                                    lineNumber: 185,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SearchBar, {}, void 0, false, {
                                    fileName: "[project]/src/components/layout/AppShell.tsx",
                                    lineNumber: 186,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$inbox$2f$ThreadList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThreadList"], {
                                    isLoading: isLoading,
                                    loadingMore: loadingMore,
                                    hasMore: hasMore,
                                    onLoadMore: loadMore
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/AppShell.tsx",
                                    lineNumber: 187,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/AppShell.tsx",
                            lineNumber: 184,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/AppShell.tsx",
                        lineNumber: 179,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DragHandle, {
                        direction: "col",
                        onMouseDown: startDrag(setThreadListW, "threadlist-w", "x", ()=>threadListW, 200, 500)
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/AppShell.tsx",
                        lineNumber: 191,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: emailColRef,
                        className: "flex-1 min-w-0 h-full overflow-hidden flex flex-col",
                        onMouseDown: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().setFocusedPanel("email"),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$PanelHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PanelHeader"], {
                                title: "Email",
                                active: focusedPanel === "email"
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/AppShell.tsx",
                                lineNumber: 202,
                                columnNumber: 11
                            }, this),
                            isDraftOpen ? /* Draft folder: full-height compose, no thread above */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$email$2f$DraftReply$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DraftReply"], {}, void 0, false, {
                                fileName: "[project]/src/components/layout/AppShell.tsx",
                                lineNumber: 205,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            flex: `${100 - draftPct} 0 0%`
                                        },
                                        className: "overflow-auto min-h-0",
                                        children: openThread ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$email$2f$ThreadView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThreadView"], {}, void 0, false, {
                                            fileName: "[project]/src/components/layout/AppShell.tsx",
                                            lineNumber: 211,
                                            columnNumber: 19
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-center h-full text-gray-600",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-lg",
                                                        children: "Select a conversation"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/layout/AppShell.tsx",
                                                        lineNumber: 215,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm mt-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                                className: "px-1.5 py-0.5 bg-gray-800 rounded text-gray-400",
                                                                children: "j"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/layout/AppShell.tsx",
                                                                lineNumber: 217,
                                                                columnNumber: 25
                                                            }, this),
                                                            "/",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                                className: "px-1.5 py-0.5 bg-gray-800 rounded text-gray-400",
                                                                children: "k"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/layout/AppShell.tsx",
                                                                lineNumber: 218,
                                                                columnNumber: 25
                                                            }, this),
                                                            " navigate ·",
                                                            " ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                                className: "px-1.5 py-0.5 bg-gray-800 rounded text-gray-400",
                                                                children: "Enter"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/layout/AppShell.tsx",
                                                                lineNumber: 219,
                                                                columnNumber: 25
                                                            }, this),
                                                            " open"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/layout/AppShell.tsx",
                                                        lineNumber: 216,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/layout/AppShell.tsx",
                                                lineNumber: 214,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/AppShell.tsx",
                                            lineNumber: 213,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/AppShell.tsx",
                                        lineNumber: 209,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DragHandle, {
                                        direction: "row",
                                        onMouseDown: startDrag(setDraftPct, "draft-pct", "y", ()=>draftPct, 10, 70, true, emailColRef)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/AppShell.tsx",
                                        lineNumber: 226,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            flex: `${draftPct} 0 0%`
                                        },
                                        className: "overflow-hidden border-t border-gray-800 min-h-0",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$email$2f$DraftReply$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DraftReply"], {}, void 0, false, {
                                            fileName: "[project]/src/components/layout/AppShell.tsx",
                                            lineNumber: 233,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/AppShell.tsx",
                                        lineNumber: 232,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/layout/AppShell.tsx",
                        lineNumber: 197,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DragHandle, {
                        direction: "col",
                        onMouseDown: startDrag((v)=>{
                            setTerminalW(v);
                            if (v >= 60) saveSize("terminal-w-last", v);
                        }, "terminal-w", "x", ()=>terminalW, 200, 900, false, undefined, true, 200)
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/AppShell.tsx",
                        lineNumber: 240,
                        columnNumber: 9
                    }, this),
                    terminalCollapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: toggleTerminal,
                        className: "flex-shrink-0 h-full w-6 border-l border-gray-800 bg-gray-900 hover:bg-gray-800 text-gray-500 hover:text-gray-200 text-xs flex items-center justify-center transition-colors",
                        title: "Show terminal",
                        children: "‹"
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/AppShell.tsx",
                        lineNumber: 259,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: terminalCollapsed ? 0 : terminalW,
                            visibility: terminalCollapsed ? "hidden" : "visible"
                        },
                        className: "flex-shrink-0 h-full overflow-hidden border-l border-gray-800",
                        onMouseDown: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().setFocusedPanel("terminal"),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$TerminalPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TerminalPanel"], {
                            onCollapse: toggleTerminal
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/AppShell.tsx",
                            lineNumber: 275,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/AppShell.tsx",
                        lineNumber: 267,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/layout/AppShell.tsx",
                lineNumber: 172,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between px-4 py-1.5 bg-gray-900 border-t border-gray-800 text-xs text-gray-500",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$ThemeToggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThemeToggle"], {}, void 0, false, {
                            fileName: "[project]/src/components/layout/AppShell.tsx",
                            lineNumber: 282,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                    className: "text-gray-400",
                                    children: "j/k"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/AppShell.tsx",
                                    lineNumber: 283,
                                    columnNumber: 17
                                }, this),
                                " navigate"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/AppShell.tsx",
                            lineNumber: 283,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                    className: "text-gray-400",
                                    children: "Enter"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/AppShell.tsx",
                                    lineNumber: 284,
                                    columnNumber: 17
                                }, this),
                                " open"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/AppShell.tsx",
                            lineNumber: 284,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                    className: "text-gray-400",
                                    children: "e"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/AppShell.tsx",
                                    lineNumber: 285,
                                    columnNumber: 17
                                }, this),
                                " archive"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/AppShell.tsx",
                            lineNumber: 285,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                    className: "text-gray-400",
                                    children: "d"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/AppShell.tsx",
                                    lineNumber: 286,
                                    columnNumber: 17
                                }, this),
                                " done/inbox"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/AppShell.tsx",
                            lineNumber: 286,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                    className: "text-gray-400",
                                    children: "u"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/AppShell.tsx",
                                    lineNumber: 287,
                                    columnNumber: 17
                                }, this),
                                " read/unread"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/AppShell.tsx",
                            lineNumber: 287,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                    className: "text-gray-400",
                                    children: "r"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/AppShell.tsx",
                                    lineNumber: 288,
                                    columnNumber: 17
                                }, this),
                                " reply"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/AppShell.tsx",
                            lineNumber: 288,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                    className: "text-gray-400",
                                    children: "c"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/AppShell.tsx",
                                    lineNumber: 289,
                                    columnNumber: 17
                                }, this),
                                " compose"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/AppShell.tsx",
                            lineNumber: 289,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                    className: "text-gray-400",
                                    children: "/"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/AppShell.tsx",
                                    lineNumber: 290,
                                    columnNumber: 17
                                }, this),
                                " search"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/AppShell.tsx",
                            lineNumber: 290,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                    className: "text-gray-400",
                                    children: "?"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/AppShell.tsx",
                                    lineNumber: 291,
                                    columnNumber: 17
                                }, this),
                                " help"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/AppShell.tsx",
                            lineNumber: 291,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/layout/AppShell.tsx",
                    lineNumber: 281,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/layout/AppShell.tsx",
                lineNumber: 280,
                columnNumber: 7
            }, this),
            isComposeOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$email$2f$ComposeModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComposeModal"], {}, void 0, false, {
                fileName: "[project]/src/components/layout/AppShell.tsx",
                lineNumber: 295,
                columnNumber: 25
            }, this),
            showShortcutHelp && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$ShortcutHelp$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShortcutHelp"], {}, void 0, false, {
                fileName: "[project]/src/components/layout/AppShell.tsx",
                lineNumber: 296,
                columnNumber: 28
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/AppShell.tsx",
        lineNumber: 152,
        columnNumber: 5
    }, this);
}
_s(AppShell, "11zHq+McpqRvghSxSf2c8wpZDWU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useKeyboardShortcuts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useKeyboardShortcuts"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useCliEvents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCliEvents"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useTheme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useStateSync$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStateSync"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useEmails$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useThreads"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"]
    ];
});
_c = AppShell;
function DragHandle({ onMouseDown, direction }) {
    const isCol = direction === "col";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        onMouseDown: onMouseDown,
        className: `flex-shrink-0 flex items-center justify-center
        ${isCol ? "w-2 cursor-col-resize" : "h-2 cursor-row-resize"}
        bg-gray-800 hover:bg-gray-600 active:bg-gray-500 transition-colors`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `rounded-full bg-gray-600 ${isCol ? "w-0.5 h-8" : "h-0.5 w-8"}`
        }, void 0, false, {
            fileName: "[project]/src/components/layout/AppShell.tsx",
            lineNumber: 316,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/layout/AppShell.tsx",
        lineNumber: 310,
        columnNumber: 5
    }, this);
}
_c1 = DragHandle;
function SearchBar() {
    _s1();
    const searchQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "SearchBar.useAppStore[searchQuery]": (s)=>s.searchQuery
    }["SearchBar.useAppStore[searchQuery]"]);
    const setSearchQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "SearchBar.useAppStore[setSearchQuery]": (s)=>s.setSearchQuery
    }["SearchBar.useAppStore[setSearchQuery]"]);
    function handleKeyDown(e) {
        if (e.key === "Escape") {
            setSearchQuery("");
            e.target.blur();
            e.preventDefault();
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-2 border-b border-gray-800",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            id: "search-input",
            type: "text",
            placeholder: "Search emails... (press /)",
            value: searchQuery,
            onChange: (e)=>setSearchQuery(e.target.value),
            onKeyDown: handleKeyDown,
            className: "w-full px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-md text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
        }, void 0, false, {
            fileName: "[project]/src/components/layout/AppShell.tsx",
            lineNumber: 335,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/layout/AppShell.tsx",
        lineNumber: 334,
        columnNumber: 5
    }, this);
}
_s1(SearchBar, "Dh/KEVAc6Hy4K7ve96nInXx9eJI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"]
    ];
});
_c2 = SearchBar;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "AppShell");
__turbopack_context__.k.register(_c1, "DragHandle");
__turbopack_context__.k.register(_c2, "SearchBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/react.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$AppShell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/AppShell.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function Home() {
    _s();
    const { data: session, status } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSession"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            if (status === "unauthenticated") {
                router.push("/api/auth/signin?callbackUrl=%2F");
            }
        }
    }["Home.useEffect"], [
        status,
        router
    ]);
    if (status === "loading") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-gray-950 flex items-center justify-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-8 flex-shrink-0 bg-gray-950 fixed top-0 left-0 right-0",
                    style: {
                        WebkitAppRegion: "drag"
                    }
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 21,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-gray-400",
                    children: "Loading..."
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 22,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 20,
            columnNumber: 7
        }, this);
    }
    if (!session) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-8 flex-shrink-0 bg-gray-950 fixed top-0 left-0 right-0",
        style: {
            WebkitAppRegion: "drag"
        }
    }, void 0, false, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$AppShell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AppShell"], {}, void 0, false, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 31,
        columnNumber: 10
    }, this);
}
_s(Home, "IsB+X4/uCtap/BkD4g9WA4/8vZ8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSession"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_b1941a95._.js.map