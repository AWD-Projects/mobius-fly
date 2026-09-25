/**
 * JSON-LD Structured Data
 * Mobius Fly - Empty Leg Marketplace
 *
 * Entities are linked through stable @id values so search engines resolve one
 * Organization / WebSite across every page.
 */

import { SITE_CONFIG, absoluteUrl } from "./config";

type Schema = Record<string, unknown>;

export const ORG_ID = `${SITE_CONFIG.url}/#organization`;
export const WEBSITE_ID = `${SITE_CONFIG.url}/#website`;

// ============================================================================
// SITE-WIDE
// ============================================================================

export function getOrganizationSchema(): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE_CONFIG.name,
    legalName: SITE_CONFIG.legalName,
    url: SITE_CONFIG.url,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/logo/icon-512.png"),
      width: 512,
      height: 512,
    },
    image: absoluteUrl("/opengraph-image"),
    description: SITE_CONFIG.description,
    slogan: SITE_CONFIG.tagline,
    email: SITE_CONFIG.email,
    address: { "@type": "PostalAddress", ...SITE_CONFIG.address },
    areaServed: { "@type": "Country", name: "México" },
    knowsLanguage: ["es", "en"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: SITE_CONFIG.email,
      availableLanguage: ["Spanish", "English"],
      areaServed: "MX",
    },
    ...(SITE_CONFIG.social.length > 0 && { sameAs: [...SITE_CONFIG.social] }),
  };
}

export function getWebSiteSchema(): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    inLanguage: SITE_CONFIG.language,
    publisher: { "@id": ORG_ID },
  };
}

export function getServiceSchema(): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_CONFIG.url}/#service`,
    name: "Reserva de vuelos empty leg en jet privado",
    serviceType: "Marketplace de vuelos empty leg",
    description:
      "Compra asientos individuales o la aeronave completa en vuelos empty leg de jets privados operados por proveedores verificados.",
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "Country", name: "México" },
    audience: { "@type": "Audience", audienceType: "Viajeros y propietarios de aeronaves" },
    url: absoluteUrl("/flights"),
  };
}

export function getWebPageSchema(opts: { path: string; name: string; description: string }): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${absoluteUrl(opts.path)}#webpage`,
    url: absoluteUrl(opts.path),
    name: opts.name,
    description: opts.description,
    inLanguage: SITE_CONFIG.language,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
  };
}

// ============================================================================
// FAQ / BREADCRUMBS
// ============================================================================

export interface FAQItem {
  question: string;
  answer: string;
}

export function getFAQSchema(faqs: FAQItem[]): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: SITE_CONFIG.language,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function getBreadcrumbSchema(items: { name: string; url: string }[]): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

// ============================================================================
// FLIGHT
// ============================================================================

export interface FlightSchemaInput {
  id: string;
  flightCode: string;
  origin: { code: string; name: string; city: string; state?: string; country?: string };
  destination: { code: string; name: string; city: string; state?: string; country?: string };
  departureISO: string;
  arrivalISO?: string;
  durationMinutes?: number | null;
  aircraft?: string;
  pricePerSeat: number;
  currency: string;
  availableSeats: number;
  photos?: string[];
}

function airportSchema(a: FlightSchemaInput["origin"]): Schema {
  return {
    "@type": "Airport",
    iataCode: a.code,
    name: a.name,
    address: {
      "@type": "PostalAddress",
      addressLocality: a.city,
      ...(a.state && { addressRegion: a.state }),
      ...(a.country && { addressCountry: a.country }),
    },
  };
}

/**
 * Flight + Product/Offer graph for a flight detail page.
 * Offer availability reflects real seat inventory and departure date.
 */
export function getFlightGraphSchema(f: FlightSchemaInput): Schema {
  const url = absoluteUrl(`/flights/${f.id}`);
  const departed = new Date(f.departureISO).getTime() < Date.now();
  const inStock = f.availableSeats > 0 && !departed;
  const routeName = `${f.origin.city} (${f.origin.code}) → ${f.destination.city} (${f.destination.code})`;

  const offer: Schema = {
    "@type": "Offer",
    url,
    price: f.pricePerSeat.toFixed(2),
    priceCurrency: f.currency,
    availability: inStock ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
    priceValidUntil: f.departureISO.slice(0, 10),
    seller: { "@id": ORG_ID },
    itemCondition: "https://schema.org/NewCondition",
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Flight",
        "@id": `${url}#flight`,
        flightNumber: f.flightCode,
        name: `Vuelo privado ${routeName}`,
        url,
        departureAirport: airportSchema(f.origin),
        arrivalAirport: airportSchema(f.destination),
        departureTime: f.departureISO,
        ...(f.arrivalISO && { arrivalTime: f.arrivalISO }),
        ...(f.durationMinutes && { estimatedFlightDuration: `PT${f.durationMinutes}M` }),
        ...(f.aircraft && { aircraft: { "@type": "Vehicle", name: f.aircraft } }),
        provider: { "@id": ORG_ID },
        seller: { "@id": ORG_ID },
        offers: offer,
      },
      {
        "@type": "Product",
        "@id": `${url}#product`,
        name: `Asiento en vuelo empty leg ${routeName}`,
        description: `Asiento en jet privado de ${f.origin.city} a ${f.destination.city} el ${f.departureISO.slice(0, 10)}.`,
        category: "Aviación privada",
        sku: f.flightCode,
        brand: { "@id": ORG_ID },
        ...(f.photos && f.photos.length > 0 && { image: f.photos }),
        offers: offer,
      },
    ],
  };
}

// ============================================================================
// SERIALIZATION
// ============================================================================

/**
 * Serialize for a <script type="application/ld+json"> tag.
 * Escapes `<` (prevents `</script>` breakouts) and U+2028/2029.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
