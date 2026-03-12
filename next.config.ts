import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Cloudinary — covers all accounts & delivery types
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      // Cloudinary media (video thumbnails served as images)
      {
        protocol: "https",
        hostname: "cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
