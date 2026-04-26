import { NextRequest } from "next/server";
import { getSession } from "@/lib/sessionStore";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: { token?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ valid: false }, { status: 200 });
  }
  const session = getSession(body.token);
  if (!session) return Response.json({ valid: false });
  return Response.json({
    valid: true,
    promptsAllowed: session.promptsAllowed,
    promptsUsed: session.promptsUsed,
  });
}
