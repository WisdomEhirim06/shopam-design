/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // Cache images for 30 days
  },
  // Preserve trailing slashes on API routes so Django's APPEND_SLASH doesn't reject POST requests
  trailingSlash: false,
  async rewrites() {
    return [
      {
        // Match with trailing slash (preserved as-is)
        source: '/api/:path*/',
        destination: 'https://api.shopam.net/api/:path*/',
      },
      {
        // Match without trailing slash — append it so Django is happy
        source: '/api/:path*',
        destination: 'https://api.shopam.net/api/:path*/',
      },
    ];
  },
}

module.exports = nextConfig