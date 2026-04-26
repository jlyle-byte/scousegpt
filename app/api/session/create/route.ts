import { NextRequest } from "next/server";
import { createSession, type Tier } from "@/lib/sessionStore";
import { PAYWALL } from "@/lib/constants";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: { tier?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }
  const tier = body.tier as Tier | undefined;
  if (tier !== "beer" && tier !== "case") {
    return Response.json({ error: "Invalid tier" }, { status: 400 });
  }
  const promptsAllowed =
    tier === "beer" ? PAYWALL.messagesPerBeer : PAYWALL.messagesPerCase;
  const token = createSession(tier, promptsAllowed);
  return Response.json({ token, promptsAllowed });
}
