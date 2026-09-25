import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  serverExternalPackages: ["pdfkit"],
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    // Legacy/advertised URLs that never existed as pages -> real destinations.
    return [
      { source: "/search", destination: "/flights", permanent: true },
      { source: "/how-it-works", destination: "/#como-funciona", permanent: true },
      { source: "/benefits", destination: "/#beneficios", permanent: true },
      { source: "/faq", destination: "/#preguntas-frecuentes", permanent: true },
      { source: "/contact", destination: "/#contacto", permanent: true },
      { source: "/forgot-password", destination: "/recover-password", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*.(svg|png|jpg|jpeg|webp|avif|mp4|woff2)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
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
