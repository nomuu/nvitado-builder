// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ============================================================
// EDGE RATE LIMITING (runs BEFORE any route handler / DB query)
//
// Blocked requests are rejected here at the edge with a 429, so they never
// reach the API route and never touch the database. This is what protects the
// DB from spam/DDoS floods — a DB-backed limiter would itself query the DB on
// every request and defeat the purpose.
//
// Storage is in-memory per edge instance (no KV/Redis dependency). This is
// best-effort: it fully stops single-source floods (which land on the same
// warm instance) and dramatically cuts DB load. For distributed/volumetric
// DDoS across thousands of IPs, rely on Vercel's platform DDoS protection /
// WAF, and optionally upgrade this to Upstash Ratelimit for shared state.
// ============================================================

const RATE_LIMITS: { prefix: string; limit: number; windowMs: number }[] = [
  { prefix: '/api/rsvp', limit: 15, windowMs: 10_000 },            // ~1.5 req/s per IP
  { prefix: '/api/reviews', limit: 5, windowMs: 60_000 },
  { prefix: '/api/checkout_lemon', limit: 10, windowMs: 60_000 },
  { prefix: '/api/verify-invitation', limit: 5, windowMs: 60_000 },
  { prefix: '/api/verify-otp', limit: 10, windowMs: 60_000 },
];

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();
let lastSweep = Date.now();

// Opportunistically drop expired buckets so the map can't grow unbounded.
function sweep(now: number) {
  if (now - lastSweep < 30_000) return;
  lastSweep = now;
  for (const [k, v] of buckets) {
    if (now > v.resetAt) buckets.delete(k);
  }
}

function hit(key: string, limit: number, windowMs: number): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  sweep(now);
  const b = buckets.get(key);
  if (!b || now > b.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }
  b.count += 1;
  if (b.count > limit) {
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((b.resetAt - now) / 1000)) };
  }
  return { allowed: true, retryAfter: 0 };
}

function getIp(request: NextRequest): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;
  const hostname = request.headers.get('host') || '';
  const currentHost = hostname.replace(/:[0-9]+$/, '');

  // 1) 🛡️ Rate limit sensitive API endpoints at the edge (before the DB).
  const rule = RATE_LIMITS.find((r) => pathname === r.prefix || pathname.startsWith(r.prefix + '/'));
  if (rule) {
    const ip = getIp(request);
    const { allowed, retryAfter } = hit(`${rule.prefix}:${ip}`, rule.limit, rule.windowMs);
    if (!allowed) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests. Please slow down and try again shortly.' }),
        {
          status: 429,
          headers: {
            'content-type': 'application/json',
            'Retry-After': String(retryAfter),
            'Cache-Control': 'no-store',
          },
        }
      );
    }
    // Allowed API request → let it continue to the route.
    return NextResponse.next();
  }

  // 2) Skip static files, assets, and other API routes (no rewrite).
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 3) 🎯 Wedding subdomain isolation (unchanged).
  if (currentHost === 'wedding.nvitado.com') {
    if (pathname.startsWith('/wedding')) {
      return NextResponse.next();
    }
    url.pathname = `/wedding${pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Sensitive API endpoints (for edge rate limiting)
    '/api/rsvp',
    '/api/rsvp/:path*',
    '/api/reviews',
    '/api/checkout_lemon',
    '/api/verify-invitation',
    '/api/verify-otp',
    // Page routes (for wedding subdomain rewrite) — excludes api/static/assets.
    '/((?!api|_next/static|_next/image|assets|favicon.ico|.*\\..*).*)',
  ],
};
