"use client";

import { useSession, signIn } from "next-auth/react";
import { AppShell } from "@/components/layout/AppShell";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="h-8 flex-shrink-0 bg-gray-950 fixed top-0 left-0 right-0" style={{ WebkitAppRegion: "drag" } as React.CSSProperties} />
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center">
        <div className="h-8 flex-shrink-0 bg-gray-950 fixed top-0 left-0 right-0" style={{ WebkitAppRegion: "drag" } as React.CSSProperties} />
        <span className="text-2xl text-gray-400 mb-8" style={{ fontFamily: "var(--font-alumni), sans-serif", fontStyle: "italic", letterSpacing: "0.12em" }}>
          feather
        </span>
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-sm font-medium transition-colors border border-gray-700"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return <AppShell />;
}
