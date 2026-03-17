import { NextResponse } from "next/server";
import { auth, getLinkedAccounts } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const linked = await getLinkedAccounts(session.user.id);
  const hasGmail = linked.some((a) => a.provider === "google");

  return NextResponse.json({ accounts: hasGmail ? ["gmail"] : [] });
}
