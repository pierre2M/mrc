import { createHmac, timingSafeEqual } from 'crypto';

export const QUOTA_LIMIT = 10_000;

interface QuotaData {
  used: number;
  day: string; // YYYY-MM-DD
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function hmac(data: string, secret: string): string {
  return createHmac('sha256', secret).update(data).digest('base64url');
}

export function encodeQuota(used: number, secret: string): string {
  const payload = JSON.stringify({ used, day: todayStr() } satisfies QuotaData);
  const b64 = Buffer.from(payload).toString('base64url');
  return `${b64}.${hmac(b64, secret)}`;
}

export function readQuota(cookie: string | undefined, secret: string): QuotaData {
  if (!cookie) return { used: 0, day: todayStr() };
  const dot = cookie.lastIndexOf('.');
  if (dot < 1) return { used: 0, day: todayStr() };
  const b64 = cookie.slice(0, dot);
  const sig  = cookie.slice(dot + 1);
  try {
    const expected = hmac(b64, secret);
    const a = Buffer.from(sig,      'base64url');
    const b = Buffer.from(expected, 'base64url');
    if (a.length !== b.length || !timingSafeEqual(a, b)) return { used: 0, day: todayStr() };
    const data = JSON.parse(Buffer.from(b64, 'base64url').toString()) as QuotaData;
    // Reset if day changed
    if (data.day !== todayStr()) return { used: 0, day: todayStr() };
    return data;
  } catch {
    return { used: 0, day: todayStr() };
  }
}
