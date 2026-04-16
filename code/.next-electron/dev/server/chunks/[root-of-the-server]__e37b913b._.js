module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/src/lib/prisma.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/node_modules/@prisma/client)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$adapter$2d$better$2d$sqlite3$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@prisma/adapter-better-sqlite3/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
;
const globalForPrisma = globalThis;
function createPrismaClient() {
    const dbPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), "prisma", "dev.db");
    const adapter = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$adapter$2d$better$2d$sqlite3$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PrismaBetterSqlite3"]({
        url: dbPath
    });
    return new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClient"]({
        adapter
    });
}
const prisma = globalForPrisma.prisma || createPrismaClient();
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = prisma;
}),
"[project]/src/lib/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "auth",
    ()=>auth,
    "getLinkedAccounts",
    ()=>getLinkedAccounts,
    "getValidAccessToken",
    ()=>getValidAccessToken,
    "handlers",
    ()=>handlers,
    "signIn",
    ()=>signIn,
    "signOut",
    ()=>signOut
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next-auth/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$providers$2f$google$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next-auth/providers/google.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$node_modules$2f40$auth$2f$core$2f$providers$2f$google$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/node_modules/@auth/core/providers/google.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$auth$2f$prisma$2d$adapter$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@auth/prisma-adapter/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
;
;
;
;
const { handlers, auth, signIn, signOut } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"])({
    adapter: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$auth$2f$prisma$2d$adapter$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PrismaAdapter"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"]),
    providers: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$node_modules$2f40$auth$2f$core$2f$providers$2f$google$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    scope: "openid email profile https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/documents",
                    // Note: drive + documents scopes granted as of 2026-04-06 sign-in
                    access_type: "offline",
                    prompt: "consent"
                }
            }
        })
    ],
    session: {
        strategy: "database"
    },
    callbacks: {
        // Update stored tokens on every sign-in so a revoked refresh token
        // gets replaced with the fresh one from the new OAuth flow.
        async signIn ({ user, account }) {
            if (account?.provider === "google" && user.id) {
                try {
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].account.updateMany({
                        where: {
                            userId: user.id,
                            provider: "google"
                        },
                        data: {
                            access_token: account.access_token,
                            refresh_token: account.refresh_token ?? undefined,
                            expires_at: account.expires_at
                        }
                    });
                } catch  {
                // First sign-in — account doesn't exist yet, adapter will create it
                }
            }
            return true;
        },
        async session ({ session, user }) {
            session.user.id = user.id;
            return session;
        }
    }
});
async function getValidAccessToken(userId, provider = "google") {
    const account = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].account.findFirst({
        where: {
            userId,
            provider
        }
    });
    if (!account?.access_token) return null;
    // Check if token is still valid (with 5 min buffer)
    const expiresAt = account.expires_at ? account.expires_at * 1000 : 0;
    if (Date.now() < expiresAt - 5 * 60 * 1000) {
        return account.access_token;
    }
    // Token expired, refresh it
    if (!account.refresh_token) return null;
    try {
        const res = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                grant_type: "refresh_token",
                refresh_token: account.refresh_token
            })
        });
        if (!res.ok) {
            console.error("Google token refresh failed:", res.status, res.statusText);
            return null;
        }
        const tokenResponse = await res.json();
        if (!tokenResponse.access_token) {
            console.error("Google token response missing access_token:", tokenResponse);
            return null;
        }
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].account.update({
            where: {
                id: account.id
            },
            data: {
                access_token: tokenResponse.access_token,
                expires_at: Math.floor(Date.now() / 1000 + tokenResponse.expires_in)
            }
        });
        return tokenResponse.access_token;
    } catch (error) {
        console.error("Failed to refresh Google token:", error);
        return null;
    }
}
async function getLinkedAccounts(userId) {
    const accounts = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].account.findMany({
        where: {
            userId
        },
        select: {
            provider: true,
            providerAccountId: true
        }
    });
    return accounts;
}
}),
"[externals]/child_process [external] (child_process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("child_process", () => require("child_process"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/process [external] (process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("process", () => require("process"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/querystring [external] (querystring, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("querystring", () => require("querystring"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/http2 [external] (http2, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http2", () => require("http2"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[project]/src/lib/email/types.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cleanSubject",
    ()=>cleanSubject,
    "uniqueParticipants",
    ()=>uniqueParticipants
]);
function cleanSubject(subject) {
    // Strip Re:/Fwd:/Fw: prefixes and [EXTERNAL]/[WARNING - EXTERNAL] tags
    return subject.replace(/\[[\w\s-]*EXTERNAL[\w\s-]*\]\s*/gi, "").replace(/^(Re:\s*|Fwd:\s*|Fw:\s*)+/i, "").trim();
}
function uniqueParticipants(messages) {
    const seen = new Set();
    const result = [];
    for (const msg of messages){
        for (const addr of [
            msg.from,
            ...msg.to,
            ...msg.cc
        ]){
            if (addr.email && !seen.has(addr.email)) {
                seen.add(addr.email);
                result.push(addr);
            }
        }
    }
    return result;
}
}),
"[project]/src/lib/email/gmail.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "gmailClient",
    ()=>gmailClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$googleapis$2f$build$2f$src$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/googleapis/build/src/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/email/types.ts [app-route] (ecmascript)");
;
;
function getGmailClient(accessToken) {
    const auth = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$googleapis$2f$build$2f$src$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["google"].auth.OAuth2();
    auth.setCredentials({
        access_token: accessToken
    });
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$googleapis$2f$build$2f$src$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["google"].gmail({
        version: "v1",
        auth
    });
}
function parseHeader(headers, name) {
    return headers?.find((h)=>h.name?.toLowerCase() === name.toLowerCase())?.value || "";
}
function parseEmailAddress(raw) {
    const match = raw.match(/^(.+?)\s*<(.+?)>$/);
    if (match) return {
        name: match[1].trim().replace(/^"|"$/g, ""),
        email: match[2]
    };
    return {
        name: "",
        email: raw.trim()
    };
}
function parseEmailAddresses(raw) {
    if (!raw) return [];
    return raw.split(",").map((s)=>parseEmailAddress(s.trim()));
}
function folderToQuery(folder) {
    switch(folder){
        case "sent":
            return "in:sent";
        case "drafts":
            return "in:drafts";
        case "archive":
            return "-in:inbox -in:sent -in:drafts -in:trash -in:spam";
        case "done":
            return "label:done";
        case "promotions":
            return "in:inbox category:promotions";
        case "inbox":
        default:
            return "in:inbox -category:promotions";
    }
}
async function getOrCreateLabel(gmail, name) {
    const res = await gmail.users.labels.list({
        userId: "me"
    });
    const existing = res.data.labels?.find((l)=>l.name.toLowerCase() === name.toLowerCase());
    if (existing?.id) return existing.id;
    const created = await gmail.users.labels.create({
        userId: "me",
        requestBody: {
            name,
            labelListVisibility: "labelShow",
            messageListVisibility: "show"
        }
    });
    return created.data.id;
}
function collectParts(payload) {
    const result = [];
    if (!payload) return result;
    if (payload.parts) {
        for (const part of payload.parts){
            result.push(...collectParts(part));
        }
    } else {
        result.push(payload);
    }
    return result;
}
function gmailMessageToEmail(message, includeBody) {
    const headers = message.payload?.headers || [];
    const labelIds = message.labelIds || [];
    const allParts = collectParts(message.payload);
    let body = "";
    const attachments = [];
    const cidMap = {};
    if (includeBody && message.payload) {
        const htmlPart = allParts.find((p)=>p.mimeType === "text/html");
        const textPart = allParts.find((p)=>p.mimeType === "text/plain");
        const bodyData = htmlPart?.body?.data || textPart?.body?.data || message.payload.body?.data;
        if (bodyData) {
            body = Buffer.from(bodyData, "base64url").toString("utf-8");
        }
    }
    // Extract attachments and CID map for inline images
    for (const part of allParts){
        const attachId = part.body?.attachmentId;
        const filename = part.filename;
        const mimeType = part.mimeType || "";
        if (attachId && filename) {
            attachments.push({
                id: attachId,
                messageId: message.id || "",
                filename,
                mimeType,
                size: part.body?.size || 0
            });
        }
        // Build CID map for inline images
        if (attachId && mimeType.startsWith("image/")) {
            const cidHeader = (part.headers || []).find((h)=>h.name?.toLowerCase() === "content-id");
            if (cidHeader) {
                const cid = cidHeader.value.replace(/^<|>$/g, "");
                cidMap[cid] = `/api/emails/${message.id}/attachments/${attachId}`;
            }
        }
    }
    // Replace cid: references with proxied URLs
    if (body && Object.keys(cidMap).length > 0) {
        for (const [cid, url] of Object.entries(cidMap)){
            body = body.replace(new RegExp(`cid:${cid.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, "g"), url);
        }
    }
    return {
        id: message.id || "",
        provider: "gmail",
        threadId: message.threadId || "",
        from: parseEmailAddress(parseHeader(headers, "From")),
        to: parseEmailAddresses(parseHeader(headers, "To")),
        cc: parseEmailAddresses(parseHeader(headers, "Cc")),
        subject: parseHeader(headers, "Subject"),
        snippet: message.snippet || "",
        body,
        date: parseHeader(headers, "Date"),
        isRead: !labelIds.includes("UNREAD"),
        isStarred: labelIds.includes("STARRED"),
        labels: labelIds,
        hasAttachments: attachments.length > 0 || message.payload?.mimeType === "multipart/mixed",
        attachments
    };
}
function messagesToThread(threadId, messages) {
    // Filter out trashed messages
    const active = messages.filter((m)=>!m.labels.includes("TRASH"));
    const sorted = [
        ...active.length ? active : messages
    ].sort((a, b)=>new Date(a.date).getTime() - new Date(b.date).getTime());
    const latest = sorted[sorted.length - 1];
    return {
        id: threadId,
        provider: "gmail",
        subject: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cleanSubject"])(latest.subject || sorted[0].subject),
        snippet: latest.snippet,
        participants: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uniqueParticipants"])(sorted),
        messageCount: sorted.length,
        messages: sorted,
        latestDate: latest.date,
        isRead: sorted.every((m)=>m.isRead),
        isStarred: sorted.some((m)=>m.isStarred),
        hasAttachments: sorted.some((m)=>m.hasAttachments)
    };
}
// Split a Gmail thread into virtual sub-threads when messages have different subjects.
// Gmail groups by References/In-Reply-To headers, ignoring subject changes.
function splitThreadBySubject(threadId, messages) {
    const active = messages.filter((m)=>!m.labels.includes("TRASH"));
    const msgs = active.length ? active : messages;
    // Group by cleaned subject
    const groups = new Map();
    for (const m of msgs){
        const key = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cleanSubject"])(m.subject).toLowerCase();
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(m);
    }
    if (groups.size <= 1) {
        return [
            messagesToThread(threadId, messages)
        ];
    }
    // Multiple subjects — create virtual threads
    // Use threadId:subjectHash as virtual ID so the app can still operate on them
    const result = [];
    for (const [, groupMsgs] of groups){
        const sorted = [
            ...groupMsgs
        ].sort((a, b)=>new Date(a.date).getTime() - new Date(b.date).getTime());
        const latest = sorted[sorted.length - 1];
        const virtualId = `${threadId}:${sorted[0].id}`;
        result.push({
            id: virtualId,
            provider: "gmail",
            subject: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cleanSubject"])(latest.subject || sorted[0].subject),
            snippet: latest.snippet,
            participants: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uniqueParticipants"])(sorted),
            messageCount: sorted.length,
            messages: sorted,
            latestDate: latest.date,
            isRead: sorted.every((m)=>m.isRead),
            isStarred: sorted.some((m)=>m.isStarred),
            hasAttachments: sorted.some((m)=>m.hasAttachments)
        });
    }
    return result;
}
function resolveThreadId(threadId) {
    return threadId.includes(":") ? threadId.split(":", 2)[0] : threadId;
}
const gmailClient = {
    async listThreads (accessToken, params) {
        const gmail = getGmailClient(accessToken);
        const q = params.query ? `${folderToQuery(params.folder)} ${params.query}` : folderToQuery(params.folder);
        const maxResults = params.maxResults || 30;
        // Use messages.list instead of threads.list because Gmail sorts messages
        // by date but threads by thread ID (creation time). This ensures threads
        // with recent replies appear at the top even if the thread started long ago.
        // Fetch extra messages because a thread's latest message (e.g. SENT) may be
        // newer than its latest INBOX message, so we need to over-fetch to catch
        // threads that belong on the first page by thread date.
        const listRes = await gmail.users.messages.list({
            userId: "me",
            q,
            maxResults: maxResults * 4,
            pageToken: params.pageToken || undefined
        });
        const msgItems = listRes.data.messages || [];
        const seen = new Set();
        const uniqueThreadIds = [];
        for (const m of msgItems){
            if (m.threadId && !seen.has(m.threadId)) {
                seen.add(m.threadId);
                uniqueThreadIds.push(m.threadId);
            }
        }
        const threadGroups = await Promise.all(uniqueThreadIds.map(async (tid)=>{
            const detail = await gmail.users.threads.get({
                userId: "me",
                id: tid,
                format: "metadata",
                metadataHeaders: [
                    "From",
                    "To",
                    "Cc",
                    "Subject",
                    "Date"
                ]
            });
            const messages = (detail.data.messages || []).map((m)=>gmailMessageToEmail(m, false));
            return splitThreadBySubject(tid, messages);
        }));
        // Flatten split threads and sort by latest date, then cap to requested page size
        const allThreads = threadGroups.flat().sort((a, b)=>new Date(b.latestDate).getTime() - new Date(a.latestDate).getTime());
        const threads = allThreads.slice(0, maxResults);
        return {
            threads,
            // Only pass nextPageToken if there are more threads beyond this page
            nextPageToken: allThreads.length > maxResults || listRes.data.nextPageToken ? listRes.data.nextPageToken || undefined : undefined
        };
    },
    async getThread (accessToken, threadId) {
        const gmail = getGmailClient(accessToken);
        // Handle virtual thread IDs (realThreadId:firstMessageId) from subject splitting
        const [realThreadId, splitMsgId] = threadId.includes(":") ? threadId.split(":", 2) : [
            threadId,
            undefined
        ];
        const detail = await gmail.users.threads.get({
            userId: "me",
            id: realThreadId,
            format: "full"
        });
        const allMessages = (detail.data.messages || []).map((m)=>gmailMessageToEmail(m, true));
        if (splitMsgId) {
            // Find the subject group that contains the split message
            const splitMsg = allMessages.find((m)=>m.id === splitMsgId);
            if (splitMsg) {
                const targetSubject = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cleanSubject"])(splitMsg.subject).toLowerCase();
                const filtered = allMessages.filter((m)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cleanSubject"])(m.subject).toLowerCase() === targetSubject);
                return messagesToThread(threadId, filtered);
            }
        }
        return messagesToThread(threadId, allMessages);
    },
    async listEmails (accessToken, params) {
        const gmail = getGmailClient(accessToken);
        const q = params.query ? `${folderToQuery(params.folder)} ${params.query}` : folderToQuery(params.folder);
        const listRes = await gmail.users.messages.list({
            userId: "me",
            q,
            maxResults: params.maxResults || 50,
            pageToken: params.pageToken || undefined
        });
        const messageIds = listRes.data.messages || [];
        const emails = await Promise.all(messageIds.map(async (msg)=>{
            const detail = await gmail.users.messages.get({
                userId: "me",
                id: msg.id,
                format: "metadata",
                metadataHeaders: [
                    "From",
                    "To",
                    "Cc",
                    "Subject",
                    "Date"
                ]
            });
            return gmailMessageToEmail(detail.data, false);
        }));
        return {
            emails,
            nextPageToken: listRes.data.nextPageToken || undefined
        };
    },
    async getEmail (accessToken, messageId) {
        const gmail = getGmailClient(accessToken);
        const detail = await gmail.users.messages.get({
            userId: "me",
            id: messageId,
            format: "full"
        });
        return gmailMessageToEmail(detail.data, true);
    },
    async archiveEmail (accessToken, messageId) {
        const gmail = getGmailClient(accessToken);
        await gmail.users.messages.modify({
            userId: "me",
            id: messageId,
            requestBody: {
                removeLabelIds: [
                    "INBOX"
                ]
            }
        });
    },
    async archiveThread (accessToken, threadId) {
        const gmail = getGmailClient(accessToken);
        await gmail.users.threads.modify({
            userId: "me",
            id: resolveThreadId(threadId),
            requestBody: {
                removeLabelIds: [
                    "INBOX"
                ]
            }
        });
    },
    async moveToDone (accessToken, threadId) {
        const gmail = getGmailClient(accessToken);
        const labelId = await getOrCreateLabel(gmail, "Done");
        await gmail.users.threads.modify({
            userId: "me",
            id: resolveThreadId(threadId),
            requestBody: {
                addLabelIds: [
                    labelId
                ],
                removeLabelIds: [
                    "INBOX"
                ]
            }
        });
    },
    async moveToInbox (accessToken, threadId) {
        const gmail = getGmailClient(accessToken);
        const labelId = await getOrCreateLabel(gmail, "Done");
        await gmail.users.threads.modify({
            userId: "me",
            id: resolveThreadId(threadId),
            requestBody: {
                addLabelIds: [
                    "INBOX"
                ],
                removeLabelIds: [
                    labelId
                ]
            }
        });
    },
    async markAsRead (accessToken, messageId) {
        const gmail = getGmailClient(accessToken);
        await gmail.users.messages.modify({
            userId: "me",
            id: messageId,
            requestBody: {
                removeLabelIds: [
                    "UNREAD"
                ]
            }
        });
    },
    async markThreadAsRead (accessToken, threadId) {
        const gmail = getGmailClient(accessToken);
        await gmail.users.threads.modify({
            userId: "me",
            id: resolveThreadId(threadId),
            requestBody: {
                removeLabelIds: [
                    "UNREAD"
                ]
            }
        });
    },
    async markThreadAsUnread (accessToken, threadId) {
        const gmail = getGmailClient(accessToken);
        await gmail.users.threads.modify({
            userId: "me",
            id: resolveThreadId(threadId),
            requestBody: {
                addLabelIds: [
                    "UNREAD"
                ]
            }
        });
    },
    async sendEmail (accessToken, params) {
        const gmail = getGmailClient(accessToken);
        let attData;
        if (params.attachments?.length) {
            attData = await fetchAttachmentData(accessToken, params.attachments);
        }
        // Merge uploaded attachments (already have base64 data)
        if (params.uploadedAttachments?.length) {
            const uploaded = params.uploadedAttachments.map((a)=>({
                    filename: a.filename,
                    mimeType: a.mimeType,
                    base64Data: a.base64Data
                }));
            attData = attData ? [
                ...attData,
                ...uploaded
            ] : uploaded;
        }
        // Fetch the original message's Message-ID header for In-Reply-To/References
        let inReplyTo;
        let references;
        if (params.replyToMessageId) {
            try {
                const origMsg = await gmail.users.messages.get({
                    userId: "me",
                    id: resolveThreadId(params.replyToMessageId),
                    format: "metadata",
                    metadataHeaders: [
                        "Message-ID",
                        "References"
                    ]
                });
                const origHeaders = origMsg.data.payload?.headers || [];
                const messageId = origHeaders.find((h)=>h.name.toLowerCase() === "message-id")?.value;
                const origRefs = origHeaders.find((h)=>h.name.toLowerCase() === "references")?.value;
                if (messageId) {
                    inReplyTo = messageId;
                    references = origRefs ? `${origRefs} ${messageId}` : messageId;
                }
            } catch  {
            // Non-fatal — send without threading headers
            }
        }
        const encodedMessage = buildRawMessage(params, attData, inReplyTo, references);
        const threadId = params.threadId ? resolveThreadId(params.threadId) : params.replyToMessageId ? resolveThreadId(params.replyToMessageId) : undefined;
        await gmail.users.messages.send({
            userId: "me",
            requestBody: {
                raw: encodedMessage,
                threadId
            }
        });
    },
    async searchEmails (accessToken, query, maxResults = 20) {
        // Search all mail — don't restrict to a folder
        const gmail = getGmailClient(accessToken);
        const listRes = await gmail.users.messages.list({
            userId: "me",
            q: query,
            maxResults
        });
        const messageIds = listRes.data.messages || [];
        const emails = await Promise.all(messageIds.map(async (msg)=>{
            const detail = await gmail.users.messages.get({
                userId: "me",
                id: msg.id,
                format: "metadata",
                metadataHeaders: [
                    "From",
                    "To",
                    "Cc",
                    "Subject",
                    "Date"
                ]
            });
            return gmailMessageToEmail(detail.data, false);
        }));
        return {
            emails,
            nextPageToken: listRes.data.nextPageToken || undefined
        };
    },
    async createDraft (accessToken, params) {
        const gmail = getGmailClient(accessToken);
        let attData;
        if (params.attachments?.length) {
            attData = await fetchAttachmentData(accessToken, params.attachments);
        }
        const raw = buildRawMessage(params, attData);
        const res = await gmail.users.drafts.create({
            userId: "me",
            requestBody: {
                message: {
                    raw,
                    threadId: params.threadId ? resolveThreadId(params.threadId) : undefined
                }
            }
        });
        return parseDraftResponse(res.data);
    },
    async updateDraft (accessToken, draftId, params) {
        const gmail = getGmailClient(accessToken);
        let attData;
        if (params.attachments?.length) {
            attData = await fetchAttachmentData(accessToken, params.attachments);
        }
        const raw = buildRawMessage(params, attData);
        const res = await gmail.users.drafts.update({
            userId: "me",
            id: draftId,
            requestBody: {
                message: {
                    raw,
                    threadId: params.threadId ? resolveThreadId(params.threadId) : undefined
                }
            }
        });
        return parseDraftResponse(res.data);
    },
    async deleteDraft (accessToken, draftId) {
        const gmail = getGmailClient(accessToken);
        await gmail.users.drafts.delete({
            userId: "me",
            id: draftId
        });
    },
    async getAttachment (accessToken, messageId, attachmentId) {
        const gmail = getGmailClient(accessToken);
        const res = await gmail.users.messages.attachments.get({
            userId: "me",
            messageId,
            id: attachmentId
        });
        return {
            data: res.data.data || ""
        };
    },
    async getDraftsForThread (accessToken, threadId) {
        const gmail = getGmailClient(accessToken);
        // List drafts and check threadId from the summary (no extra API calls)
        const listRes = await gmail.users.drafts.list({
            userId: "me"
        });
        const drafts = listRes.data.drafts || [];
        for (const d of drafts){
            if (d.message?.threadId === resolveThreadId(threadId)) {
                const detail = await gmail.users.drafts.get({
                    userId: "me",
                    id: d.id,
                    format: "full"
                });
                return parseDraftResponse(detail.data);
            }
        }
        return null;
    }
};
function encodeRfc2047(str) {
    if (!/[^\x00-\x7F]/.test(str)) return str;
    return `=?UTF-8?B?${Buffer.from(str, "utf-8").toString("base64")}?=`;
}
function formatAddr(a) {
    if (!a.name) return a.email;
    return `${encodeRfc2047(a.name)} <${a.email}>`;
}
function buildRawMessage(params, attachmentData, inReplyTo, references) {
    const toHeader = params.to.map(formatAddr).join(", ");
    const ccHeader = params.cc?.filter((a)=>a.email).map(formatAddr).join(", ") || "";
    const bccHeader = params.bcc?.filter((a)=>a.email).map(formatAddr).join(", ") || "";
    let raw = `To: ${toHeader}\n`;
    if (ccHeader) raw += `Cc: ${ccHeader}\n`;
    if (bccHeader) raw += `Bcc: ${bccHeader}\n`;
    raw += `Subject: ${encodeRfc2047(params.subject)}\n`;
    if (inReplyTo) raw += `In-Reply-To: ${inReplyTo}\n`;
    if (references) raw += `References: ${references}\n`;
    raw += `MIME-Version: 1.0\n`;
    if (attachmentData && attachmentData.length > 0) {
        const boundary = `boundary_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        raw += `Content-Type: multipart/mixed; boundary="${boundary}"\n\n`;
        // HTML body part
        raw += `--${boundary}\n`;
        raw += `Content-Type: text/html; charset=utf-8\n\n`;
        raw += params.body + "\n\n";
        // Attachment parts
        for (const att of attachmentData){
            raw += `--${boundary}\n`;
            raw += `Content-Type: ${att.mimeType}; name="${att.filename}"\n`;
            raw += `Content-Disposition: attachment; filename="${att.filename}"\n`;
            raw += `Content-Transfer-Encoding: base64\n\n`;
            raw += att.base64Data + "\n\n";
        }
        raw += `--${boundary}--\n`;
    } else {
        raw += `Content-Type: text/html; charset=utf-8\n\n`;
        raw += params.body;
    }
    return Buffer.from(raw).toString("base64url");
}
async function fetchAttachmentData(accessToken, attachments) {
    const gmail = getGmailClient(accessToken);
    return Promise.all(attachments.map(async (att)=>{
        const res = await gmail.users.messages.attachments.get({
            userId: "me",
            messageId: att.messageId,
            id: att.id
        });
        // Gmail returns base64url data, convert to standard base64 with padding
        let base64Data = (res.data.data || "").replace(/-/g, "+").replace(/_/g, "/");
        const pad = (4 - base64Data.length % 4) % 4;
        if (pad) base64Data += "=".repeat(pad);
        return {
            filename: att.filename,
            mimeType: att.mimeType,
            base64Data
        };
    }));
}
function parseDraftResponse(data) {
    const msg = data.message || {};
    const headers = msg.payload?.headers || [];
    return {
        id: data.id || "",
        threadId: msg.threadId || undefined,
        to: parseEmailAddresses(parseHeader(headers, "To")),
        cc: parseEmailAddresses(parseHeader(headers, "Cc")),
        bcc: parseEmailAddresses(parseHeader(headers, "Bcc")),
        subject: parseHeader(headers, "Subject"),
        body: (()=>{
            const parts = msg.payload?.parts || [];
            const htmlPart = parts.find((p)=>p.mimeType === "text/html");
            const textPart = parts.find((p)=>p.mimeType === "text/plain");
            const bodyData = htmlPart?.body?.data || textPart?.body?.data || msg.payload?.body?.data;
            return bodyData ? Buffer.from(bodyData, "base64url").toString("utf-8") : "";
        })()
    };
}
}),
"[project]/src/lib/email/index.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "emailClient",
    ()=>emailClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2f$gmail$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/email/gmail.ts [app-route] (ecmascript)");
;
const emailClient = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2f$gmail$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["gmailClient"];
}),
"[project]/src/app/api/drafts/thread/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/email/index.ts [app-route] (ecmascript)");
;
;
;
async function GET(request) {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["auth"])();
    if (!session?.user?.id) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Unauthorized"
        }, {
            status: 401
        });
    }
    const accessToken = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getValidAccessToken"])(session.user.id, "google");
    if (!accessToken) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "No access token"
        }, {
            status: 403
        });
    }
    const threadId = request.nextUrl.searchParams.get("threadId");
    if (!threadId) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "threadId required"
        }, {
            status: 400
        });
    }
    try {
        const draft = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["emailClient"].getDraftsForThread(accessToken, threadId);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            draft
        });
    } catch (error) {
        console.error("Error fetching draft:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            draft: null
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__e37b913b._.js.map