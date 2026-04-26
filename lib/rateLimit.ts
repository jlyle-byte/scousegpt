const WINDOW_MS = 60_000;
const MAX = 20;
const hits = new Map<string, number[]>();

export function rateLimit(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (arr.length >= MAX) return false;
  arr.push(now);
  hits.set(ip, arr);
  return true;
}
