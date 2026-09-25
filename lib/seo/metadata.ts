/**
 * SEO Metadata
 * Mobius Fly - Empty Leg Marketplace
 *
 * Central metadata builders. Every page goes through `buildMetadata` so that
 * canonical, Open Graph, Twitter and robots stay consistent.
 */

import type { Metadata, Viewport } from "next";
import { SITE_CONFIG, absoluteUrl } from "./config";

export { SITE_CONFIG, absoluteUrl };

// ============================================================================
// ROOT (applies to every route unless overridden)
// ============================================================================

export const baseViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: SITE_CONFIG.themeColor,
  colorScheme: "light dark",
};

export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  applicationName: SITE_CONFIG.name,
  title: {
    default: `${SITE_CONFIG.name} | Vuelos Empty Leg en Jet Privado en México`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [...SITE_CONFIG.keywords],
  authors: [{ name: SITE_CONFIG.name, url: SITE_CONFIG.url }],
  creator: SITE_CONFIG.name,
  publisher: SITE_CONFIG.legalName,
  category: "travel",
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    locale: SITE_CONFIG.locale,
    siteName: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    title: `${SITE_CONFIG.name} | Vuelos Empty Leg en Jet Privado en México`,
    description: SITE_CONFIG.description,
    // images: injected automatically by app/opengraph-image.tsx
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} | Vuelos Empty Leg en Jet Privado`,
    description: SITE_CONFIG.description,
    ...(SITE_CONFIG.twitterHandle && {
      site: SITE_CONFIG.twitterHandle,
      creator: SITE_CONFIG.twitterHandle,
    }),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    ...(SITE_CONFIG.googleVerification && { google: SITE_CONFIG.googleVerification }),
    ...(SITE_CONFIG.bingVerification && { other: { "msvalidate.01": SITE_CONFIG.bingVerification } }),
  },
  // Icons come from the app/icon + app/apple-icon file conventions.
  // Manifest comes from app/manifest.ts.
};

// ============================================================================
// GENERIC BUILDER
// ============================================================================

interface BuildMetadataInput {
  title: string;
  description: string;
  /** Site-relative path used for canonical + og:url, e.g. "/flights". */
  path: string;
  /** Absolute image URL. Defaults to the site-wide /opengraph-image. */
  image?: string;
  imageAlt?: string;
  noIndex?: boolean;
  /** index=false but keep following links (filtered/paginated views). */
  noIndexFollow?: boolean;
  keywords?: string[];
  type?: "website" | "article";
}

export function buildMetadata({
  title,
  description,
  path,
  image,
  imageAlt,
  noIndex,
  noIndexFollow,
  keywords,
  type = "website",
}: BuildMetadataInput): Metadata {
  const url = absoluteUrl(path);
  // Explicit image on every page: generateMetadata results don't reliably
  // inherit the root opengraph-image file convention.
  image = image ?? absoluteUrl("/opengraph-image");
  const images = [{ url: image, width: 1200, height: 630, alt: imageAlt ?? title }];

  return {
    title,
    description,
    ...(keywords && { keywords }),
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: SITE_CONFIG.name,
      locale: SITE_CONFIG.locale,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    ...(noIndex && { robots: noIndexMetadata.robots }),
    ...(noIndexFollow && {
      robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
    }),
  };
}

// ============================================================================
// NOINDEX (private / transactional / system routes)
// ============================================================================

export const noIndexMetadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
    googleBot: { index: false, follow: false, noarchive: true, nosnippet: true },
  },
};

/** Title-only helper for private pages: `noIndex("Mis viajes")`. */
export function privateMetadata(title: string): Metadata {
  return { title, ...noIndexMetadata };
}

// ============================================================================
// PAGE-SPECIFIC METADATA
// ============================================================================

export function getHomeMetadata(): Metadata {
  return buildMetadata({
    title: `${SITE_CONFIG.name} | Vuelos Empty Leg en Jet Privado en México`,
    description:
      "Reserva asientos o la aeronave completa en vuelos empty leg de jets privados verificados. Precios hasta una fracción de un chárter, pago seguro y confirmación inmediata.",
    path: "/",
    keywords: [...SITE_CONFIG.keywords],
  });
}

const MONTH_FORMAT = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "America/Mexico_City",
});

export function formatFlightDate(iso: string): string {
  return MONTH_FORMAT.format(new Date(iso));
}

export function formatMXN(amount: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export interface FlightMetaInput {
  id: string;
  originCity: string;
  originCode: string;
  destinationCity: string;
  destinationCode: string;
  departureISO: string;
  pricePerSeat?: number;
  availableSeats?: number;
  aircraft?: string;
  /** Past or unavailable flights are dropped from the index. */
  indexable: boolean;
}

export function getFlightMetadata(f: FlightMetaInput): Metadata {
  const date = formatFlightDate(f.departureISO);
  const title = `Vuelo privado ${f.originCity} (${f.originCode}) a ${f.destinationCity} (${f.destinationCode}) · ${date}`;
  const description = [
    `Vuelo empty leg en jet privado de ${f.originCity} a ${f.destinationCity} el ${date}.`,
    f.aircraft && `Aeronave: ${f.aircraft}.`,
    f.availableSeats && `${f.availableSeats} asientos disponibles.`,
    f.pricePerSeat && `Desde ${formatMXN(f.pricePerSeat)} por asiento.`,
    "Operador verificado y pago seguro.",
  ]
    .filter(Boolean)
    .join(" ");

  return buildMetadata({
    title,
    description,
    path: `/flights/${f.id}`,
    image: absoluteUrl(`/flights/${f.id}/opengraph-image`),
    imageAlt: `Vuelo privado ${f.originCode} a ${f.destinationCode}`,
    noIndexFollow: !f.indexable,
    // OG image: app/flights/[id]/opengraph-image.tsx
  });
}

export function getFlightsListMetadata(hasFilters: boolean, origin?: string, destination?: string): Metadata {
  const routed = origin && destination;
  const meta = buildMetadata({
    title: routed
      ? `Vuelos empty leg de ${origin} a ${destination}`
      : "Vuelos Empty Leg disponibles en jet privado",
    description: routed
      ? `Encuentra vuelos empty leg en jet privado de ${origin} a ${destination}. Compara precios por asiento y reserva en minutos con operadores verificados.`
      : "Explora vuelos empty leg en jets privados de todo México. Filtra por origen, destino y fecha, compara precios por asiento y reserva en minutos.",
    path: "/flights",
    // Filtered result pages are thin/duplicate: canonical -> /flights, out of the index.
    noIndexFollow: hasFilters,
  });
  return meta;
}

export function getLegalMetadata(type: "terms" | "privacy"): Metadata {
  const data = {
    terms: {
      title: "Términos y Condiciones",
      description:
        "Términos y condiciones generales de uso de Mobius Fly, el marketplace de vuelos empty leg en jets privados.",
    },
    privacy: {
      title: "Aviso de Privacidad",
      description:
        "Aviso de privacidad integral de Mobius Fly: cómo recabamos, usamos y protegemos tus datos personales.",
    },
  }[type];
  return buildMetadata({ ...data, path: `/${type}` });
}
