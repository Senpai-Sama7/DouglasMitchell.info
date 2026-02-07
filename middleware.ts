import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Generate cryptographically secure nonce for CSP using Web Crypto API (Edge Runtime compatible)
  const nonceArray = new Uint8Array(16);
  crypto.getRandomValues(nonceArray);
  const nonce = Buffer.from(nonceArray).toString('base64');

  const csp = `
    default-src 'self';
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
    font-src 'self' data:;
    img-src 'self' data: https: blob:;
    style-src 'self' 'nonce-${nonce}' 'unsafe-inline';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval';
    object-src 'none';
    connect-src 'self' https://api.github.com https://*.sanity.io https://apicdn.sanity.io https://upstash.io https://*.upstash.io wss://*.sanity.io;
    media-src 'self' https://cdn.sanity.io;
    worker-src 'self' blob:;
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, ' ')
    .trim();

  const response = NextResponse.next();

  // Content Security Policy
  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('X-Nonce', nonce);

  // Additional Security Headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=()'
  );
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );
  response.headers.set('X-DNS-Prefetch-Control', 'on');

  // Remove server information
  response.headers.delete('X-Powered-By');

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)', '/api/:path*'],
};
