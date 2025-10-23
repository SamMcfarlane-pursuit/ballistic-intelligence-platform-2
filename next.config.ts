import type { NextConfig } from "next";

// Enhanced Next.js configuration for Docker deployment and BrightData integration
const nextConfig: NextConfig = {
  // Docker-optimized configuration
  output: 'standalone',
  
  // Basic configuration
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Skip static generation for API routes and dynamic pages
  trailingSlash: false,
  
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Enhanced image optimization for Docker
  images: {
    domains: ['localhost', 'brightdata.com', 'crunchbase.com'],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  
  // Fix workspace root warning
  outputFileTracingRoot: __dirname,
  
  // Environment variables for BrightData integration
  env: {
    BRIGHTDATA_API_KEY: process.env.BRIGHTDATA_API_KEY,
    CRUNCHBASE_API_KEY: process.env.CRUNCHBASE_API_KEY,
  },
  
  // API routes configuration
  async rewrites() {
    return [
      {
        source: '/api/brightdata/:path*',
        destination: '/api/brightdata/:path*',
      },
      {
        source: '/api/crunchbase/:path*',
        destination: '/api/crunchbase/:path*',
      },
    ]
  },
  
  // Headers for BrightData CORS
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ]
  },
  
  // Webpack configuration for BrightData dependencies
  webpack: (config, { isServer }) => {
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
  
  // Build configuration
  generateBuildId: async () => {
    return 'ballistic-intelligence-' + Date.now()
  },
  
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    }
  },
};

export default nextConfig;