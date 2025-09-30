// CSP will be dynamically generated with nonces in middleware
function generateCSP(nonce) {
  return `
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
}

const ContentSecurityPolicy = `
  default-src 'self';
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
  font-src 'self' data:;
  img-src 'self' data: https://cdn.sanity.io;
  style-src 'self' 'unsafe-inline';
  script-src 'self' 'unsafe-inline';
  object-src 'none';
  connect-src 'self' https://api.github.com https://*.sanity.io https://apicdn.sanity.io https://upstash.io https://*.upstash.io;
`.replace(/\s{2,}/g, ' ').trim()

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  }
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Dynamic build - includes API routes
  images: {
    unoptimized: true
  },
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  outputFileTracingRoot: __dirname,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
  webpack: (config, { isServer }) => {
    // Optimize bundle size
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders
      }
    ]
  },
  // Enable when needed for static export
  ...(process.env.NEXT_EXPORT === 'true' && {
    output: 'export',
    distDir: 'out',
    trailingSlash: true
  })
}

module.exports = nextConfig
