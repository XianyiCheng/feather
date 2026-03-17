"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!session) return null;

  return <AppShell />;
}
