import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["pdfkit"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  webpack(config, { nextRuntime }) {
    if (nextRuntime === "edge") {
      // @supabase/realtime-js pulls in the 'ws' Node.js library which is
      // incompatible with the edge runtime. The edge runtime has native
      // WebSocket support so aliasing ws to false is safe for middleware.
      config.resolve.alias = {
        ...(config.resolve.alias ?? {}),
        ws: false,
      };
    }
    return config;
  },
};

export default nextConfig;
