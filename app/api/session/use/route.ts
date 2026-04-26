import { NextRequest } from "next/server";
import { incrementSession } from "@/lib/sessionStore";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: { token?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }
  const session = incrementSession(body.token);
  if (!session)
    return Response.json({ error: "Session not found" }, { status: 404 });
  return Response.json({
    promptsUsed: session.promptsUsed,
    promptsAllowed: session.promptsAllowed,
    remaining: Math.max(0, session.promptsAllowed - session.promptsUsed),
  });
}
