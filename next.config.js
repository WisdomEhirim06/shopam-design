/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  trailingSlash: false,
  // Proxying is handled by app/api/[...path]/route.ts and app/admins/[...path]/route.ts
  // so that X-Forwarded-Host is NOT forwarded (the backend rejects localhost:3000).
}

module.exports = nextConfig