/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error'],
    } : false,
  },
  experimental: {
    optimizeCss: true,
  },
  // Suppress hydration warnings in development
  onDemandEntries: {
    // Keep pages in memory for longer to prevent frequent rebuilds
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 5,
  },
}

// Add hydration error suppression in development
if (process.env.NODE_ENV === 'development') {
  // Suppress specific React hydration warnings in the console
  const originalConsoleError = console.error;
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: Text content did not match') ||
        args[0].includes('Warning: Expected server HTML to contain') ||
        args[0].includes('Hydration failed because'))
    ) {
      return;
    }
    originalConsoleError(...args);
  };
}

module.exports = nextConfig 