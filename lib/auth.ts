import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getSecret(): string {
  const secret = process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) throw new Error("SESSION_SECRET or ADMIN_PASSWORD required");
  return secret;
}

function createToken(username: string): string {
  const payload = JSON.stringify({
    u: username,
    t: Date.now(),
    r: randomBytes(16).toString("hex"),
  });
  const encoded = Buffer.from(payload).toString("base64url");
  const sig = createHmac("sha256", getSecret())
    .update(encoded)
    .digest("base64url");
  return `${encoded}.${sig}`;
}

function verifyToken(token: string): { username: string } | null {
  try {
    const [encoded, sig] = token.split(".");
    if (!encoded || !sig) return null;
    const expected = createHmac("sha256", getSecret())
      .update(encoded)
      .digest("base64url");
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8"),
    );
    if (payload.t && Date.now() - payload.t > SESSION_MAX_AGE * 1000)
      return null;
    return { username: payload.u };
  } catch {
    return null;
  }
}

export async function createSession(username: string): Promise<string> {
  return createToken(username);
}

export async function getSession(): Promise<{ username: string } | null> {
  const c = await cookies();
  const token = c.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function destroySession(): Promise<void> {
  const c = await cookies();
  c.delete(SESSION_COOKIE);
}

export { SESSION_COOKIE, SESSION_MAX_AGE };
