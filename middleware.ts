// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;
  const hostname = request.headers.get('host') || '';

  // Tanggalin ang port number para sa local machine server context testing
  const currentHost = hostname.replace(/:[0-9]+$/, '');

  // 🎯 CRITICAL GUARDRAIL: Kung ang request ay para sa mga static files, CSS, images, o API, HUWAG REWRITE!
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/assets') || 
    pathname.startsWith('/api') ||
    pathname.includes('.') // Sinasalo nito ang favicon.ico, .png, .webp, .css files etc.
  ) {
    return NextResponse.next();
  }

  // 🎯 MANUAL ISOLATION: Kapag wedding.nvitado.com ang nirequest ng browser
  if (currentHost === 'wedding.nvitado.com') {
    // 🎯 Iwasan ang infinite loops: Kung ang request ay papunta na mismo sa /wedding, tuloy lang
    if (pathname.startsWith('/wedding')) {
      return NextResponse.next();
    }
    
    // Itatapon natin ang traffic sa loob ng app/wedding folder nang ligtas
    url.pathname = `/wedding${pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

// 🎯 TAILWIND V4 & VERCEL ASSET PROTECTION MATCHER
export const config = {
  matcher: [
    /*
     * Patakbuhin lang ang middleware sa mga totoong page routes.
     * Iniiwasan nito ang pag-trigger sa mga nakatagong system files ng Next.js at Vercel pipeline.
     */
    '/((?!api|_next/static|_next/image|assets|favicon.ico|.*\\..*).*)',
  ],
};