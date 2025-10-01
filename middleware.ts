import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Generate cryptographically secure nonce for CSP using Web Crypto API (Edge Runtime compatible)
  const nonceArray = new Uint8Array(16)
  crypto.getRandomValues(nonceArray)
  const nonce = Buffer.from(nonceArray).toString('base64')
  
  const csp = `
    default-src 'self';
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
    font-src 'self' data:;
    img-src 'self' data: https://cdn.sanity.io;
    style-src 'self' 'nonce-${nonce}' 'unsafe-inline';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    object-src 'none';
    connect-src 'self' https://api.github.com https://*.sanity.io https://apicdn.sanity.io https://upstash.io https://*.upstash.io;
  `.replace(/\s{2,}/g, ' ').trim()

  const response = NextResponse.next()
  
  response.headers.set('Content-Security-Policy', csp)
  response.headers.set('X-Nonce', nonce)
  
  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
