/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://orbis-production-6ad0.up.railway.app',
  },
  async rewrites() {
    return []
  },
}

module.exports = nextConfig
