/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  trailingSlash: false,

  // The customer and vendor sign-in pages were merged into /auth/signin.
  // Old links (bookmarks, verification emails) still point at /auth/user-signin;
  // query params (?redirect=, ?verified=1) are preserved automatically.
  async redirects() {
    return [
      {
        source: '/auth/user-signin',
        destination: '/auth/signin',
        permanent: false,
      },
    ];
  },
  // Proxying is handled by app/api/[...path]/route.ts and app/admins/[...path]/route.ts
  // so that X-Forwarded-Host is NOT forwarded (the backend rejects localhost:3000).

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevent the site from being embedded in iframes (clickjacking)
          { key: 'X-Frame-Options', value: 'DENY' },
          // Stop browsers from MIME-sniffing responses away from the declared content-type
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Send origin only on same-origin requests; omit it on cross-origin
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Restrict access to sensitive device APIs
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          // Allow browsers to prefetch DNS for linked origins (performance + security balance)
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
    ];
  },
}

module.exports = nextConfig