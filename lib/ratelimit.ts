import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

/** Best-effort client IP from proxy headers (Vercel sets x-forwarded-for). */
export function getClientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfter: number; // seconds
}

/**
 * Fixed-window rate limit backed by Postgres (see 20260718_rate_limits.sql).
 * Fails OPEN: if the limiter itself errors (e.g. migration not applied), we
 * allow the request rather than take the site down — but we log it.
 */
export async function rateLimit(key: string, limit: number, windowSeconds: number): Promise<RateLimitResult> {
  try {
    const { data, error } = await supabase.rpc('check_rate_limit', {
      p_key: key,
      p_limit: limit,
      p_window_seconds: windowSeconds,
    });

    if (error) {
      console.error('RATE LIMIT RPC ERROR:', error.message);
      return { allowed: true, retryAfter: 0 };
    }

    const row = (Array.isArray(data) ? data[0] : data) as { allowed?: boolean; retry_after?: number } | null;
    return {
      allowed: row?.allowed !== false,
      retryAfter: row?.retry_after ?? windowSeconds,
    };
  } catch (e) {
    console.error('RATE LIMIT ERROR:', e instanceof Error ? e.message : e);
    return { allowed: true, retryAfter: 0 };
  }
}

/** Standard 429 response with a Retry-After header. */
export function tooManyRequests(retryAfter: number) {
  return NextResponse.json(
    { error: 'Too many requests. Please slow down and try again shortly.' },
    { status: 429, headers: { 'Retry-After': String(Math.max(1, retryAfter)) } }
  );
}
