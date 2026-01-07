import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
      },
    ],
  },

  async rewrites() {
    return [
      {
        // When you fetch('/api/courses'), it goes to http://localhost:4000/api/courses
        source: '/api/:path*',
        destination: 'http://localhost:4000/api/:path*', 
      },
      {
        // For your faculty/course images stored in the uploads folder
        source: '/uploads/:path*',
        destination: 'http://localhost:4000/uploads/:path*',
      },
    ];
  },
};

export default nextConfig;
