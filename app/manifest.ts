import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/seo/config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: SITE_CONFIG.name,
    short_name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    lang: SITE_CONFIG.language,
    dir: "ltr",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: SITE_CONFIG.themeColor,
    theme_color: SITE_CONFIG.themeColor,
    categories: ["travel", "business"],
    icons: [
      { src: "/logo/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/logo/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/logo/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      {
        name: "Buscar vuelos",
        short_name: "Vuelos",
        description: "Busca vuelos empty leg disponibles",
        url: "/flights",
        icons: [{ src: "/logo/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
