import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost'], // Add your image domains here
    disableStaticImages: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
