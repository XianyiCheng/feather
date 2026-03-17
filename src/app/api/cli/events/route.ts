import { pollEvent } from "@/lib/event-bus";

export const dynamic = "force-dynamic";

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode("data: {\"type\":\"connected\"}\n\n"));

      let lastSeen = Date.now();

      // Poll the shared event file every 200ms
      const interval = setInterval(() => {
        try {
          const event = pollEvent(lastSeen);
          if (event) {
            lastSeen = event._ts;
            const { _ts, ...payload } = event;
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(payload)}\n\n`)
            );
          }
        } catch {
          // stream closed
          clearInterval(interval);
        }
      }, 200);

      // Keep-alive ping every 30s
      const pingInterval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode("data: {\"type\":\"ping\"}\n\n"));
        } catch {
          clearInterval(pingInterval);
        }
      }, 30000);

      (controller as any).__cleanup = () => {
        clearInterval(interval);
        clearInterval(pingInterval);
      };
    },
    cancel(controller: any) {
      controller?.__cleanup?.();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
