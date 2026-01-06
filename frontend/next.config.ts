import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Allow images from the Backend Tunnel
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'stick-gis-tier-reflection.trycloudflare.com', // 👈 Backend Tunnel Hostname
      },
    ],
  },

  // 2. Proxy API & Uploads to Backend Tunnel
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://stick-gis-tier-reflection.trycloudflare.com/:path*', // 👈 Update this!
      },
      {
        source: '/uploads/:path*',
        destination: 'https://stick-gis-tier-reflection.trycloudflare.com/uploads/:path*', // 👈 Update this!
      },
    ];
  },
};

export default nextConfig;
