import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use src directory
  appDir: true,
  
  // Allow images from Cloudinary
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
