import { randomUUID } from "node:crypto";

export type Tier = "beer" | "case";
export type Session = {
  tier: Tier;
  promptsAllowed: number;
  promptsUsed: number;
  createdAt: number;
};

const store = new Map<string, Session>();

export function createSession(tier: Tier, promptsAllowed: number): string {
  const token = randomUUID();
  store.set(token, {
    tier,
    promptsAllowed,
    promptsUsed: 0,
    createdAt: Date.now(),
  });
  return token;
}

export function getSession(token: unknown): Session | null {
  if (typeof token !== "string" || !token) return null;
  return store.get(token) ?? null;
}

export function incrementSession(token: unknown): Session | null {
  if (typeof token !== "string" || !token) return null;
  const s = store.get(token);
  if (!s) return null;
  s.promptsUsed += 1;
  return s;
}
