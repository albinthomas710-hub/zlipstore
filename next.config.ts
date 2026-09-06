import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Auto-convert to WebP/AVIF and compress on the fly
    formats: ["image/avif", "image/webp"],
    // Responsive breakpoints matching mobile-first usage
    deviceSizes: [390, 430, 768, 1024, 1280, 1920],
    imageSizes: [64, 128, 256, 320, 480],
    // Minimize quality slightly — still looks great, much smaller file size
    // (great for low-end Android on slow connections)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    // Allow locally uploaded images from /public/uploads/ and root assets
    localPatterns: [
      {
        pathname: "/**",
        search: "",
      },
    ],
  },
  // Compress all responses
  compress: true,
};

export default nextConfig;
