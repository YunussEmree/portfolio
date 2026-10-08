import { createHash } from "node:crypto";

/**
 * The shared "bugs fixed" counter: GET reads it, POST adds one. Stored in Upstash Redis (Vercel's Redis integration
 * provides KV_REST_API_URL / KV_REST_API_TOKEN). Without it, both answer 503 and the site shows each visitor's own count.
 */
export const dynamic = "force-dynamic";

const REDIS_URL = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
const TOTAL = "bugs:total";
const PER_MINUTE = 40; // per visitor, so nobody can run the number up with a script

async function redis(commands: (string | number)[][]): Promise<{ result: unknown }[]> {
  const res = await fetch(`${REDIS_URL}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(commands),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`redis ${res.status}`);
  return res.json();
}

const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function GET() {
  if (!REDIS_URL || !TOKEN) return json({ total: null }, 503);
  try {
    const [{ result }] = await redis([["GET", TOTAL]]);
    return json({ total: Number(result ?? 0) });
  } catch {
    return json({ total: null }, 502);
  }
}

export async function POST(request: Request) {
  if (!REDIS_URL || !TOKEN) return json({ total: null }, 503);
  // Only a hash of the address, for one minute, to rate-limit; it is never stored as is.
  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  const who = `bugs:rl:${createHash("sha256").update(ip).digest("hex").slice(0, 16)}`;
  try {
    const [{ result: hits }] = await redis([
      ["INCR", who],
      ["EXPIRE", who, 60],
    ]);
    const [{ result }] = await redis([Number(hits) > PER_MINUTE ? ["GET", TOTAL] : ["INCR", TOTAL]]);
    return json({ total: Number(result ?? 0) });
  } catch {
    return json({ total: null }, 502);
  }
}
