import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';

  // Tanggalin ang port number para sa local machine server context testing
  const currentHost = hostname.replace(/:[0-9]+$/, '');

  // 🎯 MANUAL ISOLATION: Kapag wedding.nvitado.com ang nirequest ng browser
  if (currentHost === 'wedding.nvitado.com') {
    // Itatapon natin ang traffic sa loob ng app/wedding folder
    url.pathname = `/wedding${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}