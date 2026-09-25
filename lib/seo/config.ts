/**
 * SEO site configuration — single source of truth.
 * Mobius Fly - Empty Leg Marketplace
 */

const rawUrl = process.env.NEXT_PUBLIC_APP_URL;

// Never leak localhost into canonicals/sitemaps in production builds.
const isLocalUrl = !rawUrl || /localhost|127\.0\.0\.1/.test(rawUrl);
const url = (
  process.env.NODE_ENV === "production" && isLocalUrl
    ? "https://mobiusfly.com"
    : (rawUrl ?? "https://mobiusfly.com")
).replace(/\/$/, "");

export const SITE_CONFIG = {
  name: "Mobius Fly",
  legalName: "Mobius Fly, S.A. de C.V.",
  url,
  description:
    "Marketplace de vuelos empty leg en México. Reserva asientos en jets privados verificados a una fracción del costo de un chárter y vuela con total privacidad.",
  tagline: "Empty legs. Experiencia privada.",
  keywords: [
    "empty leg",
    "empty legs México",
    "vuelos empty leg",
    "jet privado",
    "vuelos privados",
    "chárter privado",
    "renta de jet privado",
    "aviación privada",
    "vuelos en jet privado baratos",
    "reservar asiento jet privado",
    "empty leg marketplace",
    "private jet empty legs",
  ],
  locale: "es_MX",
  language: "es-MX",
  themeColor: "#090E11",
  brandColor: "#C4A77D",
  currency: "MXN",
  email: "contacto@mobiusfly.com",
  address: {
    streetAddress: "Ignacio Morones Prieto 3050, Col. Del Carmen",
    addressLocality: "San Pedro Garza García",
    addressRegion: "Nuevo León",
    postalCode: "64710",
    addressCountry: "MX",
  },
  /** Add verified social profile URLs here (used for Organization.sameAs). */
  social: [] as string[],
  twitterHandle: process.env.NEXT_PUBLIC_TWITTER_HANDLE,
  googleVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  bingVerification: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
} as const;

/** Absolute URL from a site-relative path. */
export function absoluteUrl(path = "/"): string {
  return `${SITE_CONFIG.url}${path.startsWith("/") ? path : `/${path}`}`;
}
