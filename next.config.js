/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'out',
  images: {
    unoptimized: true
  },
  basePath: '',
  assetPrefix: '',
  experimental: {
    workerThreads: false,
    cpus: 1
  },
  outputFileTracingRoot: __dirname,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
  webpack: config => config
}

module.exports = nextConfig
