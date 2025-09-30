const ContentSecurityPolicy = `
  default-src 'self';
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
  font-src 'self' data:;
  img-src 'self' data: https://cdn.sanity.io;
  style-src 'self' 'unsafe-inline';
  script-src 'self' 'unsafe-inline';
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
  output: 'export',
  images: {
    unoptimized: true
  },
  basePath: '',
  assetPrefix: '',
  outputFileTracingRoot: __dirname,
  distDir: 'out',
  trailingSlash: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
  webpack: (config, { isServer }) => {
    // Optimize for static export
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
  // Skip API routes during static export
  exportPathMap: async function (defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
    const paths = {}
    
    // Only include static pages for export
    paths['/'] = { page: '/' }
    paths['/resume'] = { page: '/resume' }
    
    return paths
  }
}

module.exports = nextConfig