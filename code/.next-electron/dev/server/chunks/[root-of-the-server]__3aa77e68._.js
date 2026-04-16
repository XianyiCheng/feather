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
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/src/lib/event-bus.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "emitEvent",
    ()=>emitEvent,
    "pollEvents",
    ()=>pollEvents
]);
/**
 * Server-side event bus for pushing CLI commands to the browser via SSE.
 *
 * Uses a temp file as a shared signaling channel because Next.js may
 * evaluate route modules in isolated contexts where `globalThis` singletons
 * are not actually shared.
 */ var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
const EVENT_FILE = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), ".cli-events.json");
function emitEvent(event) {
    const entry = {
        ...event,
        _ts: Date.now()
    };
    try {
        let queue = [];
        if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(EVENT_FILE)) {
            try {
                const raw = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(EVENT_FILE, "utf-8");
                const parsed = JSON.parse(raw);
                queue = Array.isArray(parsed) ? parsed : [
                    parsed
                ];
            } catch  {}
        }
        queue.push(entry);
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].writeFileSync(EVENT_FILE, JSON.stringify(queue), "utf-8");
    } catch (err) {
        console.error("[event-bus] Failed to write event file:", err);
        throw err;
    }
}
function pollEvents(since) {
    try {
        if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(EVENT_FILE)) return [];
        const raw = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(EVENT_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        const queue = Array.isArray(parsed) ? parsed : [
            parsed
        ];
        // Prune events older than 30 seconds to prevent unbounded growth
        const cutoff = Date.now() - 30_000;
        const live = queue.filter((e)=>e._ts > cutoff);
        if (live.length !== queue.length) {
            __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].writeFileSync(EVENT_FILE, JSON.stringify(live), "utf-8");
        }
        return live.filter((e)=>e._ts > since);
    } catch  {
        return [];
    }
}
}),
"[project]/src/app/api/cli/events/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$event$2d$bus$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/event-bus.ts [app-route] (ecmascript)");
;
const dynamic = "force-dynamic";
async function GET() {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        start (controller) {
            controller.enqueue(encoder.encode("data: {\"type\":\"connected\"}\n\n"));
            let lastSeen = Date.now();
            // Poll the shared event file every 200ms
            const interval = setInterval(()=>{
                try {
                    const events = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$event$2d$bus$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pollEvents"])(lastSeen);
                    for (const event of events){
                        lastSeen = event._ts;
                        const { _ts, ...payload } = event;
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
                    }
                } catch  {
                    // stream closed
                    clearInterval(interval);
                }
            }, 200);
            // Keep-alive ping every 30s
            const pingInterval = setInterval(()=>{
                try {
                    controller.enqueue(encoder.encode("data: {\"type\":\"ping\"}\n\n"));
                } catch  {
                    clearInterval(pingInterval);
                }
            }, 30000);
            controller.__cleanup = ()=>{
                clearInterval(interval);
                clearInterval(pingInterval);
            };
        },
        cancel (controller) {
            controller?.__cleanup?.();
        }
    });
    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive"
        }
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__3aa77e68._.js.map