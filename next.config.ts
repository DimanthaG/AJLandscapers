import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'qthneglmxqtsabqmylza.supabase.co',
        pathname: '/storage/v1/object/public/**',
      }
    ],
  },
};

export default nextConfig;
