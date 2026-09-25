import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/new-dns-scatter/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      
    ];
  },
  images: {
        remotePatterns: [
          {
            protocol: "https",
            hostname: "ik.imagekit.io",
            pathname: "/**",
          },
        ],
      },
};

export default nextConfig;
