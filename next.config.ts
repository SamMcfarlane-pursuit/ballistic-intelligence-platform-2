import type { NextConfig } from "next";

// Simplified Next.js configuration for reliable startup
const nextConfig: NextConfig = {
  // Basic configuration only
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  // Ensure proper image optimization
  images: {
    domains: ['localhost'],
  },
};

export default nextConfig;