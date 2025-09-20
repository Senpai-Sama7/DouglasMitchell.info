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
  swcMinify: false,
  experimental: {
    esmExternals: 'loose',
    workerThreads: false,
    cpus: 1
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
  webpack: (config, { dev, isServer }) => {
    // More aggressive stability fixes
    config.optimization.minimize = false
    config.cache = false

    // Reduce memory usage
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        maxAsyncRequests: 1,
        maxInitialRequests: 1,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          }
        }
      }
    }
    return config
  }
}

module.exports = nextConfig