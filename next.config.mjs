/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error'],
    } : false,
  },
  experimental: {
    optimizeCss: true,
    // Add modern optimizations
    serverActions: {
      bodySizeLimit: '2mb',
    },
    // Improve hydration performance
    optimizePackageImports: [
      'framer-motion',
      '@heroicons/react',
      'lodash',
      'react-icons',
    ],
  },
  // Suppress hydration warnings in development
  onDemandEntries: {
    // Keep pages in memory for longer to prevent frequent rebuilds
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 5,
  },
};

export default nextConfig; 